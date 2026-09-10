/**
 * BOM and line-ending preservation helpers for text-file mutations.
 */
export type LineEnding = "\r\n" | "\n" | "\r";
export declare function stripBom(content: string): {
    bom: string;
    text: string;
};
export declare function detectLineEnding(content: string): LineEnding;
export declare function normalizeToLF(text: string): string;
/** Normalize line separators without rewriting lone CR characters in text. */
export declare function normalizeForLineEnding(text: string, ending: LineEnding): string;
export declare function restoreLineEndings(text: string, ending: LineEnding): string;
/** Strip BOM and normalize newlines for hashline matching; keep metadata for write-back. */
export declare function prepareTextForHashlineEdit(rawUtf8: string): {
    bom: string;
    ending: LineEnding;
    normalized: string;
};
export declare function finalizeHashlineWriteContent(bom: string, ending: LineEnding, lfContent: string): string;
//# sourceMappingURL=text-encoding.d.ts.map