import { getServerAuthSession } from '@repo/auth/server';
import { ForceRenderUntilClient } from '@repo/ui';
import { ChallengeLayout } from '../_components/challenge-layout';
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
    <ForceRenderUntilClient>
      <ChallengeLayout
        left={<LeftWrapper challengeId={challenge.id}>{children}</LeftWrapper>}
        right={<Wrapper challenge={challenge} />}
      />
    </ForceRenderUntilClient>
  );
}
