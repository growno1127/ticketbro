'use client';

import { clsx } from 'clsx';
import { debounce } from 'lodash';
import { Bookmark as BookmarkIcon, Share, ThumbsUp } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '~/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip';
import { TypographyH3 } from '~/components/ui/typography/h3';
import type { Challenge } from '.';
import { DifficultyBadge } from '../explore/difficulty-badge';
import { ActionMenu } from '../ui/action-menu';
import { Textarea } from '../ui/textarea';
import { addOrRemoveBookmark } from './bookmark.action';
import { incrementOrDecrementUpvote } from './increment.action';
import { ShareForm } from './share-form';
import { Solutions } from './solutions';
import { Form, FormField, FormItem } from '../ui/form';
import { useForm } from 'react-hook-form';
import { Checkbox } from '../ui/checkbox';
import { TypographyLarge } from '../ui/typography/large';
import { addReport } from './report.action';
import { toast } from '../ui/use-toast';


interface Props {
  challenge: NonNullable<Challenge>;
}

export type FormValues = {
  comments: string;
  examples: boolean;
  derogatory: boolean;
  other: boolean;
};

export function DescriptionPanel({ challenge }: Props) {
  const router = useRouter();
  const [votes, setVotes] = useState(challenge._count.Vote);
  const [hasVoted, setHasVoted] = useState(challenge.Vote.length > 0);
  const [hasBookmarked, setHasBookmarked] = useState(challenge.Bookmark.length > 0);
  const session = useSession();
  const debouncedSearch = useRef(
    debounce(async (challengeId: number, userId: string, shouldIncrement: boolean) => {
      const votes = await incrementOrDecrementUpvote(challengeId, userId, shouldIncrement);
      if (votes !== undefined && votes !== null) {
        setVotes(votes);
      }

      router.refresh();
    }, 500),
  ).current;

  const debouncedBookmark = useRef(
    debounce(async (challengeId: number, userId: string, shouldBookmark: boolean) => {
      try {
        await addOrRemoveBookmark(challengeId, userId, shouldBookmark);
        setHasBookmarked(shouldBookmark);
        router.refresh();
      } catch (e) {
        console.error(e);
        // it errored so reverse the intended changes
        setHasBookmarked(!shouldBookmark);
      }
    }, 500),
  ).current;

  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      comments: '',
      other: false,
      examples: false,
      derogatory: false,
    },

  });

  async function onSubmit(data: FormValues) {
    const response = await addReport(challenge.id, session?.data?.user?.id as string, data);
    if (response === 'created') {
      toast({
        title: 'Feedback Sent',
        variant: 'success',
        description: (
          <p>
            Thank you for submitting this feedback. Someone from our moderator
            team will be reviewing it shortly.
          </p>
        )
      });
    } else if(response === 'report_already_made') {
      toast({
        title: 'Report already made',
        description: (
          <p>
            You have already made a report about this challenge. We are still 
            reviewing the question.
          </p>
        )
      })
    } else if (response === 'not_logged_in') {
      toast({
        title: 'You are not loggeed in',
        description: (
          <p>Please log in to make this report.</p>
        )
      })
    }

    setDialogOpen(false);

  }

  return (
    <>
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="sticky top-0 grid w-full grid-cols-2 rounded-xl bg-neutral-200 bg-opacity-70 backdrop-blur-md dark:bg-muted">
          <TabsTrigger className="rounded-lg" value="description">
            Description
          </TabsTrigger>
          <TabsTrigger className="rounded-lg" value="solutions">
            Solutions
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-0">
          <div className="h-full px-1 pb-0 pt-3 dark:px-4 dark:pb-2">
            <div className="flex justify-between items-baseline">
              <TypographyH3 className="mb-2 font-medium">{challenge.name}</TypographyH3>
              <div>
                <ActionMenu items={[
                  {
                    key: 'feedback',
                    label: 'Feedback',
                    icon: 'Flag'
                  }
                ]} onChange={() => setDialogOpen(true)} />
              </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={e => setDialogOpen(!e)}>
              <DialogContent>
                <Form {...form}>
                  {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <DialogHeader>
                      <DialogTitle>
                        Feedback: {challenge.name}
                      </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 my-4">
                      <TypographyLarge>Issues Encountered</TypographyLarge>
                      <FormField
                        name='examples'
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex gap-4 items-center">
                              <Checkbox id="examples" checked={field.value as boolean} onChange={field.onChange} onCheckedChange={field.onChange} />
                              <label htmlFor="examples">
                                Description or examples are unclear or incorrect
                              </label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name='derogatory'
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-4">
                              <Checkbox id="derogatory" checked={field.value as boolean} onCheckedChange={field.onChange} />
                              <label htmlFor="derogatory">
                                Racist or other derogatory statement
                              </label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name='other'
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center gap-4">
                              <Checkbox id="other" checked={field.value as boolean} onCheckedChange={field.onChange} />
                              <label htmlFor="other">
                                Other
                              </label>
                            </div>
                          </FormItem>
                        )}
                      />
                      <FormField
                        name='comments'
                        render={({ field }) => (
                          <FormItem>
                            <TypographyLarge>
                              Comments
                            </TypographyLarge>
                            <Textarea value={field.value as string} onChange={field.onChange} />
                          </FormItem>
                        )}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant='secondary' type="button" onClick={() => setDialogOpen(false)}>
                        Close
                      </Button>
                      <Button type="submit">
                        Report
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <div className="mb-6 flex items-center gap-4">
              <DifficultyBadge difficulty={challenge.difficulty} />

              <TooltipProvider>
                <Tooltip delayDuration={0.05} open={session?.data?.user?.id ? false : undefined}>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="ghost"
                        className="p-1"
                        disabled={!session?.data?.user?.id}
                        onClick={(): void => {
                          let shouldBookmark = false;
                          if (hasBookmarked) {
                            shouldBookmark = false;
                            setHasBookmarked(false);
                          } else {
                            shouldBookmark = true;
                            setHasBookmarked(true);
                          }
                          debouncedBookmark(
                            challenge.id,
                            session?.data?.user?.id as string,
                            shouldBookmark,
                          )?.catch((e) => {
                            console.error(e);
                          });
                        }}
                      >
                        <BookmarkIcon
                          size={20}
                          className={clsx(
                            {
                              'fill-blue-500 stroke-blue-500': hasBookmarked,
                              'stroke-gray-500': !hasBookmarked,
                            },
                            'hover:stroke-gray-400',
                          )}
                        />
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Login to Bookmark</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Dialog>
                <DialogTrigger>
                  <Button variant="ghost" className="p-1">
                    <Share size={20} className="stroke-gray-500 hover:stroke-gray-400" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[200px]">
                  <DialogHeader>
                    <DialogTitle>Share this challenege</DialogTitle>
                    <div className="pt-4">
                      <ShareForm />
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <TooltipProvider>
                <Tooltip delayDuration={0.05} open={session?.data?.user?.id ? false : undefined}>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        className="group -ml-1 w-14 gap-2 rounded-lg p-1"
                        variant="ghost"
                        disabled={!session?.data?.user?.id}
                        onClick={(): void => {
                          let shouldIncrement = false;
                          if (hasVoted) {
                            setVotes((v) => v - 1);
                            shouldIncrement = false;
                            setHasVoted(false);
                          } else {
                            setVotes((v) => v + 1);
                            shouldIncrement = true;
                            setHasVoted(true);
                          }
                          debouncedSearch(
                            challenge.id,
                            session?.data?.user?.id as string,
                            shouldIncrement,
                          )?.catch((e) => {
                            console.error(e);
                          });
                        }}
                      >
                        <ThumbsUp
                          size={20}
                          className={clsx(
                            {
                              'fill-emerald-600 stroke-emerald-600 group-hover:stroke-emerald-500 dark:fill-emerald-400 dark:stroke-emerald-400':
                                hasVoted,
                              'stroke-zinc-500': !hasVoted,
                            },
                            'duration-300 group-hover:stroke-zinc-400',
                          )}
                        />
                        <span
                          className={clsx(
                            {
                              'text-emerald-600 dark:text-emerald-400': hasVoted,
                              'text-zinc-500 group-hover:text-zinc-400': !hasVoted,
                            },
                            'self-end text-lg duration-300',
                          )}
                        >
                          {votes}
                        </span>
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Login to Upvote</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="prose-invert leading-8 prose-h3:text-xl">
              {/* @ts-ignore */}
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({ ...props }) => <p className="mb-4" {...props} />,
                  code({ inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        // @ts-ignore
                        style={vscDarkPlus} // theme
                        className="rounded-xl dark:rounded-md"
                        language={match[1]}
                        PreTag="section" // parent tag
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="rounded-md bg-neutral-200 p-1 font-mono dark:bg-black">
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {challenge?.description}
              </ReactMarkdown>
            </div>
          </div>
        </TabsContent>
        <TabsContent className="mt-0" value="solutions">
          <Solutions challenge={challenge} />
        </TabsContent>
      </Tabs>
    </>
  );
}
