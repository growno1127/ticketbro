import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { prisma } from '~/server/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '~/server/auth';

const f = createUploadthing();

type ValidFileTypes = 'image' | 'video' | 'audio' | 'blob';
type FileRouterInput =
  | ValidFileTypes[]
  | {
    // @ts-ignore fixed by typehero god
    [key: ValidFileTypes]: {
      maxFileSize?: string;
      maxFileCount?: number;
    };
  };

// control the file sizes for all image types
const DEFAULT_IMAGE_UPLOAD_PARAMS: FileRouterInput = { maxFileSize: '4MB', maxFiles: 1 };

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    'image/png': DEFAULT_IMAGE_UPLOAD_PARAMS,
    'image/jpeg': DEFAULT_IMAGE_UPLOAD_PARAMS,
  })
    // Set permissions and file types for this FileRoute
    .middleware(async () => {
      const session = await getServerSession(authOptions);

      // If you throw, the user will not be able to upload
      if (!session?.user.id) throw new Error('Unauthorized');

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // save to db
      await prisma.imageUpload.create({
        data: {
          url: file.url,
          user: { connect: { id: metadata.userId } },
        },
      });
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
