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

    ProjectConfig.read(projectPath).then(config => {
      const physicalPath = `${projectPath}/${config.wwwRoot}/${config.storePath}`;
      return writeImage(physicalPath, fileName, imgBuffer).then(() => [`${config.storePath}/${fileName}`, config]);
    }).then(data => {
      const url = data[0];
      const config = data[1];
      const grammar = editor.getGrammar();
      if (grammar && config.grammars && config.grammars.hasOwnProperty(grammar.name)) {
        editor.insertText(config.grammars[grammar.name].url.replace('${url}', url));
        return;
      }
      editor.insertText(url);
    });
  }
}
