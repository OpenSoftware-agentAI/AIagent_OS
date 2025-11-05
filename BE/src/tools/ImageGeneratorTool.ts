import path from "path";
import fs from "fs";
const { renderImageFromUrl } = require("../render/renderImage");

export class ImageGeneratorTool {
  private readonly BASE_URL = "http://localhost:3000";

  public async captureAllStudents(): Promise<void> {
    try {
      console.log("📡 Fetching students list...");
      const res = await fetch(`${this.BASE_URL}/students/all/ids`);
      const students = await res.json();

      if (!Array.isArray(students) || students.length === 0) {
        console.warn("⚠️ 학생 데이터가 없습니다.");
        return;
      }

      const outputDir = path.resolve(__dirname, "../../output/students");
      if (!fs.existsSync(outputDir))
        fs.mkdirSync(outputDir, { recursive: true });

      console.log(`🧾 총 ${students.length}명 이미지 생성 시작...`);

      for (const [index, student] of students.entries()) {
        const id = student.id;
        const name = (student.name ?? "noname").replace(/[\\/:*?"<>|]/g, "_");
        const url = `${this.BASE_URL}/students/${id}`;
        const outPath = path.join(outputDir, `${index + 1}_${name}_${id}.jpg`);

        console.log(`📸 [${index + 1}/${students.length}] ${name} 캡처 중...`);
        await renderImageFromUrl({
          url,
          outPath,
          width: 100,
          height: 140,
          deviceScaleFactor: 1,
          quality: 70,
        });
      }

      console.log("✅ 모든 학생 이미지 생성 완료!");
    } catch (err) {
      console.error("❌ 전체 학생 이미지 생성 중 오류:", err);
    }
  }
}

if (require.main === module) {
  const tool = new ImageGeneratorTool();
  tool.captureAllStudents();
}
