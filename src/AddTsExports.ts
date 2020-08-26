import { existsSync, lstatSync, readdirSync } from "fs";
import { basename, dirname, extname, join } from "path";
import { Declaration, ExportableDeclaration, TypescriptParser } from "typescript-parser";
import { TextDocument, TextEditor, workspace, Range } from "vscode";

export async function addTsExports(doc: TextDocument, editor: TextEditor, parser: TypescriptParser | undefined) {
    const currentDirectory = dirname(doc.fileName);

    const directoriesAndFiles = readdirSync(currentDirectory);
    const directoryImports: string[] = [];
    const fileImports: string[] = [];

    for (const directoryOrFile of directoriesAndFiles) {
        if (directoryOrFile === basename(doc.fileName)) {
            continue; // Skip ourself
        }
        const path = join(currentDirectory, directoryOrFile);
        if (lstatSync(path).isDirectory()) {
            if (containsTypescriptIndexFileSync(path)) {
                directoryImports.push(createExportStarExport(directoryOrFile));
            }
        } else if (directoryOrFile.endsWith(".ts") || directoryOrFile.endsWith(".tsx")) {
            if (parser === undefined) {
                const typescriptFileName = basename(path, extname(path));
                const starExport = createExportStarExport(typescriptFileName);
                fileImports.push(starExport);
            } else {
                const exportableDeclarations = await createExportableDeclarationsExport(path, parser);
                fileImports.push(...exportableDeclarations);
            }
        }
    }

    const fileContents: string[] = [
        ...directoryImports,
        ...fileImports,
        "", // Add a new line at the end
    ];

    editor.edit(builder => {
        const range = new Range(0,0, doc.lineCount- 1, doc.lineAt(doc.lineCount-1).range.end.character)
        builder.replace(range, fileContents.join("\n"));
    });
}

function containsTypescriptIndexFileSync(directory: string): boolean {
    return existsSync(join(directory, "index.ts"));
}

function createExportStarExport(directoryOrFile: string): string {
    return `export * from "./${directoryOrFile}";`;
}

function isExported(declaration: Declaration): declaration is ExportableDeclaration {
    return (declaration as ExportableDeclaration).isExported === true;
}

async function createExportableDeclarationsExport(path: string, parser: TypescriptParser): Promise<string[]> {
    if (workspace.rootPath === undefined) {
        console.error("[export-typescript] workspace.rootPath is undefined");
        return [];
    }

    const file = await parser.parseFile(path, workspace.rootPath);
    const declarations = file.declarations;
    const exportedDeclarations = declarations.filter(isExported);
    const fileName = basename(path, extname(path));
    return [`export {`, ...exportedDeclarations.map(d => `    ${d.name},`), `} from "./${fileName}";`];
}
