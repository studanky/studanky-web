import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const ignoredDirectories = new Set([".git", ".next", "node_modules"]);
const markdownLinkPattern = /!?\[[^\]]*\]\(([^)\n]+)\)/g;

async function findMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findMarkdownFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      files.push(entryPath);
    }
  }

  return files;
}

function destinationFrom(rawDestination) {
  const value = rawDestination.trim();

  if (value.startsWith("<")) {
    const closingBracket = value.indexOf(">");
    return closingBracket === -1 ? value : value.slice(1, closingBracket);
  }

  return value.split(/\s+/, 1)[0];
}

function isRelativeFileLink(destination) {
  return (
    destination.length > 0 &&
    !destination.startsWith("#") &&
    !destination.startsWith("/") &&
    !destination.startsWith("//") &&
    !/^[a-z][a-z\d+.-]*:/i.test(destination)
  );
}

function sourceLine(content, offset) {
  return content.slice(0, offset).split("\n").length;
}

const markdownFiles = (await findMarkdownFiles(projectRoot)).sort();
const failures = [];

for (const markdownFile of markdownFiles) {
  const content = await readFile(markdownFile, "utf8");

  for (const match of content.matchAll(markdownLinkPattern)) {
    const destination = destinationFrom(match[1]);
    if (!isRelativeFileLink(destination)) continue;

    const pathWithoutFragment = destination.split("#", 1)[0].split("?", 1)[0];
    let decodedPath;

    try {
      decodedPath = decodeURIComponent(pathWithoutFragment);
    } catch {
      failures.push({
        file: markdownFile,
        line: sourceLine(content, match.index),
        destination,
        reason: "invalid URL encoding",
      });
      continue;
    }

    const resolvedPath = path.resolve(path.dirname(markdownFile), decodedPath);
    if (!existsSync(resolvedPath)) {
      failures.push({
        file: markdownFile,
        line: sourceLine(content, match.index),
        destination,
        reason: "target does not exist",
      });
    }
  }
}

if (failures.length > 0) {
  console.error("Documentation link validation failed:");
  for (const failure of failures) {
    console.error(
      `- ${path.relative(projectRoot, failure.file)}:${failure.line} ${failure.destination} (${failure.reason})`,
    );
  }
  process.exitCode = 1;
} else {
  console.log(`Documentation links valid in ${markdownFiles.length} Markdown files.`);
}
