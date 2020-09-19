# Change Log

All notable changes to the "export-typescript" extension will be documented in this file.

## [0.3.0]

- Move to rollup
- Move form tslint to eslint
- Fix defaults to handle sibling folders with `index.ts` files

## [0.2.0]

- Support only the command `Export Typescript: Export`. Depending on the configuration settings, star exports or explicit declarations will be exported. Subdirectories can also be searched.

## [0.1.0]

- Feat: support exporting only missing files ([#3](https://github.com/mscolnick/export-typescript/pull/3))

## [0.0.5]

- Add command to export all exportable declarations explicitly instead of '\*'.
  - `Export typescript - all exportable declarations`

## [0.0.4]

- blacklisted

## [0.0.3]

- Run command on newly created index.ts files
- Export folders only when they have an index.ts file

## [0.0.2]

- Export folders and only typescript files

## [0.0.1]

- Initial release. No special features or settings.
