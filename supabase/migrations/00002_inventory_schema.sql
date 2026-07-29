-- ==========================================
-- Tabla de Categorías (Categories)
-- ==========================================
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT DEFAULT 'tag', -- Para usar iconos de Lucide
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their categories"
  ON public.categories FOR SELECT
  USING (public.is_home_member(home_id));

CREATE POLICY "Members can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_home_member(home_id));

CREATE POLICY "Members can update their categories"
  ON public.categories FOR UPDATE
  USING (public.is_home_member(home_id));

-- Insertar categorías por defecto (solo un admin o trigger podría hacerlo genéricamente,
-- pero por ahora las insertaremos desde la UI al crear una casa, o los usuarios las crean manualmente).

-- ==========================================
-- Tabla de Productos (Products)
-- ==========================================
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  unit TEXT DEFAULT 'un', -- kg, L, un, etc.
  minimum_quantity NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their products"
  ON public.products FOR SELECT
  USING (public.is_home_member(home_id));

CREATE POLICY "Members can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_home_member(home_id));

CREATE POLICY "Members can update their products"
  ON public.products FOR UPDATE
  USING (public.is_home_member(home_id));

-- ==========================================
-- Tabla de Inventario (Inventory)
-- ==========================================
CREATE TABLE public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE UNIQUE,
  quantity NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'suficiente' CHECK (status IN ('suficiente', 'poco', 'agotado')),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can view their inventory"
  ON public.inventory FOR SELECT
  USING (public.is_home_member(home_id));

CREATE POLICY "Members can insert inventory"
  ON public.inventory FOR INSERT
  WITH CHECK (public.is_home_member(home_id));

CREATE POLICY "Members can update their inventory"
  ON public.inventory FOR UPDATE
  USING (public.is_home_member(home_id));
