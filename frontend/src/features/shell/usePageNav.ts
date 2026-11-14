import { useCallback, useEffect, useRef, useState, type TouchEvent, type WheelEvent } from 'react';

// Cat dureaza trecerea de la o pagina la alta (ms). Shell.tsx o da mai departe CSS-ului.
export const PAGE_MS = 1000;

// dupa o trecere mai asteptam putin: trackpad-urile trimit scroll si dupa ce ridici degetele
const SETTLE_MS = 150;
const MIN_WHEEL = 8;  // miscari mai mici de atat sunt "zgomot"
const MIN_SWIPE = 50; // cati pixeli trebuie sa tragi cu degetul

// O pagina mai inalta decat ecranul se deruleaza intai ea; abia la capat schimbam pagina.
function canScrollInside(target: EventTarget | null, direction: 1 | -1, root: Element) {
  let el = target instanceof Element ? target : null;
  while (el && el !== root) {
    const overflowY = getComputedStyle(el).overflowY;
    const scrollable = (overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1;
    if (scrollable) {
      if (direction === 1 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
      if (direction === -1 && el.scrollTop > 0) return true;
    }
    el = el.parentElement;
  }
  return false;
}

// Navigarea pe pagini intregi: rotita, degetul, tastele si click pe capitole.
// O miscare = o pagina; cat dureaza trecerea, miscarile urmatoare sunt ignorate.
export function usePageNav(count: number) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);   // aceeasi valoare, citita din handler-e
  const lockedUntil = useRef(0); // pana cand ignoram miscarile
  const touchStartY = useRef<number | null>(null);

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(count - 1, next));
      if (clamped === indexRef.current) return;
      indexRef.current = clamped;
      lockedUntil.current = performance.now() + PAGE_MS + SETTLE_MS;
      setIndex(clamped);
    },
    [count],
  );

  const step = useCallback(
    (direction: 1 | -1) => {
      if (performance.now() < lockedUntil.current) return;
      goTo(indexRef.current + direction);
    },
    [goTo],
  );

  // tastele: sageti, Page Up / Page Down, Home, End
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target;
      // nu furam tastele cand cineva scrie intr-un camp
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') step(1);
      else if (e.key === 'ArrowUp' || e.key === 'PageUp') step(-1);
      else if (e.key === 'Home') goTo(0);
      else if (e.key === 'End') goTo(count - 1);
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [count, goTo, step]);

  const handlers = {
    onWheel(e: WheelEvent<HTMLElement>) {
      if (Math.abs(e.deltaY) < MIN_WHEEL) return;
      const direction = e.deltaY > 0 ? 1 : -1;
      if (canScrollInside(e.target, direction, e.currentTarget)) return;
      step(direction);
    },
    onTouchStart(e: TouchEvent<HTMLElement>) {
      touchStartY.current = e.touches[0].clientY;
    },
    onTouchEnd(e: TouchEvent<HTMLElement>) {
      if (touchStartY.current === null) return;
      const dragged = touchStartY.current - e.changedTouches[0].clientY;
      touchStartY.current = null;
      if (Math.abs(dragged) < MIN_SWIPE) return;
      const direction = dragged > 0 ? 1 : -1;
      if (canScrollInside(e.target, direction, e.currentTarget)) return;
      step(direction);
    },
  };

  return { index, goTo, handlers };
}
