import { useState, type FormEvent } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { api, type Session } from './api';
import { Button, Field, Notice, inputClass } from './ui';

export default function Login({ setup, onSignedIn }: { setup: Session['setup']; onSignedIn: () => void }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api.login(password);
      onSignedIn();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <main className="min-h-svh grid place-items-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-yellow/[0.06] blur-[120px] rounded-full pointer-events-none" />
      <div className="relative w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <img src="/favicon-192.png" alt="" width={72} height={72} className="w-[72px] h-[72px] rounded-full border border-white/10" />
          <h1 className="mt-5 text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-gray-400">Sign in to write and publish articles.</p>
        </div>

        {!setup.password ? (
          <Notice tone="warning">
            <strong>Almost there.</strong> Add an <code>ADMIN_PASSWORD</code> (8+ characters) in Vercel → Settings →
            Environment Variables, then redeploy. That becomes the password for this page.
          </Notice>
        ) : (
          <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
            <Field label="Password" htmlFor="password" error={error}>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" aria-hidden />
                <input
                  id="password"
                  type={show ? 'text' : 'password'}
                  autoComplete="current-password"
                  autoFocus
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'password-error' : undefined}
                  className={`${inputClass} pl-11 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-lg text-gray-400 hover:text-white"
                >
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
            <Button type="submit" variant="primary" busy={busy} className="w-full">
              Sign in
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-gray-500">
          <a href="/" className="hover:text-white transition-colors">← Back to the website</a>
        </p>
      </div>
    </main>
  );
}
