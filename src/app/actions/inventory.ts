"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

async function getHomeId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id")
    .eq("user_id", user.id)
    .single();

  return membership?.home_id || null;
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const icon = formData.get("icon") as string || "tag";
  const homeId = await getHomeId();

  if (!homeId) {
    redirect("/inventory/new?message=No+se+encontró+la+casa");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("categories").insert({
    home_id: homeId,
    name,
    icon
  });

  if (error) {
    redirect("/inventory/new?message=Error+al+crear+categoría");
  }

  revalidatePath("/inventory");
  redirect("/inventory/new");
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const categoryId = formData.get("category_id") as string;
  const unit = formData.get("unit") as string || "un";
  const minQty = parseFloat(formData.get("minimum_quantity") as string) || 0;
  const initialQty = parseFloat(formData.get("initial_quantity") as string) || 0;
  
  const homeId = await getHomeId();
  if (!homeId) return redirect("/login");

  const supabase = await createClient();

  // 1. Crear producto
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      home_id: homeId,
      category_id: categoryId || null,
      name,
      unit,
      minimum_quantity: minQty
    })
    .select()
    .single();

  if (productError || !product) {
    return redirect("/inventory/new?message=Error+al+crear+producto");
  }

  // 2. Crear inventario inicial
  let status = "suficiente";
  if (initialQty <= 0) status = "agotado";
  else if (initialQty <= minQty) status = "poco";

  const { error: invError } = await supabase
    .from("inventory")
    .insert({
      home_id: homeId,
      product_id: product.id,
      quantity: initialQty,
      status
    });

  if (invError) {
    return redirect("/inventory/new?message=Error+al+crear+inventario");
  }

  revalidatePath("/inventory");
  redirect("/inventory");
}

export async function updateInventoryQuantity(inventoryId: string, newQuantity: number, minQuantity: number) {
  const supabase = await createClient();
  
  // Calcular nuevo estado automáticamente (solo como sugerencia, el usuario puede cambiarlo)
  let status = "suficiente";
  if (newQuantity <= 0) status = "agotado";
  else if (newQuantity <= minQuantity) status = "poco";

  await supabase
    .from("inventory")
    .update({ 
      quantity: newQuantity, 
      status,
      updated_at: new Date().toISOString()
    })
    .eq("id", inventoryId);

  revalidatePath("/inventory");
}

export async function updateInventoryStatus(inventoryId: string, newStatus: string) {
  const supabase = await createClient();
  
  await supabase
    .from("inventory")
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", inventoryId);

  revalidatePath("/inventory");
}
