-- ==========================================
-- Migración 00006: Permisos de Borrado
-- ==========================================

-- Permitir a los miembros del hogar eliminar productos (y por cascada inventario)
CREATE POLICY "Members can delete their products"
  ON public.products FOR DELETE
  USING (public.is_home_member(home_id));
