import { useState } from 'react';
import { saveCheckIn, weatherOf, type CheckIn } from '../../api/checkins';
import { ApiError } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import MoodMap, { type MoodPoint } from './MoodMap';
import { WEATHER_TEXT } from './weatherText';
import './checkin.css';

type Props = {
  today: CheckIn | null;              // check-in-ul zilnic, daca s-a facut deja
  onSaved: (checkIn: CheckIn) => void; // anuntam Shell-ul ca s-a facut
};

// Check-in-ul zilnic: o singura data pe zi. Restul se fac din Home.
export default function CheckInPage({ today, onSaved }: Props) {
  const { t, lang } = useLanguage();
  const [point, setPoint] = useState<MoodPoint | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // azi s-a facut deja: aratam ce a ales omul, fara sa se poata schimba
  if (today) {
    const time = new Date(today.checkedInAt).toLocaleTimeString(lang === 'ro' ? 'ro-RO' : 'en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return (
      <div className="checkin" data-weather={today.weather}>
        <div className="checkin__sky" aria-hidden="true" />
        <h2 className="checkin__question">{t('checkin.doneTitle')}</h2>
        <p className="checkin__hint">{t('checkin.doneHint')}</p>
        <MoodMap
          value={{ energy: today.energy, pleasantness: today.pleasantness }}
          label={`${t('checkin.doneTitle')}: ${t(WEATHER_TEXT[today.weather])}`}
        />
        <div className="checkin__footer">
          <p className="checkin__weather">
            {t(WEATHER_TEXT[today.weather])}
            <span className="checkin__time"> · {time}</span>
          </p>
        </div>
      </div>
    );
  }

  // vremea punctului ales (null cat timp nu s-a ales nimic)
  const weather = point ? weatherOf(point.energy, point.pleasantness) : null;

  // orice mutare a punctului inseamna un check-in nou, inca nesalvat
  function handleChange(next: MoodPoint) {
    setPoint(next);
    setError(null);
  }

  async function handleSave() {
    if (!point) return;
    setSaving(true);
    setError(null);
    try {
      const checkIn = await saveCheckIn(point.energy, point.pleasantness);
      setSaved(true);
      onSaved(checkIn);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 0 || err.status >= 500)) {
        setError(t('checkin.offline'));
      } else {
        setError(t('checkin.error'));
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="checkin" data-weather={weather ?? 'NONE'}>
      <div className="checkin__sky" aria-hidden="true" />

      <h2 className="checkin__question">{t('checkin.question')}</h2>
      <p className="checkin__hint" id="checkin-hint">{t('checkin.hint')}</p>

      <MoodMap
        value={point}
        onChange={saved ? undefined : handleChange}
        label={t('checkin.mapLabel')}
        describedBy="checkin-hint"
      />

      <div className="checkin__footer" aria-live="polite">
        <p className="checkin__weather">{weather ? t(WEATHER_TEXT[weather]) : ''}</p>

        {saved ? (
          <p className="checkin__saved">{t('checkin.saved')}</p>
        ) : (
          <button type="button" className="checkin__save" disabled={!point || saving} onClick={handleSave}>
            {saving ? t('checkin.saving') : t('checkin.save')}
          </button>
        )}

        {error && <p className="checkin__error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
