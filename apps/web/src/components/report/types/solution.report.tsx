'use server';

import Link from 'next/link';
import { prisma } from '@repo/db';
import { type ReportWithInfo } from '~/app/admin/report/[id]/report.action';
import { Markdown } from '~/components/ui/markdown';
import Text from '~/components/ui/typography/typography';

async function getSolutionChallenge(challengeId: number) {
  return prisma.challenge.findFirstOrThrow({
    where: {
      id: challengeId,
    },
  });
}

export default async function SolutionReport({ report }: { report: NonNullable<ReportWithInfo> }) {
  if (report.type !== 'SOLUTION' || !report.solution) return null;

  const challenge = await getSolutionChallenge(report.solution.challengeId || -1);

  return (
    <div className="rounded-lg border border-slate-700 bg-zinc-800 p-3">
      <header className="mb-4 border-b border-zinc-600 py-4">
        <Text intent="h1">{report.solution.title}</Text>
        Solution for:{' '}
        <Link
          className="text-blue-600 dark:text-blue-400"
          href={`/challenge/${challenge.id}`}
          rel="noreferrer"
          target="_blank"
        >
          {challenge.name}
        </Link>{' '}
        <br />
        Created at{' '}
        {report.solution.createdAt.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </header>
      <section>
        <Markdown>{report.solution.description}</Markdown>
      </section>
    </div>
  );
}
