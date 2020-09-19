import { TypescriptParser } from "typescript-parser";
import { Disposable, window, workspace } from "vscode";
import { loadConfig } from "./config";
import { replaceExports } from "./replace-exports";

export class Templater {
  constructor(private parser: TypescriptParser) {}

  public dispose(): void {
    // noop
  }

  public fillOutTemplateIfEmpty(): void {
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

    const config = loadConfig();
    replaceExports(editor, config, this.parser);
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

  public dispose(): void {
    this.disposable.dispose();
  }

  private onEvent(): void {
    this.templater.fillOutTemplateIfEmpty();
  }
}
