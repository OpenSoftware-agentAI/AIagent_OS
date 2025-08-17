import { ExcelReaders } from "./readers/excel.types";
import { ExcelFileReader } from "./readers/excel.reader";
import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

// exceljs 설치가 필요합니다: npm install exceljs
import * as Excel from "exceljs";

export class ExcelTool {
  constructor(private readers: ExcelReaders = ExcelFileReader) {}

  private pickRandom(list: string[]) {
    if (!list.length) return "";
    return list[Math.floor(Math.random() * list.length)];
  }

  printFeedbacks(): void {
    const data = this.readers.readDailyTest();
    const explanations = this.readers.readExplanations();
    const endingComments = this.readers.readEndingComments();
    const encouragementComments = this.readers.readEncouragementComments();
    const testRanges = this.readers.readTestRanges();

    const outputLines: string[] = [];

    if (data.length === 0) {
      const msg = "엑셀 데이터가 비어있습니다.";
      console.log(msg);
      outputLines.push(msg);
    }

    const totalProblems = data[0].length - 1;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const fullName: string = row[0];
      const shortName = fullName.length > 1 ? fullName.slice(1) : fullName;
      const answers = row.slice(1);

      const noShowCount = answers.filter((a) => a === "미응시").length;
      const randomEnding = this.pickRandom(endingComments);
      const randomEncouragement = this.pickRandom(encouragementComments);

      let output = "";

      const wrongProblems: { num: number; desc: string }[] = [];
      const correctProblems: { num: number; desc: string }[] = [];

      if (noShowCount > 0) {
        output += `${shortName} 학생은 시험에 미응시하였습니다.`;
        console.log(output);
        outputLines.push(output);
        continue;
      }

      answers.forEach((ans, idx) => {
        let desc = explanations[idx] || `${idx + 1}번 문제`;
        desc = desc.replace(/^\d+\.\s*/, "");

        if (ans === "X") {
          wrongProblems.push({ num: idx + 1, desc });
        } else if (ans === "O") {
          correctProblems.push({ num: idx + 1, desc });
        }
      });

      if (testRanges.length > 0) {
        output += `오늘 데일리테스트는 ${testRanges.join(
          ", "
        )} 범위 내에서 출제되었습니다. `;
      }

      if (wrongProblems.length === 0) {
        const correctText = correctProblems
          .map((p) => `${p.desc}(${p.num}번)`)
          .join(", ");
        output += `${shortName} 학생은 모든 문제를 맞췄습니다.`;
        if (correctText.length > 0) {
          output += ` ${correctText} 를 모두 올바르게 풀었습니다.`;
        }
        output += ` ${randomEnding}`;
        console.log(output);
        outputLines.push(output);
        continue;
      }

      const wrongText = wrongProblems
        .map((p) => `${p.desc}(${p.num}번)`)
        .join(", ");
      const correctText = correctProblems
        .map((p) => `${p.desc}(${p.num}번)`)
        .join(", ");

      if (wrongProblems.length <= 3) {
        output += `${shortName} 학생은 ${totalProblems}문제 중에서 ${wrongProblems.length}문제가 오답이었습니다. ${wrongText} 에서 실수가 있었습니다.`;

        if (correctProblems.length > 0) {
          output += ` 그러나 ${correctText} 는 올바르게 풀었습니다.`;
        }

        output += ` ${randomEnding}`;
      } else {
        output += `${shortName} 학생은 오늘 데일리테스트를 어려워했습니다. ${wrongText} 에서 실수가 있었습니다.`;
        if (correctProblems.length > 0) {
          output += ` 그러나 ${correctText} 는 올바르게 풀었습니다.`;
        }

        output += ` ${randomEncouragement}`;
      }

      console.log(output);
      outputLines.push(output);
    }

    // === 최종 결과 저장 ===
    const assetsDir = path.resolve(__dirname, "../assets");
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    const filePath = path.join(assetsDir, "finalComment.txt");
    fs.writeFileSync(filePath, outputLines.join("\n\n"), "utf-8");

    console.log(`📄 최종 피드백이 ${filePath} 에 저장되었습니다.`);
  }

  /** feedback을 data.xlsx에 삽입 */
  async insertFeedback() {
    // 1. finalComment.txt 읽기
    const filePath = path.resolve(__dirname, "../assets/finalComment.txt");
    const rawText = fs.readFileSync(filePath, "utf-8");

    const paragraphs = rawText
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(Boolean);

    // 2. data.xlsx 읽기
    const excelPath = path.resolve(__dirname, "../assets/data.xlsx");
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(excelPath);

    // 3. 시트 선택 ("데일리 작성")
    const worksheet = workbook.getWorksheet("데일리 작성");
    if (!worksheet) {
      throw new Error("❌ '데일리 작성' 시트를 찾을 수 없습니다.");
    }

    // 4. 입력할 셀 범위
    const cellRefs = [
      "F21",
      "N21",
      "V21",
      "AD21",
      "F22",
      "N22",
      "V22",
      "AD22",
      "F23",
      "N23",
      "V23",
      "AD23",
      "F24",
      "N24",
      "V24",
      "AD24",
    ];

    // 5. 피드백 입력
    paragraphs.forEach((txt, idx) => {
      if (idx >= cellRefs.length) return;
      const cell = worksheet.getCell(cellRefs[idx]);
      cell.value = txt;
      cell.alignment = { wrapText: true, vertical: "top", horizontal: "left" };
    });

    // 6. 저장
    await workbook.xlsx.writeFile(excelPath);
    console.log(
      "✅ ../assets/data.xlsx : '데일리 작성' 시트에 피드백 입력 완료 (양식 유지)"
    );
  }
}
