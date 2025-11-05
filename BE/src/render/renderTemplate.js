const fs = require("fs");
const path = require("path");

function renderTemplate(templatePath, data) {
  const tpl = fs.readFileSync(templatePath, "utf8");
  return tpl.replace(/{{\s*([\w.]+)\s*}}/g, (_, key) => {
    const value = key.split(".").reduce((acc, k) => acc?.[k], data);
    return value ?? "";
  });
}

module.exports = { renderTemplate };
