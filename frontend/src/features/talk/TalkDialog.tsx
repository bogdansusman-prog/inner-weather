import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { HELPLINE_DIRECTORY, HELPLINES } from './helplines';
import { shareLink, type Channel } from './share';
import './talk.css';

// pasii ferestrei: intrebarea, mesajul catre cineva drag, liniile de sprijin
type Step = 'ask' | 'write' | 'call';

const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'sms', label: 'SMS' },
  { id: 'email', label: 'Email' },
];

// cat ramane "Copied" pe buton
const COPIED_MS = 2000;

type Props = {
  open: boolean;
  onClose: () => void;
};

// "I need to talk": o intrebare blanda, apoi fie un mesaj catre cineva de incredere,
// fie liniile de sprijin. Nimic nu se trimite de aici; omul alege totul.
// TODO (cand e gata backend-ul): pentru CLIENT, optiunea "Anunta-mi terapeutul".
export default function TalkDialog({ open, onClose }: Props) {
  const { t } = useLanguage();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState<Step>('ask');
  const [message, setMessage] = useState(() => t('talk.message'));
  const [copied, setCopied] = useState(false);

  // deschidem / inchidem fereastra adevarata cand se schimba `open`
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // la fiecare pas nou, focusul merge pe titlu (cititoarele de ecran il anunta)
  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open, step]);

  // la inchidere pornim data viitoare de la zero
  function handleClose() {
    setStep('ask');
    setMessage(t('talk.message'));
    setCopied(false);
    onClose();
  }

  async function copyMessage() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPIED_MS);
    } catch {
      // browserul nu ne lasa sa copiem: omul poate selecta textul singur
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="talk"
      aria-labelledby="talk-title"
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      onWheel={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {/* key: fiecare pas intra cu animatia lui */}
      <div className="talk__card" key={step}>
        <span className="talk__glow" aria-hidden="true" />

        {step === 'ask' && (
          <>
            <h2 className="talk__title" id="talk-title" ref={titleRef} tabIndex={-1}>
              {t('talk.question')}
            </h2>
            <p className="talk__hint">{t('talk.questionHint')}</p>
            <div className="talk__answers">
              <button type="button" className="talk__button talk__button--main" onClick={() => setStep('write')}>
                {t('talk.yes')}
              </button>
              <button type="button" className="talk__button" onClick={() => setStep('call')}>
                {t('talk.call')}
              </button>
              <button type="button" className="talk__button talk__button--quiet" onClick={handleClose}>
                {t('talk.no')}
              </button>
            </div>
          </>
        )}

        {step === 'write' && (
          <>
            <h2 className="talk__title" id="talk-title" ref={titleRef} tabIndex={-1}>
              {t('talk.writeTitle')}
            </h2>
            <p className="talk__hint">{t('talk.writeHint')}</p>

            <label className="talk__label" htmlFor="talk-message">{t('talk.messageLabel')}</label>
            <textarea
              id="talk-message"
              className="talk__message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            {/* fiecare buton deschide aplicatia, cu mesajul gata scris */}
            <div className="talk__channels">
              {CHANNELS.map((c) => (
                <a
                  key={c.id}
                  className="talk__button"
                  href={shareLink(c.id, message, t('talk.subject'))}
                  target={c.id === 'whatsapp' ? '_blank' : undefined}
                  rel={c.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                >
                  {c.label}
                </a>
              ))}
              <button type="button" className="talk__button" onClick={copyMessage} aria-live="polite">
                {copied ? t('talk.copied') : t('talk.copy')}
              </button>
            </div>

            <div className="talk__footer">
              <button type="button" className="talk__link" onClick={() => setStep('ask')}>
                {t('talk.back')}
              </button>
              <button type="button" className="talk__link" onClick={() => setStep('call')}>
                {t('talk.toCall')}
              </button>
            </div>
          </>
        )}

        {step === 'call' && (
          <>
            <h2 className="talk__title" id="talk-title" ref={titleRef} tabIndex={-1}>
              {t('talk.callTitle')}
            </h2>

            {/* urgenta, separat si primul */}
            <a className="talk__emergency" href="tel:112">
              {t('talk.emergency')}
            </a>

            <p className="talk__hint">{t('talk.callHint')}</p>
            <ul className="talk__lines">
              {HELPLINES.map((line) => (
                <li key={line.tel}>
                  <a className="talk__line" href={`tel:${line.tel}`}>
                    <span>
                      <strong>{line.name}</strong>
                      <span className="talk__about">{t(line.about)}</span>
                    </span>
                    <span className="talk__number">{line.number}</span>
                  </a>
                </li>
              ))}
            </ul>
            <a className="talk__link talk__directory" href={HELPLINE_DIRECTORY} target="_blank" rel="noopener noreferrer">
              {t('talk.otherCountry')}
            </a>

            <div className="talk__footer">
              <button type="button" className="talk__link" onClick={() => setStep('ask')}>
                {t('talk.back')}
              </button>
              <button type="button" className="talk__link" onClick={handleClose}>
                {t('talk.close')}
              </button>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
