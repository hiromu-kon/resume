import { copyFile, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { marked } from "marked";
import puppeteer from "puppeteer";

const SOURCE = "README.md";
const STYLESHEET = "site/style.css";
const OUT_DIR = "dist";
const PDF_NAME = "resume.pdf";

const markdown = await readFile(SOURCE, "utf-8");
const title = markdown.match(/^# (.+)$/m)?.[1] ?? "Resume";

const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap">
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
    <header class="toolbar">
      <a class="download" href="${PDF_NAME}" download>PDF をダウンロード</a>
    </header>
    <main>
${marked.parse(markdown)}
    </main>
  </body>
</html>
`;

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR);
await writeFile(`${OUT_DIR}/index.html`, html);
await copyFile(STYLESHEET, `${OUT_DIR}/style.css`);

// Web と PDF の見た目を揃えるため、PDF は Markdown からではなく生成した index.html を印刷して作る
const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.goto(pathToFileURL(`${OUT_DIR}/index.html`).href, {
    waitUntil: "networkidle0",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({
    path: `${OUT_DIR}/${PDF_NAME}`,
    format: "A4",
    margin: { top: "20mm", bottom: "20mm", left: "18mm", right: "18mm" },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate:
      '<div style="width: 100%; text-align: center; font-size: 9px; color: #59636e;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>',
  });
} finally {
  await browser.close();
}

console.log(`Built ${OUT_DIR}/index.html and ${OUT_DIR}/${PDF_NAME}`);
