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
}
