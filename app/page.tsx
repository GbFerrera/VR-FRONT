'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, HelpCircle, Users, BarChart3, Shield, Package } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Green Background with Info */}
      <div 
        className="hidden lg:flex lg:w-1/2 text-white p-12 flex-col justify-between relative overflow-hidden"
        style={{
          backgroundImage: 'url(/farm-background.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          backgroundColor: '#2d5016',
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d5016]/85 via-[#2d5016]/80 to-[#1a3009]/85" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <div className="inline-block">
              <img 
                src="/logo.png" 
                alt="Vitrine Rural - Niquelândia" 
                className="h-32 w-auto object-contain"
              />
            </div>
          </div>

          {/* Main Message */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Conectando produtores<br />
              e oportunidades do campo.
            </h2>
            <p className="text-lg text-white/90">
              Gerencie sua produção, pedidos, estoque e<br />
              negócios de forma simples e eficiente.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Gestão completa</h3>
                <p className="text-sm text-white/80">
                  Controle de produtos, estoque e pedidos<br />
                  em um só lugar.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Produtores conectados</h3>
                <p className="text-sm text-white/80">
                  Fortalecendo o relacionamento entre campo<br />
                  e mercado.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Relatórios inteligentes</h3>
                <p className="text-sm text-white/80">
                  Dados e insights para melhores decisões<br />
                  no seu negócio.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Seguro e confiável</h3>
                <p className="text-sm text-white/80">
                  Suas informações protegidas com<br />
                  tecnologia de ponta.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="relative z-10 opacity-30">
          <div className="h-32 bg-gradient-to-t from-black/20 to-transparent rounded-t-3xl" />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Help Link */}
          <div className="flex justify-end mb-8">
            <Link 
              href="/ajuda" 
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4" />
              Precisa de ajuda?
            </Link>
          </div>

          {/* Lock Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-green-700" />
            </div>
          </div>

          {/* Welcome Message */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo de volta!
            </h2>
            <p className="text-gray-600">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white border-gray-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 bg-white border-gray-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  Lembrar de mim
                </Label>
              </div>
              <Link
                href="/esqueceu-senha"
                className="text-sm text-green-700 hover:text-green-800 font-medium"
              >
                Esqueceu sua senha?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-green-700 hover:bg-green-800 text-white font-medium text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 flex items-center justify-center">
                  <img 
                    src="/logo.png" 
                    alt="Vitrine Rural Logo" 
                    className="h-16 w-auto object-contain"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Novo por aqui?</p>
                  <p className="text-sm text-gray-600">
                    Crie sua conta e comece a transformar seu negócio.
                  </p>
                </div>
              </div>
              <Link href="/cadastro">
                <Button
                  type="button"
                  variant="outline"
                  className="border-green-700 text-green-700 hover:bg-green-50"
                >
                  Criar conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
