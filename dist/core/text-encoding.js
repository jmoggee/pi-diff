/**
 * BOM and line-ending preservation helpers for text-file mutations.
 */
export function stripBom(content) {
    return content.startsWith("\uFEFF") ? { bom: "\uFEFF", text: content.slice(1) } : { bom: "", text: content };
}
export function detectLineEnding(content) {
    const lfIdx = content.indexOf("\n");
    if (lfIdx === -1)
        return content.includes("\r") ? "\r" : "\n";
    return content[lfIdx - 1] === "\r" ? "\r\n" : "\n";
}
export function normalizeToLF(text) {
    return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}
/** Normalize line separators without rewriting lone CR characters in text. */
export function normalizeForLineEnding(text, ending) {
    return ending === "\r" ? text.replace(/\r/g, "\n") : text.replace(/\r\n/g, "\n");
}
export function restoreLineEndings(text, ending) {
    if (ending === "\r\n")
        return text.replace(/\n/g, "\r\n");
    if (ending === "\r")
        return text.replace(/\n/g, "\r");
    return text;
}
/** Strip BOM and normalize newlines for hashline matching; keep metadata for write-back. */
export function prepareTextForHashlineEdit(rawUtf8) {
    const { bom, text } = stripBom(rawUtf8);
    const ending = detectLineEnding(text);
    const normalized = normalizeToLF(text);
    return { bom, ending, normalized };
}
export function finalizeHashlineWriteContent(bom, ending, lfContent) {
    return bom + restoreLineEndings(lfContent, ending);
}
//# sourceMappingURL=text-encoding.js.map