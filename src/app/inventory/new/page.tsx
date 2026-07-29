import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, PackagePlus, Tags, Save } from "lucide-react";
import { createProduct, createCategory } from "@/app/actions/inventory";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id")
    .eq("user_id", user.id)
    .single();

  if (!membership) redirect("/setup");

  // Fetch categories
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("home_id", membership.home_id)
    .order("name");

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 h-full overflow-y-auto">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <Link href="/inventory" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white">Nuevo Producto</h1>
        </div>
      </header>

      <main className="p-6 space-y-8">
        
        {/* Formulario de Nueva Categoría (Oculto en un details para no estorbar) */}
        <details className="group bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl overflow-hidden shadow-sm">
          <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-indigo-900 dark:text-indigo-100 list-none">
            <div className="flex items-center">
              <Tags className="w-5 h-5 mr-3 text-indigo-600 dark:text-indigo-400" />
              ¿Falta una categoría? Créala aquí
            </div>
            <span className="text-indigo-500 text-xl font-light group-open:rotate-45 transition-transform">+</span>
          </summary>
          <form action={createCategory} className="p-4 pt-0 border-t border-indigo-100 dark:border-indigo-800/30 mt-2 space-y-3">
            <input 
              name="name" 
              type="text" 
              placeholder="Ej. Lácteos, Carnes, Limpieza" 
              required 
              className="w-full px-4 py-2.5 rounded-xl border border-white dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm"
            />
            <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm">
              Guardar categoría
            </button>
          </form>
        </details>

        {/* Formulario Principal de Producto */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center">
              <PackagePlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">Detalles del Producto</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Agrega algo nuevo a tu hogar</p>
            </div>
          </div>

          <form action={createProduct} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Nombre del producto</label>
              <input name="name" type="text" placeholder="Ej. Arroz Grano Largo" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Categoría</label>
              <select name="category_id" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                <option value="">Selecciona una categoría</option>
                {categories?.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Unidad</label>
                <select name="unit" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none">
                  <option value="un">Unidades (un)</option>
                  <option value="kg">Kilos (kg)</option>
                  <option value="L">Litros (L)</option>
                  <option value="paq">Paquete (paq)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cantidad actual</label>
                <input name="initial_quantity" type="number" step="0.1" min="0" defaultValue="1" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Cantidad mínima esperada</label>
              <p className="text-[10px] text-slate-500 mb-1">Si la cantidad baja de este número, se marcará como "Poco".</p>
              <input name="minimum_quantity" type="number" step="0.1" min="0" defaultValue="0" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50" />
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full flex items-center justify-center py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm shadow-emerald-200 dark:shadow-emerald-900/20">
                <Save className="w-5 h-5 mr-2" />
                Guardar Producto
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
