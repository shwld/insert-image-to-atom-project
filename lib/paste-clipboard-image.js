'use babel';

import { Directory } from 'atom';
import {
  generateFileNameFromBuffer,
  getClipboardImgBuffer,
  findProjectPath,
} from './utils';
import { ProjectConfig } from './project-config';


function writeImage(physicalPath, fileName, imgBuffer) {
  const dir = new Directory(physicalPath);
  const filePath = `${physicalPath}/${fileName}`;
  let created = Promise.resolve();
  if (!dir.existsSync()) {
    created = dir.create();
  }
  return created.then(() =>
    new Promise((resolve, reject) => {
      return fs.writeFile(
        filePath,
        imgBuffer,
        'binary',
        (err) => {
          if (err) { return reject(err); }
          resolve(true);
        },
      );
    })
  );
}

export class PasteClipboardImage {

  constructor(serializedState) {
  }

  serialize() {}
  destroy() {}

  imageSaveAndPaste(commandEvent) {
    const editor = atom.workspace.getActiveTextEditor();
    const imgBuffer = getClipboardImgBuffer();
    if (!editor || !imgBuffer) { return; }
    commandEvent.stopImmediatePropagation();

    const filePath = editor.getPath();
    const fileName = generateFileNameFromBuffer(imgBuffer);

    const projectPath = findProjectPath(filePath);

    ProjectConfig.read(projectPath).then(config =>
      config.images
    ).then(imagesConfig => {
      const physicalPath = `${projectPath}/${imagesConfig.wwwRoot}/${imagesConfig.storePath}`;
      return writeImage(physicalPath, fileName, imgBuffer).then(() => `${imagesConfig.storePath}/${fileName}`);
    }).then(url => {
      const grammar = editor.getGrammar();
      // console.log(grammar);
      if (grammar && (grammar.name == 'Markdown' || grammar.name == 'GitHub Markdown')) {
        editor.insertText(`![](${url})`)
      } else if (grammar && grammar.name == 'HTML') {
        editor.insertText(`<img src="${url}" alt="">`);
      // Prease other grammer pull request
      } else {
        editor.insertText(url);
      }
    });
  }
}
