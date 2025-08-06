import * as xlsx from "xlsx";
import * as path from "path";

// 엑셀 파일 경로
const filePath = path.join(__dirname, "data.xlsm");

// 엑셀 파일 읽기
const workbook = xlsx.readFile(filePath);

// 첫 번째 시트 가져오기
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// 범위 지정: A3~F9 (예상되는 표 범위)
const range = xlsx.utils.sheet_to_json(worksheet, {
  range: "T3:Y9", // 정확한 범위는 시트 구조에 따라 조정
  header: 1, // 첫 행을 헤더로 가져옴
});

// 결과 출력
console.log("데일리 테스트 결과:");
console.log(range);
