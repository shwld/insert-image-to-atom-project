'use babel';

import { CompositeDisposable } from 'atom';
import { InlineImageRender } from './inline-image-render';
import { PasteClipboardImage } from './paste-clipboard-image';
import { findProjectPath } from './utils';

export default {
  pasteClipboardImage: null,
  inlineImageRender: null,
  activate(state) {
    this.pasteClipboardImage = new PasteClipboardImage();
    this.inlineImageRender = new InlineImageRender();

    atom.commands.onWillDispatch (e => {
      if (e.type != 'core:paste') { return; }
      this.pasteClipboardImage.imageSaveAndPaste(e);
    });
    
    atom.workspace.observeTextEditors((editor) => {
      const projectPath = findProjectPath(editor.getPath())
      if (!projectPath) { return }
      this.inlineImageRender.render(editor, projectPath);
      editor.onDidStopChanging(this.inlineImageRender.render.bind(this.inlineImageRender, editor, projectPath));
    });
  },
  deactivate() {
  },
  serialize() {
    return {
    };
  },
};
