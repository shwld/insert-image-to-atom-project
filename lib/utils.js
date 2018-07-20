'use babel';

import crypto from 'crypto';
import clipboard from 'clipboard';

export function generateFileNameFromBuffer(buffer, ext='png') {
  const md5 = crypto.createHash('md5');
  md5.update(buffer);
  const fileName = `${md5.digest('hex')}.${ext}`;
  return fileName;
}

export function getClipboardImgBuffer() {
  const img = clipboard.readImage();
  if (img.isEmpty()) { return null; }
  const imgBuffer = img.toPNG();
  return imgBuffer;
}

export function findProjectPath(filePath) {
  let projectPath = "";
  atom.project.getDirectories().forEach((dir) => {
    if (dir.contains(filePath)) {
      projectPath = dir.path;
    }
  });
  return projectPath;
}
