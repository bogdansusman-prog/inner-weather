import { useState, type FormEvent } from 'react';
import { register, type AccountType } from '../../api/auth';
import { ApiError } from '../../api/client';
import type { Role } from './types';
import './login-card.css';

type Step = 'role' | 'details' | 'done';

const ROLES: { id: Role; title: string; text: string }[] = [
  { id: 'user', title: 'Just curious', text: 'Track your mood on your own.' },
  { id: 'client', title: 'I see a therapist', text: 'Connect your account to your therapist.' },
  { id: 'therapist', title: "I'm a therapist", text: 'Follow your clients. Needs proof of license.' },
];

// rolul ales in interfata -> ce asteapta backend-ul
const ACCOUNT_TYPE: Record<Role, AccountType> = {
  user: 'USER',
  client: 'CLIENT',
  therapist: 'THERAPIST',
};

type Props = {
  onBack: () => void;       // inapoi la login
  onRegistered: () => void; // cont creat, intram in aplicatie
};

export default function RegisterCard({ onBack, onRegistered }: Props) {
  // toate state-urile stau sus, inainte de orice "if ... return"
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [therapistCode, setTherapistCode] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!role) return;
    setError(null);
    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        accountType: ACCOUNT_TYPE[role],
        therapistCode: role === 'client' ? therapistCode : undefined,
        licenseNumber: role === 'therapist' ? licenseNumber : undefined,
      });
      // terapeutul vede intai ecranul "in asteptare"; ceilalti intra direct
      if (role === 'therapist') setStep('done');
      else onRegistered();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setError('An account with this email already exists.');
      } else if (err instanceof ApiError && err.status === 400) {
        setError(role === 'client' ? "We couldn't find that therapist code." : 'Please check your details.');
      } else if (err instanceof ApiError && (err.status === 0 || err.status >= 500)) {
        setError("The server isn't responding. Is the backend running?");
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  if (step === 'role') {
    return (
      <div className="login-card">
        <h2 className="login-card__title">Create your account</h2>
        <p className="login-card__subtitle">How will you use Inner Weather?</p>

        {ROLES.map((r) => (
          <button
            key={r.id}
            type="button"
            className="role-option"
            data-selected={role === r.id}
            onClick={() => setRole(r.id)}
          >
            <strong>{r.title}</strong>
            <span>{r.text}</span>
          </button>
        ))}

        <button type="button" className="login-card__submit" disabled={!role} onClick={() => setStep('details')}>
          Continue
        </button>

        <p className="login-card__footer">
          Already have an account?{' '}
          <button type="button" className="login-card__link" onClick={onBack}>Log in</button>
        </p>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="login-card">
        <h2 className="login-card__title">Thanks, {name}!</h2>
        <p className="login-card__subtitle">We're checking your license.</p>
        <p className="login-card__info">
          Once it's approved, you'll get a code to share with your clients.
          You can explore the app in the meantime.
        </p>
        <button type="button" className="login-card__submit" onClick={onRegistered}>
          Continue
        </button>
      </div>
    );
  }

  // pasul 'details'
  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <h2 className="login-card__title">Your details</h2>
      <p className="login-card__subtitle">Almost there.</p>

      <label className="login-card__field">
        <span>Name</span>
        <input
          name="name"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>

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
          autoComplete="new-password"
          placeholder="At least 8 characters"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      {role === 'client' && (
        <label className="login-card__field">
          <span>Therapist code</span>
          <input
            name="therapistCode"
            placeholder="e.g. K7M2QX"
            required
            maxLength={6}
            autoCapitalize="characters"
            value={therapistCode}
            onChange={(e) => setTherapistCode(e.target.value)}
          />
        </label>
      )}

      {role === 'therapist' && (
        <label className="login-card__field">
          <span>License number</span>
          <input
            name="licenseNumber"
            required
            maxLength={50}
            value={licenseNumber}
            onChange={(e) => setLicenseNumber(e.target.value)}
          />
        </label>
      )}

      {error && <p className="login-card__error" role="alert">{error}</p>}

      <button type="submit" className="login-card__submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="login-card__footer">
        <button type="button" className="login-card__link" onClick={() => setStep('role')}>
          ← Back
        </button>
      </p>
    </form>
  );
}