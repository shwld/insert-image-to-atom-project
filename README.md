# Insert image to atom project

When you paste an image on the clipboard, the img path is inserted.

You can set save destination and wwwroot for each project.

## Grammar supporting snippet insertion
- Markdown
- HTML

For other grammers, insert image-path.

Add snippet to other grammar Pull-Request wanted.

## Inline preview for markdown grammer

![](/assets/readme.gif)

## Settings

.image-config.json

```json
{
  "storePath": "/images",
  "wwwRoot": "/public"
}
```

- storePath: Image save destination
- wwwRoot  : Route of relative path
