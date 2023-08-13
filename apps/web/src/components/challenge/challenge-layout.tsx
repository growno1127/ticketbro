'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_SETTINGS = {
  width: '500px',
  height: '300px',
};

type Settings = typeof DEFAULT_SETTINGS;

interface State {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
}

export const useLayoutSettingsStore = create<State>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,
      updateSettings: (settings) => set({ settings: { ...get().settings, ...settings } }),
    }),
    {
      name: 'challenge-layout-settings',
    },
  ),
);

export interface ChallengeLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export function ChallengeLayout({ left, right }: ChallengeLayoutProps) {
  const parent = useRef<HTMLDivElement>(null);
  const resizer = useRef<HTMLDivElement>(null);
  const leftSide = useRef<HTMLDivElement>(null);
  const rightSide = useRef<HTMLDivElement>(null);
  const { settings, updateSettings } = useLayoutSettingsStore();

  useEffect(() => {
    const ref = resizer.current!;
    const leftRef = leftSide.current!;
    const rightRef = rightSide.current!;

    // resize width on desktop, height on mobile
    window.innerWidth > 1025
      ? (leftRef.style.width = settings.width)
      : (leftRef.style.height = settings.height);

    // The current position of mouse
    let x = 0;
    let y = 0;
    // Width of left side on dekstop, height of top side on mobile;
    let leftWidth = 0;
    let topHeight = 0;

    const mouseMoveHandler = (e: MouseEvent | TouchEvent) => {
      let dx = 0;
      let dy = 0;
      if (e instanceof MouseEvent) {
        // How far the mouse has been moved
        dx = e.clientX - x;
        dy = e.clientY - y;
      } else if (e instanceof TouchEvent) {
        // How far the finger has been moved
        dx = e.changedTouches[0]?.clientX ? e.changedTouches[0].clientX - x : 0;
        dy = e.changedTouches[0]?.clientY ? e.changedTouches[0].clientY - y : 0;
      }

      const divideByW = parent.current?.getBoundingClientRect().width!;
      const divideByH = parent.current?.getBoundingClientRect().height!;
      const newLeftWidth = ((leftWidth + dx) * 100) / divideByW;
      const newTopHeight = ((topHeight + dy) * 100) / divideByH;

      window.innerWidth > 1025
        ? (leftRef.style.width = `${newLeftWidth}%`)
        : (leftRef.style.height = `${newTopHeight}%`);

      // prevent cursor from blinking when you move mouse too fast (leaving resizer area)
      window.innerWidth > 1025
        ? (document.body.style.cursor = 'col-resize')
        : (document.body.style.cursor = 'row-resize');

      // prevent unexpected text selection while resizing
      rightRef.style.pointerEvents = 'none';
      leftRef.style.pointerEvents = 'none';
      rightRef.style.userSelect = 'none';
      leftRef.style.userSelect = 'none';
    };

    const mouseDownHandler = (e: MouseEvent | TouchEvent) => {
      if (e instanceof MouseEvent) {
        // Get the current mouse position
        window.innerWidth > 1025 ? (x = e.clientX) : (y = e.clientY);
      } else if (e instanceof TouchEvent) {
        // Get the current finger position
        window.innerWidth > 1025
          ? (x = e.touches[0]?.clientX ?? 0)
          : (y = e.touches[0]?.clientY ?? 0);
      }

      window.innerWidth > 1025
        ? (leftWidth = leftSide.current?.getBoundingClientRect().width!)
        : (topHeight = leftSide.current?.getBoundingClientRect().height!);

      // Attach the listeners to `document`
      if (e instanceof MouseEvent) {
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
      } else if (e instanceof TouchEvent) {
        document.addEventListener('touchmove', mouseMoveHandler);
        document.addEventListener('touchend', mouseUpHandler, false);
      }
    };

    const mouseUpHandler = function () {
      // undo cursor col-resize from above
      document.body.style.removeProperty('cursor');

      // undo text selection prevention
      leftRef.style.removeProperty('user-select');
      rightRef.style.removeProperty('user-select');
      leftRef.style.removeProperty('pointer-events');
      rightRef.style.removeProperty('pointer-events');

      // Remove the handlers of `mousemove` and `mouseup` or `touchmove` and `touchend` from the `document`
      document.removeEventListener('touchmove', mouseMoveHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('touchend', mouseUpHandler);
      document.removeEventListener('mouseup', mouseUpHandler);

      window.innerWidth > 1025
        ? updateSettings({ width: `${leftRef.offsetWidth}px`, height: settings.height })
        : updateSettings({ width: settings.width, height: `${leftRef.offsetHeight}px` });
    };

    // handle window resize
    const resizeHandler = () => {
      window.innerWidth > 1025
        ? ((leftRef.style.width = settings.width), (leftRef.style.height = 'auto'))
        : ((leftRef.style.height = settings.height), (leftRef.style.width = 'auto'));
    };

    window.addEventListener('resize', resizeHandler);
    ref.addEventListener('mousedown', mouseDownHandler);
    ref.addEventListener('touchstart', mouseDownHandler, false);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      ref.removeEventListener('mousedown', mouseDownHandler);
      ref.removeEventListener('touchstart', mouseDownHandler);
    };
  }, [settings, updateSettings]);

  return (
    <div
      className="flex flex-col px-4 pb-4 lg:flex-row"
      ref={parent}
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <div
        className="min-h-[318px] w-full overflow-hidden rounded-l-2xl rounded-r-xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-800 lg:min-w-[500px]"
        ref={leftSide}
      >
        {left}
      </div>
      <div className="resizer relative p-2" ref={resizer}>
        <div className="absolute left-1/2 top-1/2 h-1 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-400 duration-300 group-hover:bg-neutral-600 group-active:bg-emerald-400 group-active:duration-75 dark:bg-neutral-700 group-hover:dark:bg-neutral-500 lg:h-24 lg:w-1" />
      </div>
      <div
        className="flex min-h-[90px] w-full flex-1 flex-col overflow-hidden rounded-l-xl rounded-r-2xl border border-zinc-300 dark:border-zinc-700 lg:min-w-[500px]"
        ref={rightSide}
      >
        {right}
      </div>
    </div>
  );
}
