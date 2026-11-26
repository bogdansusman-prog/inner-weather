export type Phase = 'in' | 'out' | 'hold';
export type Step = { phase: Phase; seconds: number };
export type PatternId = 'calm' | 'daily';
export type Pattern = { id: PatternId; steps: Step[]; minutes: number };

// cele doua moduri
export const PATTERNS: Record<PatternId, Pattern> = {
  calm: {
    id: 'calm',
    steps: [
      { phase: 'in', seconds: 4 },
      { phase: 'out', seconds: 6 },
    ],
    minutes: 2,
  },
  daily: {
    id: 'daily',
    steps: [
      { phase: 'in', seconds: 5 },
      { phase: 'out', seconds: 5 },
    ],
    minutes: 5,
  },
};

// Unde suntem dupa `elapsed` secunde de la start:
// faza de acum, cat s-a scurs din ea (0..1) si cate secunde mai are.
export function phaseAt(
  pattern: Pattern,
  elapsed: number,
): { phase: Phase; progress: number; secondsLeft: number } {
  // durata unui ciclu complet (ex: 4s + 6s = 10s)
  const cycleDuration = pattern.steps.reduce((sum, step) => sum + step.seconds, 0);

  // protectie in caz ca `elapsed` e negativ sau pattern-ul nu are pasi
  const safeElapsed = Math.max(0, elapsed);
  if (cycleDuration <= 0 || pattern.steps.length === 0) {
    return { phase: 'in', progress: 0, secondsLeft: 0 };
  }

  // pozitia curenta in interiorul ciclului activ
  let timeInCycle = safeElapsed % cycleDuration;

  for (const step of pattern.steps) {
    if (timeInCycle < step.seconds) {
      return {
        phase: step.phase,
        progress: timeInCycle / step.seconds,
        secondsLeft: step.seconds - timeInCycle,
      };
    }
    timeInCycle -= step.seconds;
  }

  // plasa de siguranta: cu numere cu virgula, scaderile pot lasa o urma mica
  const firstStep = pattern.steps[0];
  return {
    phase: firstStep.phase,
    progress: 0,
    secondsLeft: firstStep.seconds,
  };
}
