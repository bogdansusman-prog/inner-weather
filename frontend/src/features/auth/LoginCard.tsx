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
  const [showPassword, setShowPassword] = useState(false);
  const [resetInfo, setResetInfo] = useState(false);

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

      <div className="login-card__field">
        <label htmlFor="password">Password</label>
        <div className="login-card__password">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="login-card__reveal"
            onClick={() => setShowPassword(!showPassword)}
            aria-pressed={showPassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <div className="login-card__forgot">
        <button type="button" className="login-card__link" onClick={() => setResetInfo(true)}>
          Forgot password?
        </button>
      </div>

      {resetInfo && (
        <p className="login-card__info">
          Password reset is coming soon. For now, ask us to reset it for you.
        </p>
      )}

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