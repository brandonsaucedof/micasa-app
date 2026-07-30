-- ==========================================
-- Migración 00004: Características Avanzadas
-- ==========================================

-- Añadir distinción entre productos permanentes y compras de una sola vez
ALTER TABLE public.products ADD COLUMN is_permanent BOOLEAN DEFAULT true;

-- Añadir organización semanal a la lista de compras
ALTER TABLE public.shopping_items ADD COLUMN planning_week TEXT DEFAULT 'Semana 1';
