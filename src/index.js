// src/index.js
const path = require("path");
const fs = require("fs");
const { loadExcelRows } = require("./excel/loadExcel");
const { renderTemplate } = require("./render/htmlRenderer");
// const { htmlToPng } = require("./render/renderImage");
const { htmlToJpg } = require("./render/renderImage"); // JPG용 함수로 교체

(async () => {
  const excelFile = path.resolve("src", "assets", "studentsInfo.xlsx");
  const templateFile = path.resolve("src", "templates", "student.html");
  const outDir = path.resolve("src", "assets", "students");

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const rows = loadExcelRows(excelFile); // [{ id, name, class, score, ... }, ...]
  console.log(`Loaded ${rows.length} rows`);

  for (const row of rows) {
    const html = renderTemplate(templateFile, row);
    const safeName = String(row.name || "noname").replace(/[\\/:*?"<>|]/g, "_");
    const safeId = String(row.id || "noid").replace(/[\\/:*?"<>|]/g, "_");
    const outPath = path.join(outDir, `${safeId}_${safeName}.jpg`); // 확장자 JPG

    await htmlToJpg({
      html,
      outPath,
      width: 80, // 템플릿 CSS body와 동일하게
      height: 45,
      deviceScaleFactor: 1, // 선명도 확보(레티나 느낌 원하면 2)
      quality: 85, // JPEG 품질(0~100)
    });

    console.log(`Saved: ${outPath}`);
  }
})();
