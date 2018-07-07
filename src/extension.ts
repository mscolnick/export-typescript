import { commands, ExtensionContext, window } from "vscode";
import { addTsExports } from "./AddTsExports";
import { Templater, TemplaterController } from "./Templater";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    // tslint:disable-next-line:no-console
    console.log("export-typescript is now active");

    const exportCommand = commands.registerCommand("extension.exportTypescript", () => {
        addTsExports(window.activeTextEditor.document, window.activeTextEditor);
    });

    const templater = new Templater();
    const controller = new TemplaterController(templater);

    context.subscriptions.push(exportCommand);
    context.subscriptions.push(controller);
    context.subscriptions.push(templater);
}

// this method is called when your extension is deactivated
export function deactivate() {
    // noop
}
