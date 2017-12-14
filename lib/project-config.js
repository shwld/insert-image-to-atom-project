'use babel';

import { File } from 'atom';

const DEFAULT_PARAMS = {
  storePath: "/images",
  wwwRoot: "/",
  grammars: {
    "Markdown": {
      url: "![](${url})"
    },
    "GitHub Markdown": {
      url: "![](${url})"
    },
    "HTML": {
      url: "<img src=\"${url}\" alt=\"\">"
    }
  }
};


function getOrCreate(projectPath) {
  const config = new File(`${projectPath}/.image-config.json`);
  if (config.existsSync()) {
    return Promise.resolve(config);
  } else {
    return config.write(
      JSON.stringify(DEFAULT_PARAMS, null, 2)
    ).then(() => config);
  }
}

export class ProjectConfig {

  constructor(serializedState) {
  }

  serialize() {}
  destroy() {}

  static read(projectPath) {
    return getOrCreate(projectPath).then(config =>
      config.read()
    ).then(data =>
      Object.assign({}, DEFAULT_PARAMS, JSON.parse(data))
    ).catch(e => {
      atom.notifications.addWarning(e.message)
      return DEFAULT_PARAMS;
    });
  }
}
