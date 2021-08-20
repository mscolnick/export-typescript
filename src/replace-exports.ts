import * as globby from "globby";

import { Declaration, ExportableDeclaration, TypescriptParser } from "typescript-parser";
import { Range, TextEditor } from "vscode";

import { ExtensionConfig } from "./config";
import { getQuoteChar, getQuoteStyleForFile } from "./quote.utils";
import { dirname } from "path";

export async function replaceExports(
  editor: TextEditor,
  config: ExtensionConfig,
  parser: TypescriptParser,
): Promise<void> {
  const exportStatements = await getExportStatements(editor.document.fileName, config, parser);

  replaceFileContents(editor, exportStatements.join("\n").concat("\n"));
}

function replaceFileContents(editor: TextEditor, replacement: string) {
  const doc = editor.document;
  editor.edit((builder) => {
    const range = new Range(0, 0, doc.lineCount - 1, doc.lineAt(doc.lineCount - 1).range.end.character);
    builder.replace(range, replacement);
  });
}

async function getExportStatements(docFilename: string, config: ExtensionConfig, parser: TypescriptParser) {
  const rootDir = dirname(docFilename);

  const quoteStyle = getQuoteStyleForFile(docFilename, config);
  const quoteChar = getQuoteChar(quoteStyle);

  const directoryImports: string[] = [];
  const fileImports: string[] = [];

  for await (const absFilenameBuffer of getSourceFiles(rootDir, config.includes, config.excludes)) {
    const absFilename: string = absFilenameBuffer.toString();
    if (absFilename === docFilename) {
      continue; // Skip ourself
    }
    const relFilename = getRelFilename(absFilename, rootDir);
    if (config.defaultToExportStar) {
      const starExport = createExportStarExport(relFilename, quoteChar);
      fileImports.push(starExport);
    } else {
      const exportableDeclarations = await createExportableDeclarationsExport(rootDir, relFilename, parser, quoteChar);
      fileImports.push(...exportableDeclarations);
    }
  }

  return [...directoryImports, ...fileImports];
}
function getRelFilename(absPath: string, rootPath: string) {
  return absPath.slice(rootPath.length + 1);
}
function getFilenameWithoutExt(filename: string) {
  return filename.split(".").slice(0, -1).join(".");
}
function getFilenameWithoutIndex(filename: string) {
  return filename.slice(0, -"/index".length);
}

function getAbsFilename(rootPath: string, relFilename: string) {
  return `${rootPath}/${relFilename}`;
}

function getSourceFiles(root: string, relIncludes: string[], relExcludes: string[]) {
  const absInludes = relIncludes.map((p) => getAbsFilename(root, p));
  const absExcludes = relExcludes.map((p) => getAbsFilename(root, p));
  return globby.stream(absInludes, { ignore: absExcludes });
}

function createExportStarExport(relFilename: string, quoteChar: string): string {
  const withoutExt = getFilenameWithoutExt(relFilename);
  const exportName = withoutExt.endsWith("/index") ? getFilenameWithoutIndex(withoutExt) : withoutExt;
  return `export * from ${createExportFilename(exportName, quoteChar)};`;
}

function isExported(declaration: Declaration): declaration is ExportableDeclaration {
  return (declaration as ExportableDeclaration).isExported === true;
}

async function createExportableDeclarationsExport(
  rootPath: string,
  relFilename: string,
  parser: TypescriptParser,
  quoteChar: string,
): Promise<string[]> {
  const absFilename = getAbsFilename(rootPath, relFilename);
  const file = await parser.parseFile(absFilename, rootPath);
  const declarations = file.declarations;
  const exportedDeclarations = declarations.filter(isExported);
  const withoutExt = getFilenameWithoutExt(relFilename);
  const exportName = withoutExt.endsWith("/index") ? getFilenameWithoutIndex(withoutExt) : withoutExt;
  return [
    `export {`,
    ...exportedDeclarations.map((d) => `    ${d.name},`),
    `} from ${createExportFilename(exportName, quoteChar)};`,
  ];
}

function createExportFilename(exportName: string, quoteChar: string): string {
  return `${quoteChar}./${exportName}${quoteChar}`;
}
