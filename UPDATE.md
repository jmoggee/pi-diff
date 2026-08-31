# Fork maintenance

This fork is rebased onto `buddingnewinsights/pi-diff` and carries three local behaviours.

## Remote layout

- `origin`: `https://github.com/buddingnewinsights/pi-diff.git`
- `fork`: `git@github.com:jmoggee/pi-diff.git`

Maintain `main` as a linear series on top of `origin/main`. Before rebasing, fetch both remotes and require local `main` to match `fork/main`; divergence needs human reconciliation. Push a successful rebase with `--force-with-lease`.

## Fork invariants

### Git installs build the extension

`package.json` defines `prepare` as `npm run build`. Pi installs this repository from Git and loads `dist/index.js`, so a source-only checkout is unusable unless npm builds it during installation. Drop this patch only if upstream provides an equivalent Git-install build hook.

### Nix, Elixir, and Erlang highlighting

Both language maps retain these extensions:

- `nix` → `nix`
- `ex`, `exs` → `elixir`
- `erl`, `hrl` → `erlang`

Keep `src/index.ts` and `src/review/hunk-preview.ts` aligned unless upstream centralizes the map.

### Diff filenames are editor links

Write and edit tool headers render the filename as an OSC 8 link to `pi-diff://open`. The URI carries:

- the resolved absolute file path;
- the first changed line, clamped to line 1;
- `HERDR_WORKSPACE_ID` when the originating Pi process has one.

The workspace parameter is intentionally absent outside Herdr. The desktop handler uses it to restrict Neovim reuse to the originating workspace; this repository must not infer or discover another workspace.

Regression tests cover URI construction, changed-line selection, and rendered write/edit headers. If upstream adds equivalent clickable filenames, prefer its implementation while retaining coverage for the path, line, and optional workspace contract.

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
