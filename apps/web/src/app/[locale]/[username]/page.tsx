import { buildMetaForDefault, buildMetaForUser } from '~/app/metadata';
import { prisma } from '@repo/db';
import { OverviewTab } from './_components/dashboard/overview-tab';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    username: string;
  };
}

export default async function Page({ params: { username: usernameFromQuery } }: Props) {
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');

  if (!username) return notFound();

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
      },
    },
    select: {
      id: true,
      createdAt: true,
      bio: true,
      image: true,
      name: true,
      userLinks: true,
    },
  });

  if (!user) return notFound();
  return <OverviewTab user={user} />;
}

export async function generateMetadata({ params: { username: usernameFromQuery } }: Props) {
  const [, username] = decodeURIComponent(usernameFromQuery).split('@');

  if (!username) return {};

  const user = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
      },
    },
    select: {
      id: true,
      createdAt: true,
      bio: true,
      image: true,
      name: true,
    },
  });

  const bio = user ? user.bio : '';
  const avatar = user && user.image ? user.image : '';

  if (username)
    return buildMetaForUser({
      username,
      title: `${username}'s profile | TypeHero`,
      description: `View the profile of ${username} on TypeHero.`,
      bio,
      avatar,
    });
  return buildMetaForDefault({
    title: 'Profile | TypeHero',
    description: 'View the profile of a user on TypeHero.',
  });
}
