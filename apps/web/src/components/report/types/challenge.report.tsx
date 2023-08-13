import { ThumbsUp } from '@repo/ui/icons';
import { Text, UserBadge } from '@repo/ui';
import Link from 'next/link';
import { type ReportWithInfo } from '~/app/admin/report/[id]/report.action';
import { getChallenge } from '~/components/admin/admin.actions';
import { CodeEditor } from '~/components/ui/code-editor';
import { Markdown } from '~/components/ui/markdown';

export interface ChallengeReportProps {
  report: NonNullable<ReportWithInfo>;
}
export default async function ChallengeReport({ report }: ChallengeReportProps) {
  if (!report.challenge || !report.challengeId) return null;
  const challengeInfo = await getChallenge(report.challengeId);
  return (
    <section className="mt-6 flex flex-grow flex-col gap-4 overflow-auto md:flex-nowrap">
      <div className="dark:bg-muted/90 w-full rounded-lg p-4">
        <Text intent="h3">{report.challenge.name}</Text>
        <Text className="mt-2">
          Created at:{' '}
          {report.challenge.createdAt.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
          })}
        </Text>
        <Text intent="body">
          Last updated on:{' '}
          {report.challenge.updatedAt.toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'medium',
          })}
        </Text>
        <UserBadge
          username={report.challenge.user.name || 'No author found'}
          linkComponent={Link}
        />
        <div className="my-2 flex gap-4">
          <ThumbsUp /> {challengeInfo._count.vote}
        </div>
        <Markdown className="mt-4">{report.challenge.description}</Markdown>
      </div>
      <CodeEditor height="50vh" value={report.challenge.prompt} />
    </section>
  );
}
