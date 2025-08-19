const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function htmlToJpg({
  html,
  outPath,
  width = 800,
  height = 1600,
  deviceScaleFactor = 0.1,
  quality = 80, // JPG 품질 (0~100)
}) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.screenshot({
      path: outPath, // 예: "output.jpg"
      type: "jpeg", // JPG로 저장
      quality, // JPEG 품질
      fullPage: true, // 페이지 전체 캡처
      // omitBackground는 JPEG에선 투명도 미지원이라 효과 없음
    });
  } finally {
    await browser.close();
  }
}

module.exports = { htmlToJpg };
