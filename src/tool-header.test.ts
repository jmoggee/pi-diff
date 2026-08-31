import { strict as assert } from "node:assert";
import { describe, it } from "vitest";
import { __testing } from "./index.js";

describe("tool header names", () => {
	it("prefixes write, edit, and apply_patch with a left arrow", () => {
		assert.equal(__testing.formatToolHeaderName("write"), "← write");
		assert.equal(__testing.formatToolHeaderName("create"), "← create");
		assert.equal(__testing.formatToolHeaderName("edit"), "← edit");
		assert.equal(__testing.formatToolHeaderName("apply_patch"), "← apply_patch");
		assert.equal(__testing.formatToolHeaderName("read"), "read");
	});

	it("uses toolTitle for tool header paths", () => {
		const theme = { fg: (name: string, text: string) => `${name}:${text}` };
		assert.equal(__testing.formatToolHeaderPath(theme, "src/index.ts"), "toolTitle:src/index.ts");
	});

	it("links the filename to its absolute path and changed line", () => {
		assert.equal(
			__testing.diffOpenUri("/work/project", "src/index.ts", 42),
			"pi-diff://open?path=%2Fwork%2Fproject%2Fsrc%2Findex.ts&line=42",
		);
		assert.equal(
			__testing.diffOpenUri("/work/project", "src/index.ts", 0),
			"pi-diff://open?path=%2Fwork%2Fproject%2Fsrc%2Findex.ts&line=1",
		);
		assert.equal(
			__testing.diffOpenUri("/work/project", "src/index.ts", 42, "w16"),
			"pi-diff://open?path=%2Fwork%2Fproject%2Fsrc%2Findex.ts&line=42&workspace=w16",
		);

		const theme = { fg: (_name: string, text: string) => text };
		assert.equal(
			__testing.formatToolHeaderPath(theme, "src/index.ts", "/work/project", 42),
			"\u001b]8;;pi-diff://open?path=%2Fwork%2Fproject%2Fsrc%2Findex.ts&line=42\u001b\\src/index.ts\u001b]8;;\u001b\\",
		);
	});

	it("uses the tool result error flag when rendering failures", () => {
		const testing = __testing as typeof __testing & {
			isToolResultError(result: { isError?: boolean }, context: { isError?: boolean }): boolean;
		};
		assert.equal(testing.isToolResultError({ isError: true }, { isError: false }), true);
		assert.equal(testing.isToolResultError({ isError: false }, { isError: true }), true);
		assert.equal(testing.isToolResultError({ isError: false }, { isError: false }), false);
	});
});
