'use client';

import { useCallback, useRef, useState } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

const MAX_HISTORY = 50;

export function useEditorHistory<T>(initialState: T) {
  const [history, setHistory] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: [],
  });

  // Use a ref to track if we should record the change
  const skipRecordRef = useRef(false);

  const setState = useCallback(
    (newState: T | ((prev: T) => T), skipRecord = false) => {
      setHistory((prev) => {
        const resolvedState =
          newState instanceof Function ? newState(prev.present) : newState;

        if (skipRecord) {
          return { ...prev, present: resolvedState };
        }

        return {
          past: [...prev.past.slice(-MAX_HISTORY), prev.present],
          present: resolvedState,
          future: [],
        };
      });
    },
    []
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.past.length === 0) return prev;
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, []);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const resetHistory = useCallback((state: T) => {
    setHistory({
      past: [],
      present: state,
      future: [],
    });
  }, []);

  return {
    state: history.present,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  };
}
