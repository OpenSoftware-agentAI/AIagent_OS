// src/excel/loadExcel.js
const xlsx = require("xlsx");
const path = require("path");

function loadExcelRows(excelPath, sheetName) {
  const workbook = xlsx.readFile(excelPath);
  const wsName = sheetName || workbook.SheetNames;
  const sheet = workbook.Sheets[wsName];
  // header: 1행을 키로, defval: 빈칸도 유지
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: "" });
  return rows;
}

module.exports = { loadExcelRows };
