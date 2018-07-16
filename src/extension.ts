import { TypescriptParser } from "typescript-parser";
import { commands, ExtensionContext, window } from "vscode";
import { addTsExports } from "./AddTsExports";
import { Templater, TemplaterController } from "./Templater";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("export-typescript is now active");
    const parser = new TypescriptParser();

    const exportStarTypescript = commands.registerCommand("extension.exportStarTypescript", () => {
        if (window.activeTextEditor === undefined) {
            return;
        }

        addTsExports(window.activeTextEditor.document, window.activeTextEditor, undefined);
    });

    const exportExportableDeclarationsTypescript = commands.registerCommand(
        "extension.exportExportableDeclarationsTypescript",
        () => {
            if (window.activeTextEditor === undefined) {
                return;
            }

            addTsExports(window.activeTextEditor.document, window.activeTextEditor, parser);
        },
    );

    const templater = new Templater(parser);
    const controller = new TemplaterController(templater);

    context.subscriptions.push(exportStarTypescript);
    context.subscriptions.push(exportExportableDeclarationsTypescript);
    context.subscriptions.push(controller);
    context.subscriptions.push(templater);
}

// this method is called when your extension is deactivated
export function deactivate() {
    // noop
}
