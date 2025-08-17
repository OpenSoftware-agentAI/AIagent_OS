// src/index.js
const path = require("path");
const fs = require("fs");
const { loadExcelRows } = require("./excel/loadExcel");
const { renderTemplate } = require("./render/htmlRenderer");
const { htmlToPng } = require("./render/renderImage");

(async () => {
  const excelFile = path.resolve("src", "data", "students.xlsx");

  const templateFile = path.resolve("src", "templates", "student.html");
  const outDir = path.resolve("src", "assets", "students");

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const rows = loadExcelRows(excelFile); // [{ id, name, class, score, ... }, ...]
  console.log(`Loaded ${rows.length} rows`);

  for (const row of rows) {
    const html = renderTemplate(templateFile, row);
    const safeName = String(row.name || "noname").replace(/[\\/:*?"<>|]/g, "_");
    const safeId = String(row.id || "noid").replace(/[\\/:*?"<>|]/g, "_");
    const outPath = path.join(outDir, `${safeId}_${safeName}.png`);

    await htmlToPng({
      html,
      outPath,
      width: 800, // 템플릿 CSS의 body 크기와 맞추기
      height: 450,
      deviceScaleFactor: 2, // 2x 레티나 품질
    });

    console.log(`Saved: ${outPath}`);
  }
})();
