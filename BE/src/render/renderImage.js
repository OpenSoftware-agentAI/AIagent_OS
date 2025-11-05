const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");


async function htmlToJpg({
  html,
  outPath,
  width = 100,
  height = 140,
  deviceScaleFactor = 1,
  quality = 70,
}) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });


  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor });
    await page.setContent(html, { waitUntil: "networkidle0" });


    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });


    await page.screenshot({
      path: outPath,
      type: "jpeg",
      quality,
      fullPage: true,
    });


    console.log(`✅ HTML 렌더 완료: ${outPath}`);
  } finally {
    await browser.close();
  }
}


async function renderImageFromUrl({
  url,
  outPath,
  width = 100,
  height = 140,
  deviceScaleFactor = 2,
  quality = 70,
}) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });


  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor });
    await page.goto(url, { waitUntil: "networkidle0" });


    const dir = path.dirname(outPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });


    await page.screenshot({
      path: outPath,
      type: "jpeg",
      quality,
      fullPage: true,
    });


    console.log(`✅ URL 캡처 완료: ${url} → ${outPath}`);
  } catch (err) {
    console.error("❌ URL → JPG 변환 실패:", err);
  } finally {
    await browser.close();
  }
}


module.exports = { htmlToJpg, renderImageFromUrl };