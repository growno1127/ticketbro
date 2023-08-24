'use client';
import type { Difficulty } from '@repo/db/types';
import { ChevronRight } from '@repo/ui/icons';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ExploreCard } from './explore-card';
import type { ExploreChallengeData } from './explore.action';

interface Props {
  challenges: Awaited<ExploreChallengeData>;
}

const difficultyToNumber: Record<Difficulty, number> = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4,
};

export function ExploreCarousel({ challenges }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  useEffect(() => {
    const containerElement = containerRef.current;

    const handleSlideRight = () => {
      if (containerElement) {
        containerElement.scrollLeft += 330;
      }
    };

    const handleSlideLeft = () => {
      if (containerElement) {
        containerElement.scrollLeft -= 330;
      }
    };

    const handleScroll = () => {
      if (containerElement) {
        const scrollLeft = containerElement.scrollLeft;
        const scrollWidth = containerElement.scrollWidth;
        const clientWidth = containerElement.clientWidth;

        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft + clientWidth < scrollWidth);
      }
    };

    const buttonRight = containerElement?.querySelector('#slideRight');
    const buttonLeft = containerElement?.querySelector('#slideLeft');

    if (containerElement) {
      containerElement.addEventListener('scroll', handleScroll);
    }

    if (buttonRight) {
      buttonRight.addEventListener('click', handleSlideRight);
    }

    if (buttonLeft) {
      buttonLeft.addEventListener('click', handleSlideLeft);
    }

    return () => {
      if (containerElement) {
        containerElement.removeEventListener('scroll', handleScroll);
      }
      if (buttonRight) {
        buttonRight.removeEventListener('click', handleSlideRight);
      }
      if (buttonLeft) {
        buttonLeft.removeEventListener('click', handleSlideLeft);
      }
    };
  }, []);

  return (
    <div
      className="hide-scrollbar flex w-full snap-x flex-nowrap gap-4 overflow-x-scroll scroll-smooth p-6 px-4 md:px-20"
      id="container"
      ref={containerRef}
    >
      {challenges
        .sort((a, b) =>
          difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
            ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
            : a.name.localeCompare(b.name),
        )
        .map((challenge) => (
          <Link
            className="group snap-center focus:outline-none sm:w-[330px] xl:w-[333px]"
            href={`/challenge/${challenge.id}`}
            key={challenge.id}
          >
            <ExploreCard challenge={challenge} key={`challenge-${challenge.id}`} />
          </Link>
        ))}
      <button
        className="absolute right-5 top-1/2 hidden -translate-y-1/2 rounded-[5rem] border border-neutral-400 bg-neutral-200/50 px-2 py-4 backdrop-blur-sm duration-300 active:scale-75 dark:border-neutral-600 dark:bg-neutral-700/50 sm:block"
        id="slideRight"
      >
        <ChevronRight className="h-4 w-4 stroke-[3]" />
      </button>
      <button
        className="absolute left-5 top-1/2 hidden -translate-y-1/2 rounded-[5rem] border border-neutral-400 bg-neutral-200/50 px-2 py-4 backdrop-blur-sm duration-300 active:scale-75 dark:border-neutral-600 dark:bg-neutral-700/50 sm:block"
        id="slideLeft"
      >
        <ChevronRight className="h-4 w-4 rotate-180 transform stroke-[3]" />
      </button>
    </div>
  );
}
