// src/render/renderImage.js
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function htmlToPng({
  html,
  outPath,
  width = 800,
  height = 1600,
  deviceScaleFactor = 2,
}) {
  const browser = await puppeteer.launch({
    headless: "new", // Puppeteer 최신 버전 권장 설정
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.screenshot({
      path: outPath,
      type: "png",
      fullPage: true, // 템플릿 크기에 맞춰 고정 캡처
      omitBackground: false, // 투명 배경 원하면 true
    });
  } finally {
    await browser.close();
  }
}

module.exports = { htmlToPng };
