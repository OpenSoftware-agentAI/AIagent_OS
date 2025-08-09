import * as xlsx from "xlsx";
import * as path from "path";
import * as fs from "fs";

export class ExcelTool {
  private filePath: string;
  private explanationPath: string;
  private endingCommentPath: string;

  constructor() {
    this.filePath = path.join(__dirname, "../data.xlsm");
    this.explanationPath = path.join(__dirname, "../explanation.txt");
    this.endingCommentPath = path.join(__dirname, "../endingComment.txt");
  }

  /**
   * 엑셀 파일의 T3:Y9 범위(예시)를 읽어서 반환합니다.
   */
  readDailyTest(): string[][] {
    const workbook = xlsx.readFile(this.filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet, {
      range: "T3:Y9",
      header: 1,
    }) as string[][];

    return data;
  }

  /**
   * explanation.txt 파일의 각 줄을 문제 설명으로 읽어 배열로 반환
   */
  readExplanations(): string[] {
    try {
      const file = fs.readFileSync(this.explanationPath, "utf-8");
      return file
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } catch (error) {
      console.warn("explanation.txt 파일을 읽는 도중 오류 발생:", error);
      return [];
    }
  }

  /**
   * endingComment.txt 파일을 읽어서 여러 줄(마무리 멘트) 배열로 반환
   */
  readEndingComments(): string[] {
    try {
      const file = fs.readFileSync(this.endingCommentPath, "utf-8");
      return file
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
    } catch (error) {
      console.warn("endingComment.txt 파일을 읽는 중 오류 발생:", error);
      return [];
    }
  }

  /**
   * 랜덤으로 마무리 멘트 한 개를 선택해 반환
   */
  private getRandomEndingComment(comments: string[]): string {
    if (comments.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * comments.length);
    return comments[randomIndex];
  }

  /**
   * 학생별 시험 결과를 바탕으로 틀린 문제에 대해 문제 설명 포함 피드백 생성 및 출력
   * 각 학생 피드백 끝에 랜덤 마무리 멘트 덧붙임
   */
  printFeedbacks(): void {
    const data = this.readDailyTest();
    const explanations = this.readExplanations();
    const endingComments = this.readEndingComments();

    if (data.length === 0) {
      console.log("엑셀 데이터가 비어있습니다.");
      return;
    }

    const totalProblems = data[0].length - 1;

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const fullName: string = row[0];
      const shortName = fullName.length > 1 ? fullName.slice(1) : fullName;
      const answers = row.slice(1);

      const noShowCount = answers.filter((a) => a === "미응시").length;
      const randomEnding = this.getRandomEndingComment(endingComments);

      if (noShowCount > 0) {
        console.log(
          `${shortName} 학생은 시험에 미응시하였습니다.${
            randomEnding ? " " + randomEnding : ""
          }`
        );
        continue;
      }

      const wrongProblems: { num: number; desc: string }[] = [];
      const correctProblems: { num: number; desc: string }[] = [];

      answers.forEach((ans, idx) => {
        let desc = explanations[idx] || `${idx + 1}번 문제`;
        desc = desc.replace(/^\d+\.\s*/, ""); // 번호 제거 예: "1. 문제내용" → "문제내용"

        if (ans === "X") {
          wrongProblems.push({ num: idx + 1, desc });
        } else if (ans === "O") {
          correctProblems.push({ num: idx + 1, desc });
        }
      });

      // 오답 문제 피드백 출력
      const wrongText = wrongProblems
        .map((p) => `${p.desc}(${p.num}번)`)
        .join(", ");

      const correctText = correctProblems
        .map((p) => `${p.desc}(${p.num}번)`)
        .join(", ");

      if (wrongProblems.length === 0) {
        const correctText = correctProblems
          .map((p) => `${p.desc}(${p.num}번)`)
          .join(", ");

        let output = `${shortName} 학생은 모든 문제를 맞췄습니다.`;

        if (correctText.length > 0) {
          output += ` ${correctText} 를 모두 올바르게 풀었습니다.`;
        }

        if (randomEnding) {
          output += ` ${randomEnding}`;
        }

        console.log(output);
        continue;
      }

      let output = `${shortName} 학생은 ${totalProblems}문제 중에서 ${wrongProblems.length}문제가 오답이었습니다. ${wrongText} 에서 실수가 있었습니다.`;

      if (correctProblems.length > 0) {
        output += ` 그러나 ${correctText} 는 올바르게 풀었습니다.`;
      }

      if (randomEnding) {
        output += ` ${randomEnding}`;
      }

      console.log(output);
    }
  }

  /**
   * 확인용: 문제 설명 리스트 출력
   */
  testPrintExplanations(): void {
    const explanations = this.readExplanations();
    console.log("=== 문제 설명 리스트 ===");
    explanations.forEach((desc, idx) => {
      console.log(`${idx + 1}번 문제: ${desc}`);
    });
  }
}
