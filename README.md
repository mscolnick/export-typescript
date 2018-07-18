# export-typescript

1. Automatically export typescript files when newly creating an index.ts file.
2. While in an `index.ts` file, run this extension ("Export typescript - all declarations (as star)") to add `export * from ./<FILE_OR_FOLDER>` for each sibling file/folder in the current directory.
3. "Export typescript - all exportable declarations" will explicitly export declarations. For example, it will write `export { Foo, Bar } from ./<FILE>` for each sibling file.

## Changelog

### 0.0.4

- Add command to export all exportable declarations explicitly instead of '*'.
  - `Export typescript - all exportable declarations`

### 0.0.3

- Run command on newly created index.ts files
- Export folders only when they have an index.ts file

### 0.0.2

- Export folders and only typescript files

### 0.0.1

- Initial release. No special features or settings.
