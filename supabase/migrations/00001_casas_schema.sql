-- Tabla de Usuarios (Sincronizada con Supabase Auth)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden leer y actualizar su propio perfil
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Función para insertar automáticamente un registro en public.users cuando alguien se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para ejecutar la función anterior
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- Tabla de Casas (Homes)
-- ==========================================
CREATE TABLE public.homes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL, -- Código de 6 dígitos tipo 'AB45X9'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.homes ENABLE ROW LEVEL SECURITY;

-- Función de conveniencia para ver si un usuario pertenece a una casa
CREATE OR REPLACE FUNCTION public.is_home_member(home_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.home_members hm 
    WHERE hm.home_id = $1 AND hm.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Políticas de Casas (Solo los miembros pueden ver y modificar la casa)
CREATE POLICY "Members can view their homes"
  ON public.homes FOR SELECT
  USING (public.is_home_member(id));

CREATE POLICY "Members can update their homes"
  ON public.homes FOR UPDATE
  USING (public.is_home_member(id));

-- Cualquiera puede insertar una casa (se convierte en admin luego)
CREATE POLICY "Anyone can create a home"
  ON public.homes FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Las casas pueden ser consultadas por código para unirse
CREATE POLICY "Anyone can read home by invite code"
  ON public.homes FOR SELECT
  USING (true); -- Permitimos lectura general, pero solo se buscará por código

-- ==========================================
-- Tabla de Miembros (Home Members)
-- ==========================================
CREATE TABLE public.home_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  home_id UUID REFERENCES public.homes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(home_id, user_id)
);

ALTER TABLE public.home_members ENABLE ROW LEVEL SECURITY;

-- Políticas de Miembros
CREATE POLICY "Members can view other members in their home"
  ON public.home_members FOR SELECT
  USING (public.is_home_member(home_id));

-- Los usuarios pueden insertarse a sí mismos (cuando crean la casa o se unen por código)
CREATE POLICY "Users can insert themselves"
  ON public.home_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update members"
  ON public.home_members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.home_members hm
      WHERE hm.home_id = home_members.home_id
      AND hm.user_id = auth.uid()
      AND hm.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete members"
  ON public.home_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.home_members hm
      WHERE hm.home_id = home_members.home_id
      AND hm.user_id = auth.uid()
      AND hm.role = 'admin'
    )
  );
