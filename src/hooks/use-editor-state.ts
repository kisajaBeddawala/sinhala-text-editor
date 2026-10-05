'use client';

import { useCallback, useEffect, useRef } from 'react';
import { DEFAULT_EDITOR_STATE, EditorState } from '@/types/editor';
import { useEditorHistory } from './use-editor-history';
import { useLocalStorage } from './use-local-storage';

const STORAGE_KEY = 'sinhala-canvas-editor-state';

export function useEditorState() {
  const [savedState, setSavedState, isHydrated] = useLocalStorage<EditorState>(
    STORAGE_KEY,
    DEFAULT_EDITOR_STATE
  );

  const {
    state,
    setState: setHistoryState,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
  } = useEditorHistory<EditorState>(savedState);

  // Sync state to localStorage (debounced)
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!isHydrated) return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      setSavedState(state);
    }, 500);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [state, isHydrated, setSavedState]);

  // Load saved state once hydrated
  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (isHydrated && !initialLoadDone.current) {
      initialLoadDone.current = true;
      resetHistory(savedState);
    }
  }, [isHydrated, savedState, resetHistory]);

  // Update a single field
  const updateField = useCallback(
    <K extends keyof EditorState>(field: K, value: EditorState[K]) => {
      setHistoryState((prev) => ({ ...prev, [field]: value }));
    },
    [setHistoryState]
  );

  // Update multiple fields at once
  const updateFields = useCallback(
    (fields: Partial<EditorState>) => {
      setHistoryState((prev) => ({ ...prev, ...fields }));
    },
    [setHistoryState]
  );

  // Update a single field without recording history (for live-dragging sliders)
  const updateFieldLive = useCallback(
    <K extends keyof EditorState>(field: K, value: EditorState[K]) => {
      setHistoryState((prev) => ({ ...prev, [field]: value }), true);
    },
    [setHistoryState]
  );

  // Reset to defaults
  const reset = useCallback(() => {
    resetHistory(DEFAULT_EDITOR_STATE);
    setSavedState(DEFAULT_EDITOR_STATE);
  }, [resetHistory, setSavedState]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a textarea/input
      const target = e.target as HTMLElement;
      const isTextInput =
        target.tagName === 'TEXTAREA' ||
        (target.tagName === 'INPUT' &&
          ['text', 'number', 'color', 'search'].includes(
            (target as HTMLInputElement).type
          ));

      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          // Allow undo in text inputs for text editing, but if not focused on text input, do editor undo
          if (!isTextInput) {
            e.preventDefault();
            undo();
          }
        } else if ((e.key === 'z' && e.shiftKey) || e.key === 'y') {
          if (!isTextInput) {
            e.preventDefault();
            redo();
          }
        } else if (e.key === 'Enter') {
          e.preventDefault();
          // Export will be triggered by the component that handles export
          window.dispatchEvent(new CustomEvent('editor:export'));
        }
      }

      if (e.key === 'Escape') {
        // Close any open dialogs
        window.dispatchEvent(new CustomEvent('editor:escape'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    state,
    updateField,
    updateFields,
    updateFieldLive,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    isHydrated,
  };
}
