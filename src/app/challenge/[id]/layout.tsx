import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { getServerAuthSession } from '~/server/auth';
import { getChallengeRouteData } from './getChallengeRouteData';
import { LeftWrapper } from './left-wrapper';
import { Wrapper } from './wrapper';

export default async function LayoutData({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = await getServerAuthSession();
  const challenge = await getChallengeRouteData(id, session);

  return (
    <ChallengeLayout
      left={<LeftWrapper challengeId={challenge.id}>{children}</LeftWrapper>}
      right={<Wrapper challenge={challenge} />}
    />
  );
}
