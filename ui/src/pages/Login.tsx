import { useState } from 'preact/hooks';
import { Button, Field, Input, Notice, PasswordInput, useId } from '../components/ui';
import { apiFetch, errorMessage } from '../hooks/useApi';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState(localStorage.getItem('faucet_admin_email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const emailId = useId('email');
  const passId = useId('pass');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch('/api/v1/system/admin/session', { method: 'POST', body: { email, password } });
      if (res.session_token) localStorage.setItem('faucet_session', res.session_token);
      localStorage.setItem('faucet_admin_email', res.email || email);
      onLogin();
    } catch (err) {
      setError(errorMessage(err, 'Sign-in failed'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-[360px]">
        <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1em" height="1em" fill="currentColor" style="font-size: 25px;--bs-primary: #0097b2;--bs-primary-rgb: 0,151,178;">
          <path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM135.1 217.4c-4.5 4.2-7.1 10.1-7.1 16.3c0 12.3 10 22.3 22.3 22.3H208v96c0 17.7 14.3 32 32 32h32c17.7 0 32-14.3 32-32V256h57.7c12.3 0 22.3-10 22.3-22.3c0-6.2-2.6-12.1-7.1-16.3L269.8 117.5c-3.8-3.5-8.7-5.5-13.8-5.5s-10.1 2-13.8 5.5L135.1 217.4z"></path>
        </svg>
        <h1 class="text-xl font-semibold tracking-[-0.01em] text-fg">Sign in</h1>
        <p class="text-base text-fg-muted mt-1 mb-6">Pls fill the user and password.</p>

        <form onSubmit={handleSubmit} class="flex flex-col gap-4" noValidate>
          {error && <Notice tone="bad" title={error} />}
          <Field label="Email" htmlFor={emailId}>
            <Input id={emailId} type="email" value={email} onValue={setEmail} autocomplete="username" autoFocus={!email} required />
          </Field>
          <Field label="Password" htmlFor={passId}>
            <PasswordInput id={passId} value={password} onValue={setPassword} autocomplete="current-password" autoFocus={!!email} required />
          </Field>
          <Button type="submit" variant="primary" loading={loading} disabled={!email || !password} class="mt-1 w-full">
            Sign in
          </Button>
        </form>

        <p class="text-sm text-fg-muted mt-8">
          2026 {' '}
          <span class="code-chip">the mu</span>.
        </p>
      </div>
    </div>
  );
}
