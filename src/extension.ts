import { ExtensionContext, commands, window } from "vscode"
import { Templater, TemplaterController } from "./templater"

import { TypescriptParser } from "typescript-parser"
import { loadConfig } from "./config"
import { replaceExports } from "./replace-exports"

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log("export-typescript is now active")
  const parser = new TypescriptParser()

  const exportStarTypescript = commands.registerCommand("export-typescript.replace-exports", () => {
    const editor = window.activeTextEditor
    if (!editor) {
      return
    }
    const config = loadConfig()
    replaceExports(editor, config, parser)
  })

  const templater = new Templater(parser)
  const controller = new TemplaterController(templater)

  context.subscriptions.push(exportStarTypescript)
  context.subscriptions.push(controller)
  context.subscriptions.push(templater)
}

// this method is called when your extension is deactivated
export function deactivate() {
  // noop
}
