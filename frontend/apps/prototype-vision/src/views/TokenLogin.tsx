import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, LogIn } from 'lucide-react';

/**
 * TokenLogin - Página simples para beta users entrarem com token JWT
 * Solução temporária para beta. Auth completo será implementado pós-beta.
 */
export default function TokenLogin() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!token.trim()) {
      setError('Por favor, cola o teu token de acesso');
      return;
    }

    try {
      // Validate JWT format (basic check)
      const parts = token.split('.');
      if (parts.length !== 3) {
        setError('Token inválido. Verifica que copiaste o token completo.');
        return;
      }

      // Save token
      localStorage.setItem('auth_token', token.trim());
      
      // Redirect to home
      navigate('/');
      window.location.reload(); // Force reload to apply token
    } catch (_err: unknown) {
      setError('Erro ao processar token. Contacta o suporte.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-amber-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <Key className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acesso Beta - iaMenu
          </h1>
          <p className="text-sm text-gray-600">
            Cola o token de acesso que recebeste por email
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Token de Acesso
            </label>
            <textarea
              value={token}
              onChange={(e) => {
                setToken(e.target.value);
                setError('');
              }}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none font-mono text-xs"
              rows={4}
            />
            {error && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {error}
              </p>
            )}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <LogIn className="w-5 h-5" />
            Entrar
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            ℹ️ Este é um acesso temporário para beta testers.<br />
            Não partilhes o teu token com terceiros.
          </p>
        </div>
      </div>
    </div>
  );
}
