'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ loginIdentifier, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Invalid credentials. Please try again.');
        setLoading(false);
        return;
      }

      router.push('/');
    } catch (err) {
      setError('Unable to reach server. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  const handleUseDemo = () => {
    setLoginIdentifier('demo_user');
    setPassword('password123');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#090a0f] p-4 text-gray-100 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-600/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/25 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#12141d]/80 p-8 shadow-2xl shadow-black/80 backdrop-blur-2xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 shadow-lg shadow-blue-500/30">
            <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Welcome Back</h1>
          <p className="mt-1 text-sm text-gray-400">Sign in to stream live IPTV</p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/15 p-3 text-sm text-red-300">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              placeholder="demo_user"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-3 text-xs text-gray-400">
          <div className="flex items-center justify-between">
            <span>Demo: <strong className="text-gray-200">demo_user</strong> / <strong className="text-gray-200">password123</strong></span>
            <button
              type="button"
              onClick={handleUseDemo}
              className="rounded bg-blue-500/20 px-2 py-0.5 text-[11px] font-semibold text-blue-300 hover:bg-blue-500/30 transition"
            >
              Fill Demo
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-400">
          Need an account?{' '}
          <Link href="/register" className="font-semibold text-blue-400 hover:text-blue-300 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
