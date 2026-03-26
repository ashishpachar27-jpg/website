import { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const { login } = useAuth();

  const submit = async (event) => {
    event.preventDefault();
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);
      login(data.token);
      setMessage('Authenticated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 pt-20">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/10 bg-black/40 p-8">
        <h1 className="font-display text-3xl">{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
        {mode === 'register' && (
          <input className="mt-6 w-full rounded border border-white/20 bg-transparent px-3 py-2" placeholder="Name" onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        )}
        <input className="mt-4 w-full rounded border border-white/20 bg-transparent px-3 py-2" placeholder="Email" type="email" onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        <input className="mt-4 w-full rounded border border-white/20 bg-transparent px-3 py-2" placeholder="Password" type="password" onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        <button className="mt-6 w-full rounded-full bg-white py-3 text-black">{mode === 'login' ? 'Sign In' : 'Sign Up'}</button>
        <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-3 text-sm text-gold">
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
        </button>
        {message && <p className="mt-3 text-sm text-white/80">{message}</p>}
      </form>
    </main>
  );
}
