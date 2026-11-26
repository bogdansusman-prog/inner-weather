import { useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import TalkDialog from '../talk/TalkDialog';
import BreathSession from './BreathSession';
import { PATTERNS, type PatternId } from './patterns';
import './breathe.css';

// ce se vede: alegerea modului, sesiunea, sau finalul
type View = { kind: 'menu' } | { kind: 'session'; id: PatternId } | { kind: 'done'; id: PatternId };

// Pagina de respiratie. Nu e un joc: fara scor, fara serii, fara "ai pierdut".
export default function BreathePage() {
  const { t } = useLanguage();
  const [view, setView] = useState<View>({ kind: 'menu' });
  const [talkOpen, setTalkOpen] = useState(false);

  return (
    <div className="breathe">
      {view.kind === 'menu' && (
        <>
          <h2 className="breathe__title">{t('breathe.title')}</h2>
          <p className="breathe__intro">{t('breathe.intro')}</p>

          <div className="breathe__modes">
            <button type="button" className="breathe__mode" onClick={() => setView({ kind: 'session', id: 'calm' })}>
              <span className="breathe__mode-title">{t('breathe.calmTitle')}</span>
              <span className="breathe__mode-hint">{t('breathe.calmHint')}</span>
            </button>
            <button type="button" className="breathe__mode" onClick={() => setView({ kind: 'session', id: 'daily' })}>
              <span className="breathe__mode-title">{t('breathe.dailyTitle')}</span>
              <span className="breathe__mode-hint">{t('breathe.dailyHint')}</span>
            </button>
          </div>

          <p className="breathe__safety">{t('breathe.safety')}</p>
        </>
      )}

      {view.kind === 'session' && (
        <BreathSession
          pattern={PATTERNS[view.id]}
          onDone={() => setView({ kind: 'done', id: view.id })}
          onStop={() => setView({ kind: 'menu' })}
          onNotHelping={() => {
            setView({ kind: 'menu' });
            setTalkOpen(true);
          }}
        />
      )}

      {view.kind === 'done' && (
        <div className="breathe__done">
          <span className="breathe__done-glow" aria-hidden="true" />
          <h2 className="breathe__title">{t('breathe.done')}</h2>
          <div className="breath__actions">
            <button type="button" className="breath__button" onClick={() => setView({ kind: 'session', id: view.id })}>
              {t('breathe.again')}
            </button>
            <button type="button" className="breath__link" onClick={() => setView({ kind: 'menu' })}>
              {t('breathe.back')}
            </button>
          </div>
        </div>
      )}

      <TalkDialog open={talkOpen} onClose={() => setTalkOpen(false)} />
    </div>
  );
}
