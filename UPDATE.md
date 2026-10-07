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

Upstream equivalent: none as of `origin/main` at `448185c` (v0.9.2), verified 2026-10-07. Keep this behavior.

### Nix, Elixir, and Erlang highlighting

Both language maps retain these extensions:

- `nix` → `nix`
- `ex`, `exs` → `elixir`
- `erl`, `hrl` → `erlang`

What it does: Shiki uses the correct grammar for Nix, Elixir, and Erlang files in both the tool renderer and review hunk preview.

Why the fork needs it: the upstream extension map does not recognize these extensions, so those diffs render without language-specific syntax highlighting.

Implementation: keep the entries above in the `EXT_LANG` maps in `src/index.ts` and `src/review/hunk-preview.ts`. Keep the maps aligned unless upstream centralizes them.

Regression test: `src/fork-invariants.test.ts` checks all five extensions through both lookup functions.

Upstream equivalent: none as of `origin/main` at `448185c` (v0.9.2), verified 2026-10-07. Keep this behavior.

### Diff filenames are editor links

Write and edit tool headers render the filename as an OSC 8 link to `pi-diff://open`. The URI carries:

- the resolved absolute file path;
- the first changed line, clamped to line 1;
- `HERDR_WORKSPACE_ID` when the originating Pi process has one.

Why the fork needs it: the desktop protocol handler can open the changed location directly. When Herdr launches Pi, the workspace value prevents the handler from reusing a Neovim instance from another workspace.

Implementation: `diffOpenLine` selects the first added line, then the first available new or old line. `diffOpenUri` resolves the path, clamps the line to 1, and adds the workspace only when `HERDR_WORKSPACE_ID` is set. `formatToolHeaderPath` wraps the visible filename with the TUI's OSC 8 `hyperlink` helper. Write and edit execution cache the changed line for header rendering. The repository does not infer or discover another workspace.

Regression test: `src/tool-header.test.ts` covers URI construction, line clamping, the optional workspace parameter, and filename wrapping. `src/tool-config.test.ts` exercises changed-line selection and the rendered OSC 8 header through the edit tool path.

Upstream equivalent: none as of `origin/main` at `448185c` (v0.9.2), verified 2026-10-07. Keep this behavior. If upstream adds clickable filenames later, prefer its implementation only when it preserves the path, line, and optional workspace contract.

## Current upstream review

Verified 2026-10-07 after fetching both remotes. Local `main` exactly matched `fork/main`, and its merge base with `origin/main` was the current upstream tip, `448185c` (v0.9.2). Upstream has not advanced since the previous run, so there is no new upstream functionality to integrate. The latest upstream functionality remains the v0.9.2 dependency update: it moves the Pi coding-agent and TUI packages from runtime dependencies to host-provided peer dependencies while retaining them as development dependencies, removes the unused direct Pi server dependency and its install-only dependency tree, refreshes both lockfiles, and fixes the pnpm coding-agent snapshot to include its `ws` peer resolution. This is dependency metadata and installation-footprint work; it does not implement any fork invariant.

Direct comparison with the current upstream tree confirms that it still has no install-time build hook or tracked `dist/`, no Nix/Elixir/Erlang extension mappings, and no `pi-diff://open` filename links with changed-line and optional Herdr workspace routing. All three fork behaviors remain necessary, with no redundant local implementation to drop. Rebasing onto `origin/main` was a no-op because the local series remains directly based on `448185c` and retains upstream's v0.9.2 package structure and lockfiles.

The five verification commands below were run in both the fork and a pristine worktree at exact upstream commit `448185c` on 2026-10-07. Every command exited 127 before exercising project code because this environment has no `npm` executable. The unchanged pristine-upstream failures are the baseline for this run; this is not a permanent allowlist, and all commands must be retried from scratch on the next run. No generated files changed.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

A rebase is ready to push only when every command passes or each failure reproduces unchanged in a pristine worktree at the exact `origin/main` commit, and `git status --short` contains no generated or unexpected files.
