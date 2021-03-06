# Insert image to atom project

When you paste an image on the clipboard, the img path is inserted.

You can set save destination and wwwroot for each project.

## Grammar supporting snippet insertion
- Markdown
- HTML

For other grammers, insert image-path.

## Inline preview for markdown grammer

![](/assets/readme.gif)

## Settings

.image-config.json

```json
{
  "storePath": "/images",
  "wwwRoot": "/public"
  "grammars": {
    "Markdown": {
      "url": "![](${url})"
    },
    "GitHub Markdown": {
      "url": "![](${url})"
    },
    "HTML": {
      "url": "<img src=\"${url}\" alt=\"\">"
    }
  }
}
```

- storePath: Image save destination
- wwwRoot  : Route of relative path
- grammars : Grammer settings
  - url : Customize pasting style, will insert image path to ${url}
