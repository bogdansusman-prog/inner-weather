import { useState, type FormEvent } from 'react';
import { login } from '../../api/auth';
import { ApiError } from '../../api/client';
import './login-card.css';

type Props = {
  onCreateAccount: () => void; // click pe "Create an account"
  onLoggedIn: () => void;      // login reusit
};

export default function LoginCard({ onCreateAccount, onLoggedIn }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // fara asta, browserul ar reincarca pagina
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      onLoggedIn();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError('Wrong email or password.');
      } else if (err instanceof ApiError && (err.status === 0 || err.status >= 500)) {
        setError("The server isn't responding. Is the backend running?");
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <h2 className="login-card__title">Welcome back</h2>
      <p className="login-card__subtitle">How is your weather today?</p>

      <label className="login-card__field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <label className="login-card__field">
        <span>Password</span>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {error && <p className="login-card__error" role="alert">{error}</p>}

      <button type="submit" className="login-card__submit" disabled={loading}>
        {loading ? 'Logging in…' : 'Log in'}
      </button>

      <p className="login-card__footer">
        New here?{' '}
        <button type="button" className="login-card__link" onClick={onCreateAccount}>
          Create an account
        </button>
      </p>
    </form>
  );
}