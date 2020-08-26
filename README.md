# export-typescript

1. Automatically export typescript files when newly creating an index.ts file.
2. While in an `index.ts` file, run this extension ("Export typescript - all declarations (as star)") to add `export * from ./<FILE_OR_FOLDER>` for each sibling file/folder in the current directory.
3. "Export typescript - all exportable declarations" will explicitly export declarations. For example, it will write `export { Foo, Bar } from ./<FILE>` for each sibling file.

## Changelog

[CHANGELOG.md](https://github.com/mscolnick/export-typescript/blob/master/CHANGELOG.md)
