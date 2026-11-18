import { useEffect, useRef, useState } from 'react';
import { saveCheckIn, weatherOf, type CheckIn } from '../../api/checkins';
import { ApiError } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import MoodMap, { type MoodPoint } from '../checkin/MoodMap';
import { WEATHER_TEXT } from '../checkin/weatherText';
import './dialog.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (checkIn: CheckIn) => void;
};

// Fereastra peste ecran pentru un check-in in plus. Ora e "acum".
// Folosim <dialog>: browserul tine singur focusul inauntru si o inchide la Escape.
export default function AddCheckInDialog({ open, onClose, onSaved }: Props) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [point, setPoint] = useState<MoodPoint | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // deschidem / inchidem fereastra adevarata cand se schimba `open`
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // focusul pleaca de pe titlu, nu de pe harta, ca sa nu apara conturul la deschidere
      titleRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // la fiecare deschidere pornim de la zero
  function handleClose() {
    setPoint(null);
    setError(null);
    onClose();
  }

  async function handleSave() {
    if (!point) return;
    setSaving(true);
    setError(null);
    try {
      const checkIn = await saveCheckIn(point.energy, point.pleasantness);
      onSaved(checkIn);
      handleClose();
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

  const weather = point ? weatherOf(point.energy, point.pleasantness) : null;

  return (
    <dialog
      ref={dialogRef}
      className="add-dialog"
      aria-labelledby="add-dialog-title"
      onClose={handleClose}
      // click pe fundalul intunecat (in afara cardului) inchide fereastra
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      // cat e deschisa, rotita si degetul nu schimba pagina din spate
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div className="add-dialog__card">
        <h2 className="add-dialog__title" id="add-dialog-title" ref={titleRef} tabIndex={-1}>
          {t('dialog.title')}
        </h2>

        <MoodMap value={point} onChange={setPoint} label={t('checkin.mapLabel')} />

        <p className="add-dialog__weather" aria-live="polite">{weather ? t(WEATHER_TEXT[weather]) : ''}</p>
        {error && <p className="add-dialog__error" role="alert">{error}</p>}

        <div className="add-dialog__actions">
          <button type="button" className="add-dialog__cancel" onClick={handleClose}>
            {t('dialog.cancel')}
          </button>
          <button type="button" className="add-dialog__save" disabled={!point || saving} onClick={handleSave}>
            {saving ? t('checkin.saving') : t('checkin.save')}
          </button>
        </div>
      </div>
    </dialog>
  );
}
