# export-typescript

## Functions

1. Automatically export typescript files when newly creating an index.ts file.
1. While in an `index.ts` file, run this extension ("Export typescript - all declarations") to add `export * from ./<FILE_OR_FOLDER>` for each sibling file/folder in the current directory.
1. Explicitly export declarations like `export { Foo, Bar } from ./<FILE>` by setting `exportStar=false` in the config.

## Config

The default configuration is

```
"export-typescript-recursively": {
  "exportStar": true,
  "includes": ["*.{ts,tsx}"],
  "excludes": ["*.{spec.ts,spec.tsx}"]
}
```

In order to export declarations and look for files in subdirectories, put the folling in your `.vscode/settings.json`:

```
"export-typescript-recursively": {
  "exportStar": false,
  "includes": ["**/*.{ts,tsx}"],
  "excludes": ["**/*.{spec.ts,spec.tsx}"]
}
```

## Changelog

[CHANGELOG.md](https://github.com/mscolnick/export-typescript/blob/master/CHANGELOG.md)
