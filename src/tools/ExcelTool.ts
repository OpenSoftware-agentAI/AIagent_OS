import { ExcelReaders } from "./readers/excel.types";
import { ExcelFileReader } from "./readers/excel.reader";

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
      const randomEnding = this.pickRandom(endingComments);
      const randomEncouragement = this.pickRandom(encouragementComments);

      let output = "";

      const wrongProblems: { num: number; desc: string }[] = [];
      const correctProblems: { num: number; desc: string }[] = [];

      if (noShowCount > 0) {
        output += `${shortName} 학생은 시험에 미응시하였습니다.`;
        console.log(output);
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
    }
  }
}
