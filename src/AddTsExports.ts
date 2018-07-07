import { existsSync, lstatSync, readdirSync } from "fs";
import { basename, dirname, extname, join } from "path";
import { TextDocument, TextEditor } from "vscode";

export function addTsExports(doc: TextDocument, editor: TextEditor) {
    const currentDirectory = dirname(doc.fileName);

    const directoriesAndFiles = readdirSync(currentDirectory);
    const directoryImports: string[] = [];
    const fileImports: string[] = [];

    directoriesAndFiles.forEach(directoryOrFile => {
        if (directoryOrFile === basename(doc.fileName)) {
            return; // Skip ourself
        }
        const path = join(currentDirectory, directoryOrFile);
        if (lstatSync(path).isDirectory()) {
            if (containsTypescriptIndexFileSync(path)) {
                directoryImports.push(createExportString(directoryOrFile));
            }
        } else if (directoryOrFile.endsWith(".ts") || directoryOrFile.endsWith(".tsx")) {
            const typescriptFileName = basename(path, extname(path));
            fileImports.push(createExportString(typescriptFileName));
        }
    });

    const fileContents: string[] = [
        ...directoryImports,
        ...fileImports,
        "", // Add a new line at the end
    ];

    editor.edit(builder => {
        builder.insert(doc.positionAt(0), fileContents.join("\n"));
    });
}

function containsTypescriptIndexFileSync(directory: string) {
    return existsSync(join(directory, "index.ts"));
}

function createExportString(directoryOrFile: string) {
    return `export * from "./${directoryOrFile}";`;
}
