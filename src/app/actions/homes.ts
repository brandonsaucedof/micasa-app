"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// Generar un código alfanumérico aleatorio de 6 dígitos
function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function createHome(formData: FormData) {
  const name = formData.get("name") as string;
  const supabase = await createClient();

  // 1. Obtener usuario actual
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return redirect("/login");
  }

  // 2. Crear la casa
  const inviteCode = generateInviteCode();
  const { data: home, error: homeError } = await supabase
    .from("homes")
    .insert({
      name,
      invite_code: inviteCode
    })
    .select()
    .single();

  if (homeError || !home) {
    return redirect("/setup?message=Error+al+crear+la+casa");
  }

  // 3. Agregar al usuario como admin
  const { error: memberError } = await supabase
    .from("home_members")
    .insert({
      home_id: home.id,
      user_id: user.id,
      role: 'admin'
    });

  if (memberError) {
    return redirect("/setup?message=Error+al+asignar+permisos");
  }

  // Redirigir al inicio, ahora con casa
  revalidatePath("/", "layout");
  redirect("/");
}

export async function joinHome(formData: FormData) {
  const inviteCode = (formData.get("code") as string).toUpperCase().trim();
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return redirect("/login");
  }

  // 1. Buscar la casa por código
  const { data: home, error: homeError } = await supabase
    .from("homes")
    .select("id")
    .eq("invite_code", inviteCode)
    .single();

  if (homeError || !home) {
    return redirect("/setup?message=Código+inválido+o+casa+no+encontrada");
  }

  // 2. Agregar al usuario como miembro
  const { error: memberError } = await supabase
    .from("home_members")
    .insert({
      home_id: home.id,
      user_id: user.id,
      role: 'member'
    });

  if (memberError) {
    if (memberError.code === '23505') { // Ya es miembro (unique violation)
      return redirect("/");
    }
    return redirect("/setup?message=Error+al+unirse+a+la+casa");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
