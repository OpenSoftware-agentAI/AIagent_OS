import { ExcelReaders } from "./readers/excel.types";
import { ExcelFileReader } from "./readers/excel.reader";
import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";

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

    // 결과 누적 배열
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

  writeFeedbacks() {
    const txtPath = path.resolve(process.cwd(), "src/assets/finalComment.txt");
    if (!fs.existsSync(txtPath)) {
      throw new Error(
        "⚠️ finalComment.txt 파일이 없습니다. 먼저 ExcelTool.printFeedbacks() 실행 필요"
      );
    }

    // 1) 텍스트 로드 및 문단 분리
    const rawText = fs.readFileSync(txtPath, "utf-8");
    const feedbacks = rawText
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // 2) 셀 범위
    const cellRanges = [
      ["F21", "K21"],
      ["N21", "S21"],
      ["V21", "AA21"],
      ["AD21", "AI21"],
      ["F22", "K22"],
      ["N22", "S22"],
      ["V22", "AA22"],
      ["AD22", "AI22"],
      ["F23", "K23"],
      ["N23", "S23"],
      ["V23", "AA23"],
      ["AD23", "AI23"],
      ["F24", "K24"],
      ["N24", "S24"],
      ["V24", "AA24"],
      ["AD24", "AI24"],
    ];

    // 3) 기존 템플릿 엑셀 로드 (덮어쓰지 말고 열기)
    const outDir = path.resolve(process.cwd(), "src/assets");
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const outPath = path.join(outDir, "data.xlsm");
    if (!fs.existsSync(outPath)) {
      throw new Error(
        "⚠️ src/assets/data.xlsm 템플릿 파일이 없습니다. 템플릿을 먼저 준비하세요."
      );
    }

    // 기존 파일 열기 (양식/서식 유지)
    const workbook = XLSX.readFile(outPath, {
      bookVBA: true, // VBA(매크로) 포함한 통합문서 읽기
      cellStyles: true, // 가능한 스타일 유지
    });

    // 4) 대상 시트 선택 (시트명이 "피드백"이 아니면 실제 템플릿 시트명으로 교체)
    const sheetName = "피드백"; // ← 템플릿에 입력할 정확한 시트명으로 바꾸세요
    const worksheet = workbook.Sheets[sheetName];
    if (!worksheet) {
      throw new Error(
        `⚠️ 템플릿에 "${sheetName}" 시트를 찾을 수 없습니다. 시트명을 확인하세요.`
      );
    }

    // 5) 기존 시트에 값만 채우기 (양식/서식/수식은 손대지 않음)
    feedbacks.forEach((p, idx) => {
      if (idx >= cellRanges.length) return;
      const [startCell, endCell] = cellRanges[idx];

      // 값 기록 (셀 새로 생성 또는 기존 셀에 대입)
      worksheet[startCell] = { v: p, t: "s" };

      // 병합이 템플릿에 이미 잡혀 있다면 아래는 생략 가능
      // 템플릿에 병합이 없다면 필요한 병합만 추가
      if (!worksheet["!merges"]) worksheet["!merges"] = [];
      const range = XLSX.utils.decode_range(`${startCell}:${endCell}`);
      // 중복 병합 방지: 동일 범위가 이미 있으면 추가하지 않음
      const exists = worksheet["!merges"].some(
        (m) =>
          m.s.r === range.s.r &&
          m.s.c === range.s.c &&
          m.e.r === range.e.r &&
          m.e.c === range.e.c
      );
      if (!exists) worksheet["!merges"].push(range);
    });

    // 시트 범위는 템플릿 것을 그대로 쓰는 것이 안전하지만,
    // 필요 시 최소 범위만 업데이트 (없으면 Excel에서 몇 셀만 보일 수 있음)
    // worksheet["!ref"] = worksheet["!ref"] ?? "A1:AI30";

    // 6) 같은 파일로 저장 (양식/매크로 유지)
    XLSX.writeFile(workbook, outPath, {
      bookType: "xlsm",
      bookSST: true,
      compression: true,
    });

    return `✅ ${outPath} 에 텍스트만 반영(양식 유지) 완료!`;
  }
}
