import * as vscode from "vscode";

export type QuoteStyle = "single" | "double";

export interface ExtensionConfig {
  defaultToExportStar: boolean;
  includes: string[];
  excludes: string[];
  quoteStyles: {
    javascript: QuoteStyle;
    typescript: QuoteStyle;
  };
}

export function loadConfig(): ExtensionConfig {
  const config = vscode.workspace.getConfiguration();
  const inputDefaultToExportStar = config.get<boolean>("export-typescript.exportStar");
  const inputIncludes = config.get<string[]>("export-typescript.includes");
  const inputExcludes = config.get<string[]>("export-typescript.excludes");
  const javascriptQuoteStyle = config.get<string>("javascript.preferences.quoteStyle");
  const typescriptQuoteStyle = config.get<string>("typescript.preferences.quoteStyle");

  return {
    defaultToExportStar: inputDefaultToExportStar ?? true,
    includes: inputIncludes ? removeStartingDotSlash(inputIncludes) : ["*.{ts,tsx}", "*/index.{ts,tsx}"],
    excludes: inputExcludes ? removeStartingDotSlash(inputExcludes) : ["*.{spec.ts,spec.tsx}"],
    quoteStyles: {
      javascript: detectQuoteStyle(javascriptQuoteStyle),
      typescript: detectQuoteStyle(typescriptQuoteStyle),
    },
  };
}

function removeStartingDotSlash(paths: string[]) {
  return paths.map((p) => (p.startsWith("./") ? p.slice("./".length) : p));
}

function detectQuoteStyle(quoteStyle: string | undefined): QuoteStyle {
  return quoteStyle === "single" ? "single" : "double";
}
