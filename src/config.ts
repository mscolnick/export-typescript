import * as vscode from "vscode";

export interface ExtensionConfig {
  defaultToExportStar: boolean;
  includes: string[];
  excludes: string[];
}

export function loadConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration("export-typescript");
  const inputDefaultToExportStar = config.get<boolean>("exportStar");
  const inputIncludes = config.get<string[]>("includes");
  const inputExcludes = config.get<string[]>("excludes");

  return {
    defaultToExportStar: inputDefaultToExportStar ?? true,
    includes: inputIncludes ? removeStartingDotSlash(inputIncludes) : ["*.{ts,tsx}", "*/index.{ts,tsx}"],
    excludes: inputExcludes ? removeStartingDotSlash(inputExcludes) : ["*.{spec.ts,spec.tsx}"],
  };
}

function removeStartingDotSlash(paths: string[]) {
  return paths.map((p) => (p.startsWith("./") ? p.slice("./".length) : p));
}
