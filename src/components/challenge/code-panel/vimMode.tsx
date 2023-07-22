'use client';

import type * as monaco from 'monaco-editor';
import { type initVimMode, type VimMode } from 'monaco-vim';
import { useEffect, useRef } from 'react';
import { useEditorSettingsStore } from '../settings-store';

interface VimStatusBarProps {
  editor: monaco.editor.IStandaloneCodeEditor;
  initVimMode: typeof initVimMode;
}
export const VimStatusBar = ({ editor, initVimMode }: VimStatusBarProps) => {
  const statusBarRef = useRef<HTMLDivElement | null>(null);
  const vimModeRef = useRef<VimMode>();
  const { settings } = useEditorSettingsStore();

  useEffect(() => {
    if (settings.bindings === 'vim') {
      if (!vimModeRef.current) {
        vimModeRef.current = initVimMode(editor, statusBarRef.current);
      }
    } else {
      vimModeRef.current?.dispose();
      vimModeRef.current = undefined;
      if (statusBarRef.current) {
        statusBarRef.current.textContent = '';
      }
    }
  }, [editor, initVimMode, settings.bindings]);

  return (
    <div className="flex w-full">
      <div ref={statusBarRef} className="font-mono" />
    </div>
  );
};
