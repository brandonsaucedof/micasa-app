import { cache } from "react";
import { createClient } from "./server";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

export const getHomeMembership = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("home_members")
    .select("home_id, homes(id, name)")
    .eq("user_id", user.id)
    .single();
  return data;
});
