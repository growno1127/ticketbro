'use server';

import { type Prisma } from '@prisma/client';
import { getServerAuthSession } from '~/server/auth';
import { prisma } from '~/server/db';

export type ChallengeComment = Omit<
  Prisma.CommentCreateManyInput,
  'rootType' | 'rootSolutionId' | 'userId'
> & { rootType: 'CHALLENGE' };

export type SolutionComment = Omit<
  Prisma.CommentCreateManyInput,
  'rootType' | 'rootChallengeId' | 'userId'
> & { rootType: 'SOLUTION' };

/**
 *
 * @param comment a Challenge or Solution-based comment.
 * @returns the prisma create response.
 */
export async function addComment(comment: ChallengeComment | SolutionComment) {
  const session = await getServerAuthSession();

  if (!session?.user.id) return 'unauthorized';
  if (comment.text.length === 0) return 'text_is_empty';

  return await prisma.comment.create({
    data: {
      ...comment,
      userId: session.user.id,
    },
  });
}
