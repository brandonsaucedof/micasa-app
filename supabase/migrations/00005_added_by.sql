-- ==========================================
-- Migración 00005: Added By en Productos y Correcciones RLS
-- ==========================================

-- Añadir referencia al usuario que creó el producto
ALTER TABLE public.products ADD COLUMN added_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- Arreglar política de RLS para que los miembros de la familia puedan ver los nombres de los demás
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view any profile"
  ON public.users FOR SELECT
  USING (auth.uid() IS NOT NULL);
