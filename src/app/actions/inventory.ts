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
  const isPermanent = formData.get("is_permanent") === "true";
  
  const homeId = await getHomeId();
  if (!homeId) return redirect("/login");
  
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  // 1. Crear producto
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      home_id: homeId,
      category_id: categoryId || null,
      name,
      unit,
      minimum_quantity: minQty,
      is_permanent: isPermanent,
      added_by: user.id
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

  // Automatic addition to shopping list if exhausted or below minimum
  if (status === "agotado" || status === "poco") {
    // Check if it's already in the shopping list (unpurchased)
    const { data: inventoryItem } = await supabase
      .from("inventory")
      .select("product_id, home_id, products(name)")
      .eq("id", inventoryId)
      .single();

    if (inventoryItem) {
      const { data: existing } = await supabase
        .from("shopping_items")
        .select("id")
        .eq("product_id", inventoryItem.product_id)
        .is("purchase_id", null)
        .single();

      // If not in active shopping list, add it automatically
      if (!existing) {
        await supabase
          .from("shopping_items")
          .insert({
            home_id: inventoryItem.home_id,
            product_id: inventoryItem.product_id,
            name: (inventoryItem.products as any)?.name || "Producto sin nombre",
            planning_week: 'Semana 1' // Default week
          });
      }
    }
  }

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

export async function addToShoppingList(inventoryId: string) {
  const supabase = await createClient();
  
  const { data: inventoryItem } = await supabase
    .from("inventory")
    .select("product_id, home_id, products(name)")
    .eq("id", inventoryId)
    .single();

  if (inventoryItem) {
    const { data: existing } = await supabase
      .from("shopping_items")
      .select("id")
      .eq("product_id", inventoryItem.product_id)
      .is("purchase_id", null)
      .single();

    if (!existing) {
      await supabase
        .from("shopping_items")
        .insert({
          home_id: inventoryItem.home_id,
          product_id: inventoryItem.product_id,
          name: (inventoryItem.products as any)?.name || "Producto sin nombre",
          planning_week: 'Semana 1'
        });
    }
  }

  revalidatePath("/inventory");
  revalidatePath("/shopping");
}

export async function deleteInventoryProduct(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const homeId = await getHomeId();
  if (!homeId) return;

  await supabase
    .from("products")
    .delete()
    .eq("id", productId)
    .eq("home_id", homeId);

  revalidatePath("/inventory");
}
