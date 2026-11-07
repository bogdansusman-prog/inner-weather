import './login-card.css';

// Cardul de login. Deocamdata doar interfata:
// legatura cu backend-ul (autentificarea lui Alin, B3) vine mai tarziu.
export default function LoginCard() {
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
        New here? <a href="#">Create an account</a>
      </p>
    </form>
  );
}
