# Insert image to atom project

When you paste an image on the clipboard, the img path is inserted.

You can set save destination and wwwroot for each project.

![](/assets/readme.gif)

## Grammar supporting snippet insertion
- Markdown
- HTML

For other grammers, insert image-path.

Add snippet to other grammar Pull-Request wanted.

## Settings

.image-config.json

```json
{
  "images": {
    "storePath": "/images",
    "wwwRoot": "/public"
  }
}
```

- storePath: Image save destination
- wwwRoot  : Route of relative path
