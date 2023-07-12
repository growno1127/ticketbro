'use client';

import { ChallengeLayout } from '~/components/challenge/challenge-layout';
import { CodePanel } from '~/components/challenge/editor';
import { useState } from 'react';
import { Checkbox } from '~/components/ui/checkbox';
import { Label } from '~/components/ui/label';
import { Markdown } from '~/components/ui/markdown';
import { useCreateChallengeStore } from './create-challenge-store';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { useToast } from '~/components/ui/use-toast';
import { ToastAction } from '@radix-ui/react-toast';
import { useRouter } from 'next/navigation';

import { type Difficulty } from '@prisma/client';
import ExploreCardInputs from '~/components/create/explore-card-inputs';

import { useTheme } from 'next-themes';

import { RichMarkdownEditor } from '~/components/ui/rich-markdown-editor';

const DEFAULT_DESCRIPTION = `### Description
Implement the built-in \`Pick<T, K>\` generic without using it.

  Constructs a type by picking the set of properties \`K\` from \`T\`

  For example:

\`\`\`ts
  interface Todo {
    title: string
    description: string
    completed: boolean
  }

  type TodoPreview = MyPick<Todo, 'title' | 'completed'>

  const todo: TodoPreview = {
      title: 'Clean room',
      completed: false,
  }
\`\`\`
`;
const DEFAULT_CHALLENGE_TEMPLATE = `// TEST CASE START (code in test cases are not editable)
Equal<Expected1, MyPick<Todo, 'title'>>()

Equal<Expected2, MyPick<Todo, 'title' | 'completed'>>()

// @ts-expect-error
MyPick<Todo, 'title' | 'completed' | 'invalid'>

interface Todo {
  title: string
  description: string
  completed: boolean
}

interface Expected1 {
  title: string
}

interface Expected2 {
  title: string
  completed: boolean
}

// CODE START (code below this line is editable)
type MyPick<T, K> = any`;

export default function CreateChallenge() {
  const createChallengeStore = useCreateChallengeStore();
  const [isPreviewing, setIsPreviewing] = useState({
    description: false,
  });
  const [description, setDescription] = useState(
    createChallengeStore.data?.description ?? DEFAULT_DESCRIPTION,
  );
  const [difficulty, setDifficulty] = useState<Difficulty | 'BEGINNER'>(
    createChallengeStore.data?.difficulty || 'BEGINNER',
  );
  const [shortDescription, setShortDescription] = useState(
    createChallengeStore.data?.shortDescription ?? '',
  );
  const [name, setName] = useState(createChallengeStore.data?.name ?? '');

  const router = useRouter();

  const { toast } = useToast();

  function onSubmit(prompt: string) {
    if (name.length < 3) {
      return toast({
        variant: 'destructive',
        title: 'The title length should be longer than 3 character',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    if (shortDescription.length < 10) {
      return toast({
        variant: 'destructive',
        title: 'The short description should be longer than 10 character',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    if (description.length < 20) {
      return toast({
        variant: 'destructive',
        title: 'The description should be longer than 20 character',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    if (difficulty === undefined) {
      return toast({
        variant: 'destructive',
        title: 'Please select a difficulty',
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }

    createChallengeStore.setData({
      name,
      description,
      shortDescription,
      difficulty,
      prompt,
    });

    router.push('/create/preview');
  }

  const { theme } = useTheme();
  theme == 'dark'
    ? document.documentElement.setAttribute('data-color-mode', 'dark')
    : document.documentElement.setAttribute('data-color-mode', 'light');

  return (
    <ChallengeLayout
      left={
        <Tabs
          defaultValue="card-editor"
          className="flex h-full w-full flex-col border-zinc-300 dark:border-zinc-700"
        >
          <TabsList className="sticky top-0 z-10 grid h-auto w-full grid-cols-2 rounded-none border-b border-zinc-300 bg-background/90 backdrop-blur-sm dark:border-zinc-700 dark:bg-muted/90">
            <TabsTrigger
              value="card-editor"
              className="rounded-md rounded-tl-xl duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Card Editor
            </TabsTrigger>
            <TabsTrigger
              value="challenge-description"
              className="rounded-md rounded-tr-lg duration-300 data-[state=active]:bg-neutral-200 dark:data-[state=active]:bg-neutral-700"
            >
              Challenge Description
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="card-editor"
            className="mt-0 flex flex-1 flex-col p-4 dark:bg-muted [&[hidden]]:hidden"
          >
            <ExploreCardInputs
              name={name}
              setName={setName}
              difficulty={difficulty}
              setDifficulty={setDifficulty}
              shortDescription={shortDescription}
              setShortDescription={setShortDescription}
            />
          </TabsContent>
          <TabsContent
            value="challenge-description"
            className="relative mt-0 flex flex-1 flex-col dark:bg-muted [&[hidden]]:hidden"
          >
            <div className="absolute bottom-4 right-4 z-10 flex items-center justify-end">
              <Label
                htmlFor="previewLong"
                className="flex cursor-pointer gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Preview:
                <Checkbox
                  id="previewLong"
                  className="border-zinc-500"
                  checked={isPreviewing.description}
                  onCheckedChange={(checked) =>
                    setIsPreviewing((rest) => ({ ...rest, description: checked === true }))
                  }
                />
              </Label>
            </div>
            {isPreviewing.description ? (
              <div className="prose-invert flex-1 px-3 py-1 leading-8 prose-h3:text-xl">
                <Markdown>{description}</Markdown>
              </div>
            ) : (
              <RichMarkdownEditor onChange={(val) => setDescription(val)} value={description} />
            )}
          </TabsContent>
        </Tabs>
      }
      right={
        <CodePanel
          mode="create"
          onSubmit={onSubmit}
          submitText="Preview"
          prompt={createChallengeStore.data?.prompt ?? DEFAULT_CHALLENGE_TEMPLATE}
        />
      }
    />
  );
}
