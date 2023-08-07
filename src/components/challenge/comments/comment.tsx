'use client';

import { type CommentRoot } from '@prisma/client';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Pencil, Reply, Share, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import ReportDialog from '~/components/report';
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip';
import { toast } from '~/components/ui/use-toast';
import { UserBadge } from '~/components/ui/user-badge';
import { getRelativeTime } from '~/utils/relativeTime';
import { CommentInput } from './comment-input';
import { replyComment, updateComment, type CommentsByChallengeId } from './comment.action';
import { CommentDeleteDialog } from './delete';
import { getPaginatedComments } from './getCommentRouteData';
import clsx from 'clsx';
import { Markdown } from '~/components/ui/markdown';

interface SingleCommentProps {
  comment: CommentsByChallengeId[number];
  readonly?: boolean;
  isReply?: boolean;
  onClickReply?: () => void;
  queryKey?: (string | number)[];
  replyQueryKey?: (string | number)[];
}

type CommentProps = SingleCommentProps & {
  rootId: number;
  type: CommentRoot;
};

const commentReportSchema = z
  .object({
    spam: z.boolean().optional(),
    threat: z.boolean().optional(),
    hate_speech: z.boolean().optional(),
    bullying: z.boolean().optional(),
    text: z.string().optional(),
  })
  .refine(
    (obj) => {
      const { spam, threat, hate_speech, bullying, text } = obj;
      return spam || threat || hate_speech || bullying || (text !== undefined && text !== '');
    },
    {
      path: ['text'],
      message: 'Your report should include an issue or a reason.',
    },
  );

export type CommentReportSchemaType = z.infer<typeof commentReportSchema>;

export const Comment = ({ comment, readonly = false, rootId, type, queryKey }: CommentProps) => {
  const [showReplies, setShowReplies] = useState(false);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const queryClient = useQueryClient();

  const replyQueryKey = [`${comment.id}-comment-replies`];
  const { data, fetchNextPage, isFetching } = useInfiniteQuery({
    queryKey: replyQueryKey,
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedComments({ rootId, rootType: type, page: pageParam, parentId: comment.id }),
    getNextPageParam: (_, pages) => pages?.length + 1,
    staleTime: 5000,
  });

  async function createChallengeCommentReply() {
    try {
      const res = await replyComment(
        {
          text: replyText,
          rootId,
          rootType: type,
        },
        comment.id,
      );
      if (res === 'text_is_empty') {
        toast({
          title: 'Empty Comment',
          description: <p>You cannot post an empty comment.</p>,
        });
      } else if (res === 'unauthorized') {
        toast({
          title: 'Unauthorized',
          description: <p>You need to be signed in to post a comment.</p>,
        });
      }
      setReplyText('');
      queryClient.invalidateQueries(replyQueryKey);
      queryClient.invalidateQueries(queryKey);
      setShowReplies(true);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    }
  }

  const toggleReplies = () => setShowReplies(!showReplies);
  const toggleIsReplying = () => setIsReplying(!isReplying);

  return (
    <div className="flex flex-col p-2">
      <SingleComment comment={comment} readonly={readonly} onClickReply={toggleIsReplying} />
      {isReplying && (
        <div className="pb-2 pl-6">
          <CommentInput
            value={replyText}
            onCancel={() => {
              setIsReplying(false);
            }}
            onChange={setReplyText}
            onSubmit={async () => {
              await createChallengeCommentReply();
              setIsReplying(false);
            }}
            mode="edit"
          />
        </div>
      )}
      {comment._count.replies > 0 && (
        <button
          className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
          onClick={toggleReplies}
        >
          {showReplies ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          <div className="text-xs">
            {comment._count.replies == 1 ? '1 reply' : `${comment._count.replies} replies`}
          </div>
        </button>
      )}
      {showReplies && (
        <div className="flex flex-col gap-0.5 p-2 pl-6 pr-0">
          {data?.pages.flatMap((page) =>
            page.comments.map((reply) => (
              // this is a reply
              <SingleComment key={comment.id} comment={reply} isReply replyQueryKey={replyQueryKey} />
            )),
          )}
        </div>
      )}
      {!isFetching && showReplies && data?.pages.at(-1)?.hasMore && (
        <button
          className="flex cursor-pointer items-center gap-1 pl-6 text-xs text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
          onClick={() => fetchNextPage()}
        >
          Load more
        </button>
      )}
    </div>
  );
};

const SingleComment = ({
  comment,
  readonly = false,
  onClickReply,
  isReply,
  queryKey,
  replyQueryKey
}: SingleCommentProps) => {
  const queryClient = useQueryClient();
  const [text, setText] = useState(comment.text);
  const [isEditing, setIsEditing] = useState(false);

  async function updateChallengeComment() {
    try {
      const res = await updateComment(text, comment.id);
      if (res === 'text_is_empty') {
        toast({
          title: 'Empty Comment',
          description: <p>You cannot post an empty comment.</p>,
        });
      } else if (res === 'unauthorized') {
        toast({
          title: 'Unauthorized',
          description: <p>You need to be signed in to post a comment.</p>,
        });
      }
      queryClient.invalidateQueries(queryKey);
      queryClient.invalidateQueries(replyQueryKey);
    } catch (e) {
      toast({
        title: 'Unauthorized',
        variant: 'destructive',
        description: <p>You need to be signed in to post a comment.</p>,
      });
    }
  }

  async function copyPathNotifyUser() {
    try {
      await copyCommentUrlToClipboard();
      toast({
        title: 'Success!',
        variant: 'success',
        description: <p>Copied comment URL to clipboard!</p>,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failure!',
        variant: 'destructive',
        description: <p>Something went wrong!</p>,
      });
    }
  }

  async function copyCommentUrlToClipboard() {
    await navigator.clipboard.writeText(`${window.location.href}/comment/${comment.id}`);
  }

  const loggedinUser = useSession();

  const isAuthor = loggedinUser.data?.user?.id === comment.user.id;

  return (
    <>
      <div className="flex items-start justify-between gap-4 pr-[0.4rem]">
        <div className="flex items-center gap-1">
          <UserBadge username={comment.user.name ?? ''} />
          <Tooltip delayDuration={0.05}>
            <TooltipTrigger asChild>
              <span className="whitespace-nowrap text-[0.8rem] text-neutral-500 dark:text-neutral-400">
                {getRelativeTime(comment.createdAt)}
              </span>
            </TooltipTrigger>
            <TooltipContent align="start" className="rounded-xl" alignOffset={-55}>
              <span className="text-xs text-white">{comment.createdAt.toLocaleString()}</span>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="to-200% my-auto h-[1px] w-full bg-zinc-300 dark:bg-zinc-600" />
        <div className="my-auto flex items-center gap-4">
          {!readonly && (
            <>
              <div
                onClick={() => {
                  copyPathNotifyUser();
                }}
                className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
              >
                <Share className="h-3 w-3" />
                <div className="hidden text-[0.8rem] sm:block">Share</div>
              </div>
              {/* TODO: make dis work */}
              {!isReply && (
                <button
                  className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 disabled:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                  onClick={onClickReply}
                >
                  <Reply className="h-4 w-4" />
                  <div className="hidden text-[0.8rem] sm:block">Reply</div>
                </button>
              )}
              {isAuthor && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  <Pencil className="h-3 w-3" />
                  <div className="hidden text-[0.8rem] sm:block">Edit</div>
                </button>
              )}
              {isAuthor ? (
                <CommentDeleteDialog comment={comment} asChild>
                  <button className="flex cursor-pointer items-center gap-1 text-neutral-500 duration-200 hover:text-neutral-400 dark:text-neutral-400 dark:hover:text-neutral-300">
                    <Trash2 className="h-3 w-3" />
                    <div className="hidden text-[0.8rem] sm:block">Delete</div>
                  </button>
                </CommentDeleteDialog>
              ) : (
                <ReportDialog reportType="COMMENT" commentId={comment.id}>
                  <button className="flex cursor-pointer items-center text-[0.8rem] text-neutral-400 duration-200 hover:text-neutral-500 dark:text-neutral-600 dark:hover:text-neutral-500">
                    Report
                  </button>
                </ReportDialog>
              )}
            </>
          )}
        </div>
      </div>
      <div>
        {!isEditing && <ExpandableContent content={comment.text} />}
        {isEditing && (
          <div className="my-2">
            <CommentInput
              value={text}
              onCancel={() => {
                setIsEditing(false);
              }}
              onChange={setText}
              onSubmit={async () => {
                await updateChallengeComment();
                setIsEditing(false);
              }}
              mode="edit"
            />
          </div>
        )}
      </div>
    </>
  );
};

const ExpandableContent = ({ content }: { content: string }) => {
  const [expanded, setExpanded] = useState(true);
  const contentWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if ((contentWrapperRef.current?.clientHeight ?? 0) > 300) {
        setExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [content]);

  return (
    <div
      className={clsx(
        { 'h-full': expanded, 'max-h-[300px]': !expanded },
        'relative w-full overflow-hidden break-words pl-[1px] text-sm',
      )}
      ref={contentWrapperRef}
    >
      <Markdown>{content}</Markdown>
      {!expanded && (
        <div
          className="absolute top-0 flex h-full w-full cursor-pointer items-end bg-gradient-to-b from-transparent to-white dark:to-zinc-800"
          onClick={() => setExpanded(true)}
        >
          <div className="text-md text-label-1 dark:text-dark-label-1 flex w-full items-center justify-center hover:bg-transparent">
            Read more
          </div>
        </div>
      )}
    </div>
  );
};
