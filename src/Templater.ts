import { TypescriptParser } from "typescript-parser";
import { Disposable, window, workspace } from "vscode";
import { addTsExports } from "./AddTsExports";

const defaultToExportStar = true;

export class Templater {
    constructor(private parser: TypescriptParser) {}

    public dispose() {
        // noop
    }

    public fillOutTemplateIfEmpty() {
        const editor = window.activeTextEditor;
        if (!editor) {
            return;
        }

        const doc = editor.document;
        if (doc.getText().length !== 0) {
            return;
        }

        const isIndexFile = doc.fileName.endsWith("index.ts");
        if (!isIndexFile) {
            return;
        }

        if (defaultToExportStar) {
            addTsExports(doc, editor, undefined);
        } else {
            addTsExports(doc, editor, this.parser);
        }
    }
}

export class TemplaterController {
    private disposable: Disposable;

    constructor(private templater: Templater) {
        // subscribe to selection change and editor activation events
        const subscriptions: Disposable[] = [];
        workspace.onDidOpenTextDocument(this.onEvent, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this.disposable = Disposable.from(...subscriptions);
    }

    public dispose() {
        this.disposable.dispose();
    }

    private onEvent() {
        this.templater.fillOutTemplateIfEmpty();
    }
}
