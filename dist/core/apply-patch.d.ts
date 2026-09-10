/**
 * apply_patch — Multi-file patch engine.
 *
 * One call can add, update, delete, or move multiple files.
 * Updates use a conservative matcher and are committed only after every
 * change has been prepared successfully.
 */
export interface ApplyPatchEdit {
    oldText: string;
    newText: string;
}
export interface ApplyPatchChange {
    /** Path to the file, relative to the patch workspace or absolute within it. */
    path: string;
    action: "add" | "update" | "delete" | "move";
    /** Content for new files (action=add). */
    content?: string;
    /** Text to find for updates (action=update). */
    oldText?: string;
    /** Replacement text for updates (action=update). */
    newText?: string;
    /** Multiple disjoint replacements for one update target. */
    edits?: ApplyPatchEdit[];
    /** Destination path for moves (action=move). */
    movePath?: string;
}
export interface ApplyPatchOptions {
    /** Base directory for relative paths. Defaults to the process cwd. */
    cwd?: string;
    /** Workspace boundary. Defaults to cwd. */
    root?: string;
}
export interface ApplyPatchResult {
    ok: boolean;
    applied: AppliedChange[];
    errors: ApplyPatchError[];
}
export interface AppliedChange {
    path: string;
    action: ApplyPatchChange["action"];
    bytes?: number;
    diff?: string;
    movePath?: string;
    oldContent?: string;
    newContent?: string;
}
export interface ApplyPatchError {
    path: string;
    action: string;
    error: string;
}
/** Decode the model-facing tool payload before it reaches the mutation core. */
export declare function parseApplyPatchInput(rawInput: unknown): ApplyPatchChange[];
export declare function executeApplyPatch(changes: ApplyPatchChange[], options?: ApplyPatchOptions): Promise<ApplyPatchResult>;
export declare function formatApplyPatchResult(result: ApplyPatchResult): string;
//# sourceMappingURL=apply-patch.d.ts.map