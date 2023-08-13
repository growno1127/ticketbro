import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';
import { Button } from '~/components/ui/button';

export interface UserBadgeProps {
  username: string;
}

function UserBadge(props: UserBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={`/@${props.username}`}>
          <Button
            className="-ml-[0.33rem] flex h-auto w-fit items-center rounded-full bg-transparent py-1 pl-[0.33rem] pr-2 text-xs font-bold text-neutral-700 hover:bg-black/10 dark:text-white dark:hover:bg-white/20"
            size="sm"
          >
            @{props.username}
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent
        align="start"
        avoidCollisions={false}
        className="rounded-2xl rounded-bl-sm px-3 py-1 text-xs invert"
      >
        <span>Author</span>
      </TooltipContent>
    </Tooltip>
  );
}

export { UserBadge };
