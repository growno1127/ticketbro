import Link from 'next/link';

import { ExploreCard } from './explore-card';

import type { ExploreChallengeFetcher } from '.';
import type { Difficulty } from '@prisma/client';
import { Button } from '../ui/button';
import { ChevronRight, Circle, Diamond, Plus, Sparkle, Triangle } from 'lucide-react';

interface Props {
  title: string;
  fetcher: ExploreChallengeFetcher;
}

const difficultyToNumber: Record<Difficulty, number> = {
  BEGINNER: 0,
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  EXTREME: 4,
};

const COLORS_BY_DIFFICULTY = {
  BEGINNER: 'bg-gradient-to-r from-50% from-pink-600/10 dark:from-pink-500/10',
  EASY: 'bg-gradient-to-r from-50% from-green-600/10 dark:from-green-500/10',
  MEDIUM: 'bg-gradient-to-r from-50% from-yellow-600/10 dark:from-yellow-500/10',
  HARD: 'bg-gradient-to-r from-50% from-red-600/10 dark:from-red-500/10',
  EXTREME: 'bg-gradient-to-r from-50% from-orange-600/10 dark:from-orange-500/10',
};

const TITLES_BY_DIFFICULTY = {
  BEGINNER: 'bg-gradient-to-r from-pink-500 to-pink-500 dark:from-pink-500 dark:to-pink-200',
  EASY: 'bg-gradient-to-r from-green-500 to-green-500 dark:from-green-500 dark:to-green-200',
  MEDIUM: 'bg-gradient-to-r from-yellow-500 to-yellow-600 dark:from-yellow-500 dark:to-yellow-200',
  HARD: 'bg-gradient-to-r from-red-500 to-red-500 dark:from-red-500 dark:to-red-200',
  EXTREME: 'bg-gradient-to-r from-orange-500 to-orange-500 dark:from-orange-500 dark:to-orange-200',
};

const BUTTONS_BY_DIFFICULTY = {
  BEGINNER:
    'bg-pink-500/10 text-pink-700 hover:text-pink-700 dark:text-pink-300 dark:bg-pink-300/10 hover:bg-pink-500/20 dark:hover:bg-pink-300/20',
  EASY: 'bg-green-500/10 text-green-700 hover:text-green-700 dark:text-green-300 dark:bg-green-300/10 hover:bg-green-500/20 dark:hover:bg-green-300/20',
  MEDIUM:
    'bg-yellow-500/10 text-yellow-700 hover:text-yellow-700 dark:text-yellow-300 dark:bg-yellow-300/10 hover:bg-yellow-500/20 dark:hover:bg-yellow-300/20',
  HARD: 'bg-red-500/10 text-red-700 hover:text-red-700 dark:text-red-300 dark:bg-red-300/10 hover:bg-red-500/20 dark:hover:bg-red-300/20',
  EXTREME:
    'bg-orange-500/10 text-orange-700 hover:text-orange-700 dark:text-orange-300 dark:bg-orange-300/10 hover:bg-orange-500/20 dark:hover:bg-orange-300/20',
};
export async function ExploreSection({ title, fetcher }: Props) {
  const challenges = await fetcher();
  return (
    <section
      className={`relative flex w-full flex-col overflow-hidden rounded-[2.5rem] ${
        COLORS_BY_DIFFICULTY[challenges[0]?.difficulty || 'BEGINNER']
      }`}
    >
      {challenges[0]?.difficulty === 'EASY' && (
        <>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[5%] translate-y-[255%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[130%] translate-y-[130%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[265%] translate-y-[5%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[260%] translate-y-[260%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[395%] translate-y-[135%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[525%] translate-y-[265%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>
          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[535%] translate-y-[15%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[665%] translate-y-[145%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>

          <Diamond className="absolute -right-5 -top-10 h-24 w-24 -translate-x-[795%] translate-y-[275%] stroke-1 text-green-600/10 duration-300 group-hover:scale-90 dark:text-green-500/10"></Diamond>
        </>
      )}

      <div className="flex items-center justify-between p-5 pb-0 pl-7">
        {/* <div className="hidden w-[117px] md:block"></div> */}
        <h2
          className={`bg-clip-text text-3xl font-bold tracking-tight text-transparent ${
            TITLES_BY_DIFFICULTY[challenges[0]?.difficulty || 'BEGINNER']
          }`}
        >
          {title}
        </h2>
        <Button
          variant="ghost"
          className={`group items-center whitespace-nowrap rounded-full py-2 pl-4 pr-3 backdrop-blur-sm
          ${BUTTONS_BY_DIFFICULTY[challenges[0]?.difficulty || 'BEGINNER']}`}
        >
          view more
          <ChevronRight className="ml-2 h-4 w-4 stroke-[3] duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
      <div className="hide-scrollbar flex w-full snap-x flex-nowrap gap-4 overflow-x-scroll p-5">
        {challenges
          .sort((a, b) =>
            difficultyToNumber[a.difficulty] !== difficultyToNumber[b.difficulty]
              ? difficultyToNumber[a.difficulty] - difficultyToNumber[b.difficulty]
              : a.name.localeCompare(b.name),
          )
          .map((challenge) => (
            <Link
              className="group snap-center focus:outline-none sm:w-[330px] xl:w-[382px]"
              href={`/challenge/${challenge.id}`}
              key={challenge.id}
            >
              <ExploreCard key={`challenge-${challenge.id}`} challenge={challenge} />
            </Link>
          ))}
      </div>
    </section>
  );
}
