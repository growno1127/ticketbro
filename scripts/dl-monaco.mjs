import url from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';

//@ts-check
const typescriptVersion = '5.1.6';

/** @link https://github.com/microsoft/TypeScript-Make-Monaco-Builds */
const baseUrl = `https://typescript.azureedge.net/cdn/${typescriptVersion}/monaco`;

/**
 *
 * @param {readonly [remoteUrl: string, diskPath:string]} param0
 */
async function downloadAndSaveFile([remoteUrl, diskPath]) {
  const file = await (await fetch(new URL(baseUrl + remoteUrl))).text();

  const pathToSave = url.fileURLToPath(path.join(import.meta.url, '../../', diskPath));

  const dir = path.join(pathToSave, '../');

  await fs.mkdir(dir, { recursive: true });

  await fs.writeFile(pathToSave, file, {});
}

const files = /** @type {const} */ ([
  ['/esm/vs/editor/editor.api.d.ts', './monaco-editor.d.ts'],
	// TODO switch to the local versions
  // ['/min/vs/loader.js', './public/vs/loader.js'],
  // ['/min/vs/editor/editor.main.js', './public/vs/editor/editor.main.js'],
  // ['/min/vs/editor/editor.main.nls.js', './public/vs/editor/editor.main.nls.js'],
  // [
  //   '/min/vs/basic-languages/typescript/typescript.js',
  //   './public/vs/basic-languages/typescript/typescript.js',
  // ],
  // ['/min/vs/language/typescript/tsMode.js', './public/vs/language/typescript/tsMode.js'],
  // ['/min/vs/base/worker/workerMain.js', './public/vs/base/worker/workerMain.js'],
  // [
  //   '/min/vs/base/common/worker/simpleWorker.nls.js',
  //   './public/vs/base/common/worker/simpleWorker.nls.js',
  // ],
  // ['/min/vs/language/typescript/tsWorker.js', './public/vs/language/typescript/tsWorker.js'],
  // [
  //   '/min/vs/base/common/worker/simpleWorker.nls.js',
  //   './public/vs/base/common/worker/simpleWorker.nls.js',
  // ],
]);

export const download = async (force = false) => {
  if (
    force ||
    (await fs
      .open(url.fileURLToPath(path.join(import.meta.url, '../../', files[0][1])))
      .then((f) => f.close())
      .then(() => false)
      .catch(() => true))
  ) {
    console.log('downloading monaco-editor');
    return Promise.all(files.map(downloadAndSaveFile));
  }
};

if (process.argv[1] === url.fileURLToPath(import.meta.url)) {
  download(true);
}
