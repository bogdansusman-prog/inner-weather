import { useState } from 'react';
import type { Role } from './types';
import './login-card.css';

type Step = 'role' | 'details' | 'done';

const ROLES: { id: Role; title: string; text: string }[] = [
  { id: 'user', title: 'Just curious', text: 'Track your mood on your own.' },
  { id: 'client', title: 'I see a therapist', text: 'Connect your account to your therapist.' },
  { id: 'therapist', title: "I'm a therapist", text: 'Follow your clients. Needs proof of license.' },
];

type Props = { onBack: () => void }; // inapoi la login

export default function RegisterCard({ onBack }: Props) {
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(null);

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

  // TODO (tu): pasul 'details' si pasul 'done'
  return null;
}