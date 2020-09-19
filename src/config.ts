import * as vscode from "vscode"

export interface ExtensionConfig {
  defaultToExportStar: boolean
  includes: string[]
  excludes: string[]
}

export function loadConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration("export-typescript")
  const inputDefaultToExportStar: any = config.get("exportStar")
  const inputIncludes: any = config.get("includes")
  const inputExcludes: any = config.get("excludes")

  return {
    defaultToExportStar: inputDefaultToExportStar ?? true,
    includes: inputIncludes ? removeStartingDotSlash(inputIncludes) : ["*.{ts,tsx}"],
    excludes: inputExcludes ? removeStartingDotSlash(inputExcludes) : ["*.{spec.ts,spec.tsx}"],
  }
}

function removeStartingDotSlash(paths: string[]) {
  return paths.map((p) => (p.startsWith("./") ? p.slice("./".length) : p))
}
