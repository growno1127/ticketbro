'use client';
import Editor from '@monaco-editor/react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';
import { createTwoslashInlayProvider } from './twoslash';

declare global {
  interface Window {
    editor: monaco.editor.IStandaloneCodeEditor;
    treeStringToJson: any;
  }
}

type IGlobalEditorOptions = monaco.editor.IGlobalEditorOptions;
type IEditorOptions = monaco.editor.IEditorOptions;
type Monaco = typeof monaco;

export const options: IGlobalEditorOptions | IEditorOptions = {
  tabSize: 2,
  insertSpaces: false,
  minimap: {
    enabled: false,
  },
  readOnly: true,
};

const value = `import { equal } from "checking";

const r1 = equal<{ a: 1 } & { b: 1 }, { a: 1, b: 1 }>()
//    ^?

const r2 = equal<{ a: 1 } & { b: 1 }, { a: 2, b: 1 }>()
//    ^?
`;

const libSource = `
declare module "checking" {
/// based on: https://github.com/type-challenges/type-challenges/blob/main/utils/index.d.ts
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends
  (<T>() => T extends Y ? 1 : 2) ? true : false

export type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

export type Alike<X, Y> = Equal<MergeInsertions<X>, MergeInsertions<Y>>

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never
///

export function equal<A, B>(...args: Alike<A, B> extends true ? [] : [a: A, b: B]): Alike<A, B> extends true ? "Equal" : "Not Equal";
}
`;

const libUri = 'ts:filename/checking.d.ts';
export const CodePanel = () => {
  const onMount = async (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    monaco.languages.typescript.javascriptDefaults.addExtraLib(libSource, libUri);
    monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));

    const ts = await (
      await monaco.languages.typescript.getTypeScriptWorker()
    )(editor.getModel()?.uri!);

    const filename = editor.getModel()?.uri.toString();

    // what actually runs when checking errors
    const runCommand = async () => {
      let errors = await Promise.all([
        ts.getSemanticDiagnostics(filename!),
        ts.getSyntacticDiagnostics(filename!),
        ts.getSuggestionDiagnostics(filename!),
        ts.getCompilerOptionsDiagnostics(filename!),
      ] as const);

      console.log(errors);
    };

    editor.getModel()?.onDidChangeContent((x) => runCommand());

    monaco.languages.registerInlayHintsProvider(
      'typescript',
      createTwoslashInlayProvider(monaco, ts),
    );
  };

  return (
    <div style={{ height: '400px' }}>
      <Editor theme="vs-dark" defaultLanguage="typescript" onMount={onMount} defaultValue={value} />
    </div>
  );
};

CodePanel.displayName = 'CodePanel';
