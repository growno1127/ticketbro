'use server';

import { prisma } from '~/server/db';
import type { FormValues } from './description';

export async function addChallengeReport(challengeId: number, userId: string, data: FormValues) {
  if (userId === undefined) return 'not_logged_in';

  const report = await prisma.challengeReport.findMany({
    where: {
      challengeId,
      authorId: userId,
    },
  });
  if (report.length > 0) {
    console.info(report);
    return 'report_already_made';
  }

  await prisma.challengeReport.create({
    data: {
      challengeId,
      authorId: userId,
      text: data.comments,
      unclear: data.examples,
      derogatory: data.derogatory,
    },
  });

  return 'created';
}
