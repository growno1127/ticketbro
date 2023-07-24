import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { Wrapper } from './wrapper';
import { getChallengeRouteData } from './getChallengeRouteData';
import { getServerAuthSession } from '~/server/auth';
import { LeftWrapper } from './left-wrapper';
import { redirect } from 'next/navigation';

export default async function LayoutData({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);

  if (!challenge) return redirect('/explore');

  return (
    <ChallengeLayout
      left={<LeftWrapper challengeId={challenge.id}>{children}</LeftWrapper>}
      right={<Wrapper challenge={challenge} />}
    />
  );
}
