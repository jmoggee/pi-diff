# Fork maintenance

This fork is rebased onto `buddingnewinsights/pi-diff` and carries three local behaviours.

## Remote layout

- `origin`: `https://github.com/buddingnewinsights/pi-diff.git`
- `fork`: `git@github.com:jmoggee/pi-diff.git`

Maintain `main` as a linear series on top of `origin/main`. Before rebasing, fetch both remotes and require local `main` to match `fork/main`; divergence needs human reconciliation. Push a successful rebase with `--force-with-lease`.

## Fork invariants

### Git installs build the extension

What it does: an npm install from Git builds the extension before Pi loads it.

Why the fork needs it: Pi installs this repository from Git and loads `dist/index.js`. Upstream ignores `dist/` and has no install-time build hook, so a source-only Git checkout cannot load the extension.

Implementation: `package.json` defines `prepare` as `npm run build`. The fork also commits the generated `dist/` tree for runtimes that consume the checkout without running lifecycle scripts.

Regression test: `src/fork-invariants.test.ts` checks the exact `prepare` command. The verification sequence runs `npm ci` and `npm run build`, then requires the tracked build output to remain clean.

Upstream equivalent: none as of `origin/main` at `79b00a7` (v0.9.1), verified 2026-09-13. Keep this behavior.

### Nix, Elixir, and Erlang highlighting

Both language maps retain these extensions:

- `nix` → `nix`
- `ex`, `exs` → `elixir`
- `erl`, `hrl` → `erlang`

What it does: Shiki uses the correct grammar for Nix, Elixir, and Erlang files in both the tool renderer and review hunk preview.

Why the fork needs it: the upstream extension map does not recognize these extensions, so those diffs render without language-specific syntax highlighting.

Implementation: keep the entries above in the `EXT_LANG` maps in `src/index.ts` and `src/review/hunk-preview.ts`. Keep the maps aligned unless upstream centralizes them.

Regression test: `src/fork-invariants.test.ts` checks all five extensions through both lookup functions.

Upstream equivalent: none as of `origin/main` at `79b00a7` (v0.9.1), verified 2026-09-13. Keep this behavior.

### Diff filenames are editor links

Write and edit tool headers render the filename as an OSC 8 link to `pi-diff://open`. The URI carries:

- the resolved absolute file path;
- the first changed line, clamped to line 1;
- `HERDR_WORKSPACE_ID` when the originating Pi process has one.

Why the fork needs it: the desktop protocol handler can open the changed location directly. When Herdr launches Pi, the workspace value prevents the handler from reusing a Neovim instance from another workspace.

Implementation: `diffOpenLine` selects the first added line, then the first available new or old line. `diffOpenUri` resolves the path, clamps the line to 1, and adds the workspace only when `HERDR_WORKSPACE_ID` is set. `formatToolHeaderPath` wraps the visible filename with the TUI's OSC 8 `hyperlink` helper. Write and edit execution cache the changed line for header rendering. The repository does not infer or discover another workspace.

Regression test: `src/tool-header.test.ts` covers URI construction and filename wrapping. `src/tool-config.test.ts` covers changed-line selection and rendered edit and write headers, including the optional workspace parameter.

Upstream equivalent: none as of `origin/main` at `79b00a7` (v0.9.1), verified 2026-09-13. Keep this behavior. If upstream adds clickable filenames later, prefer its implementation only when it preserves the path, line, and optional workspace contract.

## Upstream review for 2026-09-11

The previous fork base was `38ab45e` (v0.9.0). One upstream release arrived:

- v0.9.1 (`79b00a7`) makes apply_patch matching safer and more useful: it accepts common JSON-string and single-object model payloads before strict validation, requires unique replacements, reports ambiguous matches, and conservatively tolerates escaped sequences plus Unicode and trailing-whitespace drift. It also removes the remaining title/body gap from write, edit, and apply_patch rendering and resolves the apply_patch header background before painting it.

This release implements none of the fork invariants. The rebase carries all three local behaviors forward and keeps upstream's zero-gap renderer spacing in the linked write and edit headers.

## Upstream review for 2026-09-12

No upstream commits arrived after `79b00a7` (v0.9.1). `git log HEAD..origin/main` is empty, and the current upstream tree still provides none of the three fork invariants. All local behaviors remain necessary and are carried unchanged.

## Upstream review for 2026-09-13

After fetching both remotes, `origin/main` remains at `79b00a7` (v0.9.1), so no new upstream functionality arrived since the previous review. Local `main` matched `fork/main`, `git log HEAD..origin/main` was empty, and the existing fork commits remained based directly on the current upstream tip. The upstream tree still provides none of the three fork invariants, so all local behaviors remain necessary and no implementation was dropped.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

A rebase is ready to push only when every command passes and `git status --short` contains no generated or unexpected files.
