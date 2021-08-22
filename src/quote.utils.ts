import { extname } from "path";
import { ExtensionConfig, QuoteStyle } from "./config";

export function getQuoteStyleForFile(filename: string, config: ExtensionConfig): QuoteStyle {
  switch (extname(filename)) {
    case ".js":
      return config.quoteStyles.javascript;
    case ".ts":
      return config.quoteStyles.typescript;
    default:
      return "double";
  }
}

export function getQuoteChar(quoteStyle: QuoteStyle): string {
  switch (quoteStyle) {
    case "double":
      return '"';
    case "single":
      return "'";
    default:
      return '"';
  }
}
