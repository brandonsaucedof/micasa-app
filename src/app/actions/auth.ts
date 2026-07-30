"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?error=No+se+pudo+autenticar+al+usuario");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string; // opcional para guardar en users, lo haremos por triggers luego o update

  const supabase = await createClient();

  // Opcionalmente podemos guardar el name en los metadatos
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      }
    }
  });

  if (error) {
    return redirect("/register?error=Error+al+crear+la+cuenta");
  }

  // Nota: si tienes confirmación de email activada en supabase
  // el usuario será redirigido con éxito pero deberá confirmar.
  // Como no sabemos la config del user, mostraremos mensaje genérico.
  return redirect("/login?success=Cuenta+creada.+Revisa+tu+correo+para+confirmar");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function updateProfile(formData: FormData) {
  const name = formData.get("name") as string;
  if (!name || name.trim() === "") return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Actualizar metadata
  const { error: authError } = await supabase.auth.updateUser({
    data: { name }
  });

  if (authError) throw new Error(authError.message);

  // Actualizar tabla publica users
  const { error: dbError } = await supabase
    .from("users")
    .update({ name })
    .eq("id", user.id);

  if (dbError) throw new Error(dbError.message);

  revalidatePath("/settings");
  revalidatePath("/");
}
