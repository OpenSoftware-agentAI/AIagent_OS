import * as xlsx from "xlsx";
import * as path from "path";

export class ExcelTool {
  private filePath: string;

  constructor() {
    this.filePath = path.join(__dirname, "../data.xlsm"); // 경로 조정
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

  printWrongCounts(): void {
    const data = this.readDailyTest();

    // 헤더는 첫 행, 이후부터 학생별 데이터
    const header = data[0];
    const totalProblems = header.length - 1; // 문제 개수 (이름 제외)

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const name = row[0];
      const answers = row.slice(1);

      // 각 행에서 "X" 개수 세기
      const wrongCount = answers.filter((a) => a === "X").length;

      console.log(`${name} : 틀린 문제 개수는 ${wrongCount}개 입니다.`);
    }
  }
}
