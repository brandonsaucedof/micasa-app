"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function getHomeId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, homeId: null };

  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id")
    .eq("user_id", user.id)
    .single();

  return { user, homeId: membership?.home_id || null };
}

export async function addShoppingItem(formData: FormData) {
  const name = formData.get("name") as string;
  const productId = formData.get("product_id") as string || null;
  const planningWeek = formData.get("planning_week") as string || "Semana 1";
  
  const { user, homeId } = await getHomeId();
  if (!homeId || !user) return redirect("/login");

  const supabase = await createClient();
  const { error } = await supabase.from("shopping_items").insert({
    home_id: homeId,
    name,
    product_id: productId,
    added_by: user.id,
    planning_week: planningWeek
  });

  revalidatePath("/shopping");
  if (error) {
    redirect("/shopping?message=Error+al+añadir+item");
  }
}

export async function toggleShoppingItem(itemId: string, isPurchased: boolean) {
  const { homeId } = await getHomeId();
  if (!homeId) return;

  const supabase = await createClient();
  await supabase
    .from("shopping_items")
    .update({ is_purchased: isPurchased })
    .eq("id", itemId)
    .eq("home_id", homeId); // extra security

  revalidatePath("/shopping");
}

export async function deleteShoppingItem(itemId: string) {
  const { homeId } = await getHomeId();
  if (!homeId) return;

  const supabase = await createClient();
  await supabase
    .from("shopping_items")
    .delete()
    .eq("id", itemId)
    .eq("home_id", homeId);

  revalidatePath("/shopping");
}

export async function checkoutPurchase(formData: FormData) {
  const totalAmount = parseFloat(formData.get("total_amount") as string) || 0;
  const storeName = formData.get("store_name") as string || null;
  
  const { user, homeId } = await getHomeId();
  if (!homeId || !user) return redirect("/login");

  const supabase = await createClient();

  // 1. Obtener los items tachados de la lista actual (sin purchase_id asignado)
  const { data: items } = await supabase
    .from("shopping_items")
    .select("id, product_id")
    .eq("home_id", homeId)
    .eq("is_purchased", true)
    .is("purchase_id", null);

  if (!items || items.length === 0) {
    return redirect("/shopping?message=No+hay+items+marcados+para+pagar");
  }

  // 2. Crear el recibo (Purchase)
  const { data: purchase, error: purchaseError } = await supabase
    .from("purchases")
    .insert({
      home_id: homeId,
      buyer_id: user.id,
      total_amount: totalAmount,
      store_name: storeName
    })
    .select()
    .single();

  if (purchaseError || !purchase) {
    return redirect("/shopping?message=Error+al+procesar+el+pago");
  }

  // 3. Asignar el purchase_id a los items comprados
  const itemIds = items.map(i => i.id);
  await supabase
    .from("shopping_items")
    .update({ purchase_id: purchase.id })
    .in("id", itemIds);

  // 4. (Opcional pero recomendado) Actualizar el estado del inventario a "suficiente"
  const productIds = items.filter(i => i.product_id).map(i => i.product_id);
  if (productIds.length > 0) {
    await supabase
      .from("inventory")
      .update({ status: 'suficiente', quantity: 1 }) // Ponemos cantidad = 1 por defecto para que no siga en 0
      .in("product_id", productIds);
  }

  revalidatePath("/shopping");
  revalidatePath("/inventory");
  revalidatePath("/expenses");
  redirect("/expenses");
}
