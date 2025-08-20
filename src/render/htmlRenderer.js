// src/render/htmlRenderer.js
const fs = require("fs");
const path = require("path");

function renderTemplate(templatePath, data) {
  const tpl = fs.readFileSync(templatePath, "utf8");
  // 매우 단순한 {{key}} 치환기
  return tpl.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const value = key.split(".").reduce((acc, k) => (acc ? acc[k] : ""), data);
    return value === undefined || value === null ? "" : String(value);
  });
}

module.exports = { renderTemplate };
