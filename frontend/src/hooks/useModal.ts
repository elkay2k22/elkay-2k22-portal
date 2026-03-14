import { useState, useCallback } from 'react';

/**
 * A simple hook for managing modal open/close state.
 *
 * @example
 * const { isOpen, open, close, toggle } = useModal();
 */
export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open  = useCallback(() => setIsOpen(true),  []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((s) => !s), []);

  return { isOpen, open, close, toggle };
}
