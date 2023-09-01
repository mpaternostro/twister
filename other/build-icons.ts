import * as path from "node:path";
import fsExtra from "fs-extra";
import { glob } from "glob";
import { parse } from "node-html-parser";

const cwd = process.cwd();
const inputDir = path.join(cwd, "other", "svg-icons");
const inputDirRelative = path.relative(cwd, inputDir);
const outputDir = path.join(cwd, "components", "ui", "icons");
await fsExtra.ensureDir(outputDir);

const files = glob
  .sync("**/*.svg", {
    cwd: inputDir,
  })
  .sort((a, b) => a.localeCompare(b));

const shouldVerboseLog = process.argv.includes("--log=verbose");
const logVerbose = shouldVerboseLog ? console.log : () => {};

if (files.length === 0) {
  console.log(`No SVG files found in ${inputDirRelative}`);
} else {
  await generateIconFiles();
}

async function generateIconFiles() {
  const spriteFilepath = path.join(outputDir, "sprite.svg");
  const typeOutputFilepath = path.join(outputDir, "name.d.ts");
  const currentSprite = await fsExtra
    .readFile(spriteFilepath, "utf8")
    .catch(() => "");
  const currentTypes = await fsExtra
    .readFile(typeOutputFilepath, "utf8")
    .catch(() => "");

  const iconNames = files.map((file) => iconName(file));

  const spriteUpToDate = iconNames.every((name) =>
    currentSprite.includes(`id=${name}`),
  );
  const typesUpToDate = iconNames.every((name) =>
    currentTypes.includes(`"${name}"`),
  );

  if (spriteUpToDate && typesUpToDate) {
    logVerbose(`Icons are up to date`);
    return;
  }

  logVerbose(`Generating sprite for ${inputDirRelative}`);

  const spriteChanged = await generateSvgSprite({
    files,
    inputDir,
    outputPath: spriteFilepath,
  });

  for (const file of files) {
    logVerbose("✅", file);
  }
  logVerbose(`Saved to ${path.relative(cwd, spriteFilepath)}`);

  const stringifiedIconNames = iconNames.map((name) => JSON.stringify(name));

  const typeOutputContent = `// This file is generated by npm run build:icons

export type IconName =
\t| ${stringifiedIconNames.join("\n\t| ")};
`;
  const typesChanged = await writeIfChanged(
    typeOutputFilepath,
    typeOutputContent,
  );

  logVerbose(`Manifest saved to ${path.relative(cwd, typeOutputFilepath)}`);

  const readmeChanged = await writeIfChanged(
    path.join(outputDir, "README.md"),
    `# Icons

This directory contains SVG icons that are used by the app.

Everything in this directory is generated by \`npm run build:icons\`.
`,
  );

  if (spriteChanged || typesChanged || readmeChanged) {
    console.log(`Generated ${files.length} icons`);
  }
}

function iconName(file: string) {
  return file.replace(/\.svg$/, "");
}

/**
 * Creates a single SVG file that contains all the icons
 */
async function generateSvgSprite({
  files,
  inputDir,
  outputPath,
}: {
  files: string[];
  inputDir: string;
  outputPath: string;
}) {
  // Each SVG becomes a symbol and we wrap them all in a single SVG
  const symbols = await Promise.all(
    files.map(async (file) => {
      const input = await fsExtra.readFile(path.join(inputDir, file), "utf8");
      const root = parse(input);

      const svg = root.querySelector("svg");
      if (!svg) throw new Error("No SVG element found");

      svg.tagName = "symbol";
      svg.setAttribute("id", iconName(file));
      svg.removeAttribute("xmlns");
      svg.removeAttribute("xmlns:xlink");
      svg.removeAttribute("version");
      svg.removeAttribute("width");
      svg.removeAttribute("height");

      return svg.toString().trim();
    }),
  );

  const output = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<!-- This file is generated by npm run build:icons -->`,
    `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0">`,
    `<defs>`, // for semantics: https://developer.mozilla.org/en-US/docs/Web/SVG/Element/defs
    ...symbols,
    `</defs>`,
    `</svg>`,
    "", // trailing newline
  ].join("\n");

  return writeIfChanged(outputPath, output);
}

async function writeIfChanged(filepath: string, newContent: string) {
  const currentContent = await fsExtra
    .readFile(filepath, "utf8")
    .catch(() => "");
  if (currentContent === newContent) return false;
  await fsExtra.writeFile(filepath, newContent, "utf8");
  return true;
}
