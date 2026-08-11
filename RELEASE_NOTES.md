# @heyhuynhgiabuu/pi-diff v0.8.0

## Highlights

- **Strict edit execution** — file mutation now runs through Pi SDK 0.82's matching, validation, serialization, abort, BOM, and EOL handling instead of pi-diff's permissive fuzzy writer.
- **Accurate previews** — edit output renders the unified patch returned by Pi, so previews reflect the source that was actually matched and changed.
- **Safer ambiguity handling** — overlapping or non-unique matches, edits that overlap or do not match the original file, and malformed patches fail closed.
- **Host-provided Pi packages** — Pi core packages are peer dependencies, avoiding duplicate runtime copies while remaining development dependencies for local checks.
- **Clean release builds** — generated output is removed before compilation so deleted modules cannot leak into packages.

## Compatibility

Requires `@earendil-works/pi-coding-agent` **0.82.x**. Edit requests that previously relied on ambiguous or permissive fuzzy matching may now be rejected; provide additional unchanged context to make `oldText` unique.

## Install

```bash
pi install npm:@heyhuynhgiabuu/pi-diff@0.8.0
```
