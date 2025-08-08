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

  /**
   * explanation.txt의 각 줄을 문제 설명으로 읽어서 배열로 반환
   */
  readExplanations(): string[] {
    const file = fs.readFileSync(this.explanationPath, "utf-8");
    return file
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  // ExcelTool 내에 테스트용 메서드 추가 예시
  testPrintExplanations(): void {
    const explanations = this.readExplanations();
    console.log("=== 문제 설명 리스트 ===");
    explanations.forEach((desc, idx) => {
      console.log(`${idx + 1}번 문제: ${desc}`);
    });
  }

  printWrongCounts(): void {
    const data = this.readDailyTest();

    const header = data[0];
    const totalProblems = header.length - 1;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const name = row[0];
      const answers = row.slice(1);

      const wrongCount = answers.filter((a) => a === "X").length;
      const noShowCount = answers.filter((a) => a === "미응시").length;

      // 이름에서 성을 뺀 나머지 이름
      const shortName = name.length > 1 ? name.slice(1) : name;

      if (noShowCount > 0) {
        console.log(`${shortName}이는 미응시 입니다.`);
      } else {
        console.log(
          `${shortName}이는 ${totalProblems}문제 중에서 ${wrongCount}문제가 오답이었습니다.`
        );
      }
    }
  }

  /**
   * **신규 추가**:
   * 학생별 오답 문제에 대해 문제 설명을 포함한 피드백을 출력하는 메서드
   */
  printFeedbacks(): void {
    const data = this.readDailyTest();
    const explanations = this.readExplanations();

    // 헤더 : [이름, 1, 2, 3, 4, 5]
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
        // 문제 설명에서 앞 번호 제거
        let desc = explanations[idx] || `${idx + 1}번 문제`;
        desc = desc.replace(/^\d+\.\s*/, "");

        if (ans === "X") {
          wrongProblems.push({ num: idx + 1, desc });
        } else if (ans === "O") {
          correctProblems.push({ num: idx + 1, desc });
        }
      });

      if (wrongProblems.length === 0) {
        // 모두 맞춤
        console.log(`${shortName} 학생은 모든 문제를 맞췄습니다.`);
        continue;
      }

      // 틀린 문제 설명 나열
      const wrongText = wrongProblems
        .map((p) => `${p.desc}(${p.num}번)`)
        .join(", ");

      // 맞은 문제 설명 나열
      const correctText = correctProblems
        .map((p) => `${p.desc}(${p.num}번)`)
        .join(", ");

      // 최종 문장 조립
      // 예: "정환 학생은 5문제 중에서 2문제가 오답이었습니다. 기부액이 일정 금액 이상이기 위해 몇 개를 판매해야 하는 문제(1번), 시속과 관련한 문제(2번) 문제에서 실수가 있었습니다. 그러나 최대 구매 가능 개수 구하는 문제(3번), 식의 값을 조건에 맞게 만드는 문제(5번) 문제는 올바르게 풀었습니다."
      console.log(
        `${shortName} 학생은 ${answers.length}문제 중에서 ${wrongProblems.length}문제가 오답이었습니다. ${wrongText} 문제에서 실수가 있었습니다.` +
          (correctProblems.length > 0
            ? ` 그러나 ${correctText} 문제는 올바르게 풀었습니다.`
            : "")
      );
    }
  }
}
