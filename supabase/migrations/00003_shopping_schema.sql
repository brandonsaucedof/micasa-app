-- ==========================================
-- Tabla de Compras/Recibos (Purchases)
-- ==========================================
CREATE TABLE public.purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE,
  buyer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  store_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their home purchases"
  ON public.purchases FOR SELECT
  USING (public.is_home_member(home_id));

CREATE POLICY "Members can insert purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (public.is_home_member(home_id));

CREATE POLICY "Members can update their home purchases"
  ON public.purchases FOR UPDATE
  USING (public.is_home_member(home_id));

-- ==========================================
-- Tabla de Artículos de la Lista de Compras (Shopping Items)
-- ==========================================
CREATE TABLE public.shopping_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  name TEXT NOT NULL, -- Por si es un item libre que no está en el inventario
  is_purchased BOOLEAN DEFAULT false,
  added_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their shopping items"
  ON public.shopping_items FOR SELECT
  USING (public.is_home_member(home_id));

CREATE POLICY "Members can insert shopping items"
  ON public.shopping_items FOR INSERT
  WITH CHECK (public.is_home_member(home_id));

CREATE POLICY "Members can update their shopping items"
  ON public.shopping_items FOR UPDATE
  USING (public.is_home_member(home_id));

CREATE POLICY "Members can delete their shopping items"
  ON public.shopping_items FOR DELETE
  USING (public.is_home_member(home_id));
