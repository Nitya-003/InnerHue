import type { KeyboardEvent } from 'react';

const MOOD_OPTION_SELECTOR = '[data-mood-option="true"]';

type ArrowKey = 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight';

function isArrowKey(key: string): key is ArrowKey {
  return key === 'ArrowUp' || key === 'ArrowDown' || key === 'ArrowLeft' || key === 'ArrowRight';
}

/**
 * Counts how many items share the same top offset as the first item,
 * giving us the number of columns in the CSS grid.
 */
function detectColumnCount(options: HTMLElement[]): number {
  if (options.length === 0) return 1;
  const firstTop = options[0].getBoundingClientRect().top;
  let columns = 0;
  for (const option of options) {
    if (Math.abs(option.getBoundingClientRect().top - firstTop) < 4) {
      columns += 1;
    } else {
      break;
    }
  }
  return Math.max(1, columns);
}

export function handleDirectionalMoodNavigation(
  event: KeyboardEvent<HTMLElement>,
  container: HTMLElement | null
): HTMLElement | null {
  if (!isArrowKey(event.key) || !container) {
    return null;
  }

  // DOM-ordered list of all mood option elements.
  const options = Array.from(
    container.querySelectorAll<HTMLElement>(MOOD_OPTION_SELECTOR)
  );

  if (options.length === 0) {
    return null;
  }

  const currentTarget = event.currentTarget as HTMLElement;
  const currentIndex = options.indexOf(currentTarget);

  if (currentIndex === -1) {
    return null;
  }

  const columns = detectColumnCount(options);

  let nextIndex: number;
  switch (event.key) {
    case 'ArrowRight':
      nextIndex = currentIndex + 1;
      break;
    case 'ArrowLeft':
      nextIndex = currentIndex - 1;
      break;
    case 'ArrowDown':
      nextIndex = currentIndex + columns;
      break;
    case 'ArrowUp':
      nextIndex = currentIndex - columns;
      break;
  }

  if (nextIndex < 0 || nextIndex >= options.length) {
    return null;
  }

  const nextTarget = options[nextIndex];

  event.preventDefault();
  nextTarget.focus();
  return nextTarget;
}

