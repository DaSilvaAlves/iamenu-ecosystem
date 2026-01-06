
import React, { useState } from 'react';
import { useAuth } from '../App';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [tab, setTab] = useState<'magic' | 'password'>('magic');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, logic for role detection or multiple users would go here
    // For demo, if email contains 'manager', login as manager
    login(email.includes('manager') ? 'MANAGER' : 'STAFF');
  };

  return (
    <div className="relative flex flex-col justify-center min-h-screen px-6 py-12 selection:bg-primary selection:text-white">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-sm mx-auto">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-black border border-white/10 text-primary flex items-center justify-center shadow-2xl">
              <span className="material-icons-round text-3xl">restaurant_menu</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            iaMenu <span className="text-primary font-medium">Staff</span>
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Bem-vindo de volta. Entre para gerir os seus turnos e equipa.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-1 p-1 bg-zinc-900/80 rounded-xl mb-8 border border-white/5">
            <button
              onClick={() => setTab('magic')}
              className={`flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === 'magic' ? 'bg-zinc-800 text-primary shadow-sm ring-1 ring-white/5' : 'text-gray-500 hover:text-white'
              }`}
            >
              <span className="material-icons-round text-lg mr-2">auto_fix_high</span>
              Link Mágico
            </button>
            <button
              onClick={() => setTab('password')}
              className={`flex items-center justify-center py-2.5 text-sm font-medium rounded-lg transition-all ${
                tab === 'password' ? 'bg-zinc-800 text-primary shadow-sm ring-1 ring-white/5' : 'text-gray-500 hover:text-white'
              }`}
            >
              <span className="material-icons-round text-lg mr-2">password</span>
              Senha
            </button>
          </div>

          <div className="bg-surface-dark/60 glass border border-white/10 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 ml-1" htmlFor="email">
                  {tab === 'magic' ? 'Email ou telemóvel' : 'Senha'}
                </label>
                <div className="mt-2 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-icons-round text-gray-400 text-xl">
                      {tab === 'magic' ? 'mail_outline' : 'lock_outline'}
                    </span>
                  </div>
                  <input
                    id="email"
                    required
                    type={tab === 'magic' ? 'email' : 'password'}
                    placeholder={tab === 'magic' ? 'exemplo@iamenu.com' : 'Sua senha'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border-0 py-3.5 pl-11 text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-primary bg-black/40 transition-all"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-xl bg-gradient-to-r from-primary to-primary-hover px-3 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {tab === 'magic' ? 'Enviar Link de Acesso' : 'Entrar'}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm font-medium">
                  <span className="bg-surface-dark px-4 text-gray-500">Ou continuar com</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 rounded-xl bg-zinc-800/50 px-3 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-zinc-800 transition-all">
                  <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
                  Google
                </button>
                <button className="flex items-center justify-center gap-3 rounded-xl bg-zinc-800/50 px-3 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-zinc-800 transition-all">
                  <span className="material-icons-round text-lg">apple</span>
                  Apple
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-500 mt-6 px-4 leading-relaxed">
            Ao entrar, concorda com os <span className="text-primary font-semibold">Termos de Serviço</span> e <span className="text-primary font-semibold">Política de Privacidade</span> do iaMenu Ecosystem.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
