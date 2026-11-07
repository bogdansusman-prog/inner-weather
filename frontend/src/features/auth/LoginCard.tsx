import './login-card.css';

type Props = {
  onCreateAccount: () => void; // ce se intampla la click pe "Create an account"
};

// Cardul de login. Deocamdata doar interfata:
// legatura cu backend-ul (autentificarea lui Alin, B3) vine mai tarziu.
export default function LoginCard({ onCreateAccount }: Props) {
  return (
    <form className="login-card" onSubmit={(e) => e.preventDefault()}>
      <h2 className="login-card__title">Welcome back</h2>
      <p className="login-card__subtitle">How is your weather today?</p>

      <label className="login-card__field">
        <span>Email</span>
        <input type="email" name="email" autoComplete="email" placeholder="you@example.com" required />
      </label>

      <label className="login-card__field">
        <span>Password</span>
        <input type="password" name="password" autoComplete="current-password" placeholder="••••••••" required />
      </label>

      <button type="submit" className="login-card__submit">
        Log in
      </button>

      <p className="login-card__footer">
        New here? <button type="button" className="login-card__link" onClick={onCreateAccount}>Create an account</button>
      </p>
    </form>
  );
}
