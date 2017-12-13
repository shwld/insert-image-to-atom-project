'use babel';

import path from 'path'
import { ProjectConfig } from './project-config';

export class InlineImageRender {

  constructor(serializedState) {
  }

  serialize() {}
  destroy() {}

  render(editor, projectPath) {
    const validMarkers = []
    editor.getMarkers().forEach((m) => {
      if (m.bufferMarker && m.bufferMarker.properties.iitapInlinePreviewed ) {
        if (!m.isValid()) { m.destroy(); }
        else { validMarkers.push(m); }
      }
    });

    if (!editor) { return; }

    ProjectConfig.read(projectPath).then(config =>
      config.images
    ).then(imagesConfig => {
      editor.scan(/^!\[[^\]\n]*\]\([^)\n]+\)$/g, scan => {
        const marked = !!validMarkers.find(m =>
          scan.computedRange.start.row == m.getBufferRange().start.row);
        if (marked) { return false; }
  
        const imagePath = scan.matchText.match(/.*\((.+)\)/)[1];
        let fullPath = '';
        if (this.hasProtocol(imagePath)) {
          fullPath = imagePath;
        } else if (path.isAbsolute(imagePath)) {
          fullPath = path.join(projectPath, imagesConfig.wwwRoot, imagePath);
        } else {
          fullPath = path.join(editor.getPath(), imagePath);
        }
        const image = document.createElement('img');
        const marker = editor.markBufferRange(scan.computedRange, {invalidate: 'inside'});
        image.style = 'max-width: 100%;';
        image.src = fullPath;
        marker.bufferMarker.setProperties({iitapInlinePreviewed: true});
        editor.decorateMarker(marker, {type: 'block', item: image, position: 'before'})
      });
    });
  }

  hasProtocol(url) {
    return /^[a-zA-Z]*:\/\//i.test(url);
  }
}
