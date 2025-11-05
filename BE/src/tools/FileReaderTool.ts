import * as fs from "fs";
import * as path from "path";
import * as xlsx from "xlsx";
import { parse as csvParse } from "csv-parse/sync";

const pdfParse = require("pdf-parse");

interface ReadFileRequest {
  filename: string;
}

interface ExcelCellRequest {
  filename: string;
  sheetName?: string;
  cellAddress?: string;
}

export class FileReaderTool {
  /**
   * 파일의 내용을 읽어서 텍스트로 반환합니다.
   * @param request - 파일 읽기 요청 객체
   * @returns 파일 내용을 문자열로 반환
   */
  public async readFile(request: ReadFileRequest): Promise<string> {
    const { filename } = request;

    if (!filename || typeof filename !== "string") {
      return "오류: 올바른 파일명을 제공해주세요.";
    }

    try {
      const filePath = path.join(__dirname, "../../uploads", filename);

      if (!fs.existsSync(filePath)) {
        return `오류: 파일 '${filename}'을 찾을 수 없습니다.`;
      }

      const fileExtension = path.extname(filename).toLowerCase();

      console.log(`📖 파일 읽기 시작: ${filename} (확장자: ${fileExtension})`);

      switch (fileExtension) {
        case ".pdf":
          return await this.readPDF(filePath);
        case ".xlsx":
        case ".xls":
          return await this.readExcel(filePath);
        case ".csv":
          return await this.readCSV(filePath);
        case ".txt":
          return this.readTextFile(filePath);
        default:
          return `지원하지 않는 파일 형식입니다: ${fileExtension}`;
      }
    } catch (error) {
      console.error("❌ 파일 읽기 오류:", error);
      return `파일 읽기 중 오류가 발생했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`;
    }
  }

  /**
   * 특정 Excel 시트의 특정 셀 값을 가져옵니다.
   * @param request - Excel 셀 조회 요청 객체
   * @returns 셀 값 또는 시트 데이터
   */
  public getExcelCellValue(request: ExcelCellRequest): string {
    const { filename, sheetName = "", cellAddress = "" } = request;

    if (!filename || typeof filename !== "string") {
      return "오류: 올바른 파일명을 제공해주세요.";
    }

    try {
      const filePath = path.join(__dirname, "../../uploads", filename);

      if (!fs.existsSync(filePath)) {
        return `오류: 파일 '${filename}'을 찾을 수 없습니다.`;
      }

      const workbook = xlsx.readFile(filePath);
      const targetSheet = sheetName || workbook.SheetNames[0];
      const worksheet = workbook.Sheets[targetSheet];

      if (!worksheet) {
        return `오류: 시트 '${targetSheet}'를 찾을 수 없습니다.`;
      }

      if (cellAddress) {
        const cell = worksheet[cellAddress];
        const value = cell ? cell.v : "(빈 셀)";
        return `셀 ${cellAddress}의 값: ${value}`;
      } else {
        // 셀 주소가 없으면 전체 시트 정보를 반환
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const displayRows = jsonData.slice(0, 5); // 처음 5행만 표시

        let result = `시트 '${targetSheet}'의 데이터 (처음 5행):\n`;
        displayRows.forEach((row: any, index: number) => {
          result += `${index + 1}행: ${JSON.stringify(row)}\n`;
        });

        if (jsonData.length > 5) {
          result += `... (총 ${jsonData.length}행)`;
        }

        return result;
      }
    } catch (error) {
      console.error("❌ Excel 셀 값 조회 실패:", error);
      return `셀 값 조회 중 오류: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`;
    }
  }

  private async readPDF(filePath: string): Promise<string> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      return `=== PDF 파일 내용 ===
파일 경로: ${filePath}
페이지 수: ${pdfData.numpages}

텍스트 내용:
${pdfData.text}

=== PDF 분석 완료 ===`;
    } catch (error) {
      console.error("❌ PDF 읽기 실패:", error);
      return `PDF 파일 읽기에 실패했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`;
    }
  }

  private async readExcel(filePath: string): Promise<string> {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetNames = workbook.SheetNames;

      let content = `=== Excel 파일 내용 ===\n`;
      content += `파일 경로: ${filePath}\n`;
      content += `시트 수: ${sheetNames.length}\n`;
      content += `시트 이름들: ${sheetNames.join(", ")}\n\n`;

      for (const sheetName of sheetNames) {
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

        content += `--- 시트: ${sheetName} ---\n`;
        content += `행 수: ${jsonData.length}\n`;

        const displayRows = jsonData.slice(0, 5); // 처음 5행만 표시
        content += `데이터 (처음 5행):\n`;

        displayRows.forEach((row: any, index: number) => {
          content += `${index + 1}행: ${JSON.stringify(row)}\n`;
        });

        if (jsonData.length > 5) {
          content += `... (총 ${jsonData.length}행 중 처음 5행만 표시)\n`;
        }
        content += "\n";
      }

      content += `=== Excel 분석 완료 ===`;

      console.log(`✅ Excel 읽기 완료: ${sheetNames.length}개 시트`);
      return content;
    } catch (error) {
      console.error("❌ Excel 읽기 실패:", error);
      return `Excel 파일 읽기에 실패했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`;
    }
  }

  private async readCSV(filePath: string): Promise<string> {
    try {
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const records = csvParse(fileContent, {
        skip_empty_lines: true,
        trim: true,
      });

      let content = `=== CSV 파일 내용 ===\n`;
      content += `파일 경로: ${filePath}\n`;
      content += `행 수: ${records.length}\n`;
      content += `열 수: ${records.length > 0 ? records[0].length : 0}\n\n`;

      const displayRows = records.slice(0, 5); // 처음 5행만 표시
      content += `데이터 (처음 5행):\n`;

      displayRows.forEach((row: any, index: number) => {
        content += `${index + 1}행: ${JSON.stringify(row)}\n`;
      });

      if (records.length > 5) {
        content += `... (총 ${records.length}행 중 처음 5행만 표시)\n`;
      }

      content += `\n=== CSV 분석 완료 ===`;

      console.log(`✅ CSV 읽기 완료: ${records.length}행`);
      return content;
    } catch (error) {
      console.error("❌ CSV 읽기 실패:", error);
      return `CSV 파일 읽기에 실패했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`;
    }
  }

  private readTextFile(filePath: string): string {
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return `=== 텍스트 파일 내용 ===\n파일 경로: ${filePath}\n\n${content}\n\n=== 텍스트 파일 끝 ===`;
    } catch (error) {
      console.error("❌ 텍스트 파일 읽기 실패:", error);
      return `텍스트 파일 읽기에 실패했습니다: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`;
    }
  }
}
