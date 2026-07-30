import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, KeyRound, User } from "lucide-react";
import CopyButton from "./CopyButton";

export default async function FamilyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch user's home
  const { data: membership } = await supabase
    .from("home_members")
    .select("home_id, homes(id, name, invite_code)")
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (!membership || !membership.homes) {
    redirect("/setup");
  }

  const currentHome = membership.homes as unknown as { id: string, name: string, invite_code: string };

  // 2. Fetch all members of this home
  const { data: members } = await supabase
    .from("home_members")
    .select(`
      role,
      user_id,
      users (
        name
      )
    `)
    .eq("home_id", currentHome.id);

  return (
    <div className="flex-1 flex flex-col relative h-full bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="px-6 pt-8 pb-6 flex items-center justify-between sticky top-0 z-10 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
        <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center">
          <Users className="w-5 h-5 mr-2 text-primary-500" />
          Familia
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-8 pb-32 animate-slide-up no-scrollbar">
        
        {/* Invite Code Card */}
        <div className="bg-gradient-premium p-6 rounded-3xl text-white shadow-xl shadow-primary-500/20 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 text-center space-y-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
              <KeyRound className="w-6 h-6 text-yellow-300" />
            </div>
            <h2 className="text-sm font-bold text-primary-100 uppercase tracking-wider">Código de Invitación</h2>
            <p className="text-xs text-primary-200">Comparte este código para que tus familiares se unan a <span className="font-bold text-white">{currentHome.name}</span></p>
            
            <div className="mt-6 flex items-center justify-center space-x-3">
              <div className="bg-white/10 border border-white/20 backdrop-blur-md px-6 py-4 rounded-2xl font-black text-3xl tracking-[0.2em] text-white shadow-inner">
                {currentHome.invite_code}
              </div>
              <CopyButton code={currentHome.invite_code} />
            </div>
          </div>
        </div>

        {/* Members List */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-1.5 w-6 bg-primary-500 rounded-full"></div>
            <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Miembros ({members?.length || 0})
            </h2>
          </div>
          
          <div className="space-y-3">
            {members?.map((member: any) => (
              <div key={member.user_id} className="glass-card p-4 rounded-3xl flex items-center justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 border border-primary-100/50 dark:border-primary-800/30">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-tight mb-1">
                      {member.users?.name || "Usuario"}
                      {member.user_id === user.id && <span className="text-xs font-normal text-slate-400 ml-2">(Tú)</span>}
                    </h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 capitalize">
                      {member.role === 'admin' ? 'Administrador' : 'Miembro'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
