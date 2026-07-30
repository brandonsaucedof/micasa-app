-- Migration: Add performance indexes to prevent sequential scans during RLS evaluation

CREATE INDEX IF NOT EXISTS idx_home_members_user_id ON public.home_members(user_id);
CREATE INDEX IF NOT EXISTS idx_home_members_home_id ON public.home_members(home_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_home_members_home_user ON public.home_members(home_id, user_id);

CREATE INDEX IF NOT EXISTS idx_products_home_id ON public.products(home_id);
CREATE INDEX IF NOT EXISTS idx_inventory_home_id ON public.inventory(home_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_home_id ON public.shopping_items(home_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_purchase_id ON public.shopping_items(purchase_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_product_id ON public.shopping_items(product_id);
CREATE INDEX IF NOT EXISTS idx_purchases_home_id ON public.purchases(home_id);
CREATE INDEX IF NOT EXISTS idx_purchases_created_at ON public.purchases(created_at);
CREATE INDEX IF NOT EXISTS idx_categories_home_id ON public.categories(home_id);
