import { useEffect, useState } from 'react';
import { getMe, type Me } from '../../api/auth';
import { ApiError } from '../../api/client';
import '../auth/login-card.css';
import './home.css';

type Props = {
  onLogout: () => void;
};

// Pagina provizorie dupa login: arata ca backend-ul te recunoaste
export default function Home({ onLogout }: Props) {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    getMe()
      .then(setMe)
      .catch((err) => {
        // token expirat sau invalid: inapoi la login
        if (err instanceof ApiError && err.status === 401) onLogout();
      });
  }, [onLogout]);

  return (
    <main className="home">
      <div className="login-card">
        <h2 className="login-card__title">You're in</h2>
        <p className="login-card__subtitle">
          {me ? `Logged in as ${me.role.toLowerCase()} · id ${me.id.slice(0, 8)}…` : 'Checking who you are…'}
        </p>
        <button type="button" className="login-card__submit" onClick={onLogout}>
          Log out
        </button>
      </div>
    </main>
  );
}