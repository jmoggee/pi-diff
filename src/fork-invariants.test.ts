import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { __testing } from "./index.js";

describe("fork invariants", () => {
	it("builds the extension when npm installs from Git", () => {
		const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
		expect(packageJson.scripts.prepare).toBe("npm run build");
	});

	it.each([
		["file.nix", "nix"],
		["file.ex", "elixir"],
		["file.exs", "elixir"],
		["file.erl", "erlang"],
		["file.hrl", "erlang"],
	] as const)("maps %s to %s in both renderers", (file, language) => {
		expect(__testing.lang(file)).toBe(language);
		expect(__testing.detectDiffLanguage(file)).toBe(language);
	});
});
