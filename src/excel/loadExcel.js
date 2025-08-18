// src/excel/loadExcel.js
const xlsx = require("xlsx");
const path = require("path");

function loadExcelRows(excelPath, sheetName) {
  const workbook = xlsx.readFile(excelPath);
  const wsName = sheetName || workbook.SheetNames[0]; // <-- 첫 시트
  const sheet = workbook.Sheets[wsName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
  return rows;
}

module.exports = { loadExcelRows };
