// PostToolUse hook (Edit|Write|NotebookEdit): reminds Claude to keep
// document.md (the repo "where is X" map) in sync after file edits.
// Never edits document.md itself - just injects a reminder.

let input = "";

process.stdin.on("data", (chunk) => {
  input += chunk;
});

process.stdin.on("end", () => {
  try {
    const data = JSON.parse(input);
    const filePath =
      (data.tool_input &&
        (data.tool_input.file_path || data.tool_input.notebook_path)) ||
      "";

    if (/document\.md$/i.test(filePath)) {
      process.exit(0);
    }

    const reminder =
      "Reminder: if this edit added, removed, or moved a file/folder, " +
      "or changed what an area of the codebase is responsible for, " +
      "check whether document.md (the repo map) needs updating so its " +
      "folder table, features/components split explanation, and " +
      "\"I want to change X\" lookup table stay accurate. Skip this if " +
      "it was a small in-place edit that didn't change file structure " +
      "or a domain's purpose.";

    process.stdout.write(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: "PostToolUse",
          additionalContext: reminder,
        },
      })
    );
  } catch (error) {
    process.exit(0);
  }
});
