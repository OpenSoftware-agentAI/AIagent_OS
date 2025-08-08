import * as xlsx from "xlsx";
import * as path from "path";
import * as fs from "fs";

export class ExcelTool {
  private filePath: string;
  private explanationPath: string;

  constructor() {
    this.filePath = path.join(__dirname, "../data.xlsm");
    this.explanationPath = path.join(__dirname, "../explanation.txt");
  }

  /**
   * 엑셀 파일의 T3:Y9 범위(예시)를 읽어서 반환합니다.
   */
  readDailyTest(): string[][] {
    const workbook = xlsx.readFile(this.filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // T3:Y9 범위 읽기 (범위는 데이터에 맞게 조정 가능)
    const data = xlsx.utils.sheet_to_json(worksheet, {
      range: "T3:Y9",
      header: 1,
    }) as string[][];

    return data;
  }

  readExplanations(): string[] {
    const file = fs.readFileSync(this.explanationPath, "utf-8");
    return file
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  testPrintExplanations(): void {
    const explanations = this.readExplanations();
    console.log("=== 문제 설명 리스트 ===");
    explanations.forEach((desc, idx) => {
      console.log(`${idx + 1}번 문제: ${desc}`);
    });
  }

  printFeedbacks(): void {
    const data = this.readDailyTest();
    const explanations = this.readExplanations();

    const totalProblems = data[0].length - 1;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const fullName: string = row[0];
      const shortName = fullName.length > 1 ? fullName.slice(1) : fullName;
      const answers = row.slice(1);

      const noShowCount = answers.filter((a) => a === "미응시").length;
      if (noShowCount > 0) {
        console.log(`${shortName} 학생은 시험에 미응시하였습니다.`);
        continue;
      }

      const wrongProblems: { num: number; desc: string }[] = [];
      const correctProblems: { num: number; desc: string }[] = [];

      answers.forEach((ans, idx) => {
        let desc = explanations[idx] || `${idx + 1}번 문제`;
        desc = desc.replace(/^\d+\.\s*/, "");

        if (ans === "X") {
          wrongProblems.push({ num: idx + 1, desc });
        } else if (ans === "O") {
          correctProblems.push({ num: idx + 1, desc });
        }
      });

      if (wrongProblems.length === 0) {
        console.log(`${shortName} 학생은 모든 문제를 맞췄습니다.`);
        continue;
      }

      const wrongText = wrongProblems
        .map((p) => `${p.desc}(${p.num}번)`)
        .join(", ");
      const correctText = correctProblems
        .map((p) => `${p.desc}(${p.num}번)`)
        .join(", ");

      console.log(
        `${shortName} 학생은 ${totalProblems}문제 중에서 ${wrongProblems.length}문제가 오답이었습니다. ${wrongText} 문제에서 실수가 있었습니다.` +
          (correctProblems.length > 0
            ? ` 그러나 ${correctText} 문제는 올바르게 풀었습니다.`
            : "")
      );
    }
  }
}
