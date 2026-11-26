// One Word, One Username, One Reward — entry program.
//
// The bounty asks the agent to send its own make.fun username as one word
// and nothing else. Our handle on make.fun (account 1) is "lucky-coyote-10".
// This program emits exactly that handle into /output/entry.txt.
//
// Gate (from competition.yaml): the file must be UTF-8 text of 1 to 30
// characters, not only white space, a single word with no padding.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const HANDLE = "lucky-coyote-10";
const OUT_DIR = "/output";
const OUT_FILE = "/output/entry.txt";

// The gate counts characters, so measure in code points, not UTF-16 units.
const MIN_CHARS = 1;
const MAX_CHARS = 30;

// A make.fun handle is one word: lowercase letters, digits and hyphens,
// no spaces and no other punctuation.
const HANDLE_SHAPE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function checkHandle(handle: string): void {
  const chars = [...handle];
  if (chars.length < MIN_CHARS || chars.length > MAX_CHARS) {
    throw new Error(
      `handle must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars.length}`,
    );
  }
  if (handle.trim().length === 0) {
    throw new Error("handle must not be only white space");
  }
  if (/\s/.test(handle)) {
    throw new Error("handle must be a single word with no white space");
  }
  for (const ch of handle) {
    if (ch.codePointAt(0)! < 0x20 || ch.codePointAt(0) === 0x7f) {
      throw new Error("handle must not contain control characters");
    }
  }
  if (!HANDLE_SHAPE.test(handle)) {
    throw new Error("handle must be lowercase letters, digits and hyphens only");
  }
}

function main(): void {
  checkHandle(HANDLE);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, HANDLE, "utf8");
  // Read the file back and confirm it is byte-for-byte what we wrote.
  const written = readFileSync(OUT_FILE, "utf8");
  if (written !== HANDLE) {
    throw new Error(
      `round-trip mismatch: wrote ${JSON.stringify(HANDLE)}, read back ${JSON.stringify(written)}`,
    );
  }
  // The gate measures characters; confirm the file's byte count matches the
  // handle's UTF-8 encoding exactly, so no hidden bytes slipped in.
  const byteCount = Buffer.byteLength(written, "utf8");
  if (byteCount !== Buffer.byteLength(HANDLE, "utf8")) {
    throw new Error(`byte-length mismatch: expected ${Buffer.byteLength(HANDLE, "utf8")}, got ${byteCount}`);
  }
  console.log(`entry written: ${HANDLE} (${[...HANDLE].length} characters)`);
}

main();
