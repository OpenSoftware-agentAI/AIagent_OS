import * as path from "path";
import * as fs from "fs";
import * as Excel from "exceljs";

type StudentsInfoRowBase = {
  date: string;
  grade: string;
  class: string;
  id: string; // L{r}
  name: string;
  arrival_note: string;
  special_note: string;

  // 요약 라벨(참여도/저번 숙제)
  participation: string;
  prev_homework_completion: string;

  // 개별 체크값(행: rr = id+3) - 값이 있으면 그대로, 공백이면 공백 저장
  participation_1: string; // AA{rr} (최상)
  participation_2: string; // AB{rr} (상)
  participation_3: string; // AC{rr} (중)
  participation_4: string; // AD{rr} (하)
  participation_5: string; // AE{rr} (최하)
  participation_6: string; // AF{rr} (미참여)

  prev_homework_completion_1: string; // AH{rr} (최상)
  prev_homework_completion_2: string; // AI{rr} (상)
  prev_homework_completion_3: string; // AJ{rr} (중)
  prev_homework_completion_4: string; // AK{rr} (하)
  prev_homework_completion_5: string; // AL{rr} (최하)
  prev_homework_completion_6: string; // AM{rr} (미제출)

  this_homework: string;
  etc_note: string;
};

// 확장 필드(요청 항목)
type StudentsInfoRowExtra = {
  // 간단출제범위
  simple_range_1: string;
  simple_range_2: string;
  simple_range_3: string;
  simple_range_4: string;
  simple_range_5: string;

  // 세부출제범위
  detailed_range_1: string;
  detailed_range_2: string;
  detailed_range_3: string;
  detailed_range_4: string;
  detailed_range_5: string;

  // 교재/단원 및 수업내용
  unit1_textbook: string;
  unit1_content_1: string;
  unit1_content_2: string;
  unit1_content_3: string;
  unit2_textbook: string;
  unit2_content_1: string;
  unit2_content_2: string;
  unit2_content_3: string;

  // 기타내용 1~16
  etc_line_1: string;
  etc_line_2: string;
  etc_line_3: string;
  etc_line_4: string;
  etc_line_5: string;
  etc_line_6: string;
  etc_line_7: string;
  etc_line_8: string;
  etc_line_9: string;
  etc_line_10: string;
  etc_line_11: string;
  etc_line_12: string;
  etc_line_13: string;
  etc_line_14: string;
  etc_line_15: string;
  etc_line_16: string;
};

type StudentsInfoRow = StudentsInfoRowBase & StudentsInfoRowExtra;

export class StudentExcelTool {
  constructor(
    private readonly inputPath = path.resolve(__dirname, "../assets/data.xlsx"),
    private readonly outputPath = path.resolve(
      __dirname,
      "../assets/studentsInfo.xlsx"
    ),
    private readonly inputSheetIndexOrName: number | string = 1 // 첫 시트
  ) {}

  // 유틸: 셀 값을 문자열로 안전하게
  private cellText(sheet: Excel.Worksheet, addr: string): string {
    const v = sheet.getCell(addr).value;
    if (v == null) return "";
    if (typeof v === "object" && (v as any).text)
      return String((v as any).text).trim();
    return String(v).trim();
  }

  // 유틸: 1-based 컬럼 범위를 공백으로 이어붙임
  private joinRangeInRow(
    sheet: Excel.Worksheet,
    startCol: number,
    endCol: number,
    row: number
  ): string {
    const parts: string[] = [];
    for (let c = startCol; c <= endCol; c++) {
      const v = sheet.getRow(row).getCell(c).value;
      if (v != null && String(v).trim() !== "") parts.push(String(v).trim());
    }
    return parts.join(" ");
  }

  // 해당 행에서 값이 있는 첫 번째 헤더 라벨을 반환
  private pickLabelByHeaderPresence(
    sheet: Excel.Worksheet,
    headers: { col: number; label: string }[],
    row: number
  ): string {
    for (const h of headers) {
      const v = sheet.getRow(row).getCell(h.col).value;
      // 'O'만 인정하려면 아래 한 줄로 바꾸세요:
      // if (String(v).trim() === "O") return h.label;
      if (v != null && String(v).trim() !== "") return h.label;
    }
    return "";
  }

  // "중2 1반" / "중2-1" / "중2(1반)" 등 유연 분리 시도
  private splitGradeClass(gradeAndClass: string): {
    grade: string;
    class: string;
  } {
    const s = (gradeAndClass ?? "").trim();
    if (!s) return { grade: "", class: "" };

    // 1) 공백 기준
    const parts = s.split(/\s+/);
    if (parts.length >= 2)
      return { grade: parts[0], class: parts.slice(1).join(" ") };

    // 2) 하이픈 기준
    const hy = s.split("-");
    if (hy.length >= 2)
      return { grade: hy[0].trim(), class: hy.slice(1).join("-").trim() };

    // 3) 괄호 패턴 "중2(1반)"
    const m = s.match(/^(.+?)\((.+)\)$/);
    if (m) {
      // m=전체, m[1]=grade, m=class
      return { grade: m[1].trim(), class: m[0].trim() };
    }

    // 실패 시 전체를 grade에
    return { grade: s, class: "" };
  }

  // this_homework: E12, E13만 읽어 줄바꿈으로 연결
  private buildThisHomework(sheet: Excel.Worksheet): string {
    const l1 = this.cellText(sheet, "E12");
    const l2 = this.cellText(sheet, "E13");
    return [l1, l2].filter(Boolean).join("\n");
  }

  // 입력 파일 로드
  private async loadInputSheet(): Promise<Excel.Worksheet> {
    const wb = new Excel.Workbook();
    await wb.xlsx.readFile(this.inputPath);
    const sheet =
      typeof this.inputSheetIndexOrName === "number"
        ? wb.getWorksheet(this.inputSheetIndexOrName)
        : wb.getWorksheet(this.inputSheetIndexOrName);
    if (!sheet) {
      throw new Error(
        "입력 시트를 찾을 수 없습니다. 인덱스/이름을 확인하세요."
      );
    }
    return sheet;
  }

  // 출력 파일 준비(컬럼 전체 정의 포함)
  private async openOrCreateOutput(): Promise<{
    wb: Excel.Workbook;
    sheet: Excel.Worksheet;
  }> {
    const wb = new Excel.Workbook();
    if (fs.existsSync(this.outputPath)) {
      await wb.xlsx.readFile(this.outputPath);
    }
    let sheet = wb.getWorksheet("Students");
    if (!sheet) {
      sheet = wb.addWorksheet("Students");
      sheet.columns = [
        // 기본
        { header: "date", key: "date", width: 14 },
        { header: "grade", key: "grade", width: 10 },
        { header: "class", key: "class", width: 10 },
        { header: "id", key: "id", width: 12 },
        { header: "name", key: "name", width: 14 },
        { header: "arrival_note", key: "arrival_note", width: 30 },
        { header: "special_note", key: "special_note", width: 40 },

        // 요약 라벨
        { header: "participation", key: "participation", width: 10 },
        {
          header: "prev_homework_completion",
          key: "prev_homework_completion",
          width: 16,
        },

        // 개별 체크값(27~32, 34~39)
        { header: "participation_1", key: "participation_1", width: 10 },
        { header: "participation_2", key: "participation_2", width: 10 },
        { header: "participation_3", key: "participation_3", width: 10 },
        { header: "participation_4", key: "participation_4", width: 10 },
        { header: "participation_5", key: "participation_5", width: 10 },
        { header: "participation_6", key: "participation_6", width: 10 },
        {
          header: "prev_homework_completion_1",
          key: "prev_homework_completion_1",
          width: 12,
        },
        {
          header: "prev_homework_completion_2",
          key: "prev_homework_completion_2",
          width: 12,
        },
        {
          header: "prev_homework_completion_3",
          key: "prev_homework_completion_3",
          width: 12,
        },
        {
          header: "prev_homework_completion_4",
          key: "prev_homework_completion_4",
          width: 12,
        },
        {
          header: "prev_homework_completion_5",
          key: "prev_homework_completion_5",
          width: 12,
        },
        {
          header: "prev_homework_completion_6",
          key: "prev_homework_completion_6",
          width: 12,
        },

        // 이번 숙제/기타 메모
        { header: "this_homework", key: "this_homework", width: 40 },
        { header: "etc_note", key: "etc_note", width: 40 },

        // 간단출제범위 1~5
        { header: "simple_range_1", key: "simple_range_1", width: 30 },
        { header: "simple_range_2", key: "simple_range_2", width: 30 },
        { header: "simple_range_3", key: "simple_range_3", width: 30 },
        { header: "simple_range_4", key: "simple_range_4", width: 30 },
        { header: "simple_range_5", key: "simple_range_5", width: 30 },

        // 세부출제범위 1~5
        { header: "detailed_range_1", key: "detailed_range_1", width: 40 },
        { header: "detailed_range_2", key: "detailed_range_2", width: 40 },
        { header: "detailed_range_3", key: "detailed_range_3", width: 40 },
        { header: "detailed_range_4", key: "detailed_range_4", width: 40 },
        { header: "detailed_range_5", key: "detailed_range_5", width: 40 },

        // 1교시
        { header: "unit1_textbook", key: "unit1_textbook", width: 30 },
        { header: "unit1_content_1", key: "unit1_content_1", width: 40 },
        { header: "unit1_content_2", key: "unit1_content_2", width: 40 },
        { header: "unit1_content_3", key: "unit1_content_3", width: 40 },

        // 2교시
        { header: "unit2_textbook", key: "unit2_textbook", width: 30 },
        { header: "unit2_content_1", key: "unit2_content_1", width: 40 },
        { header: "unit2_content_2", key: "unit2_content_2", width: 40 },
        { header: "unit2_content_3", key: "unit2_content_3", width: 40 },

        // 기타내용 1~16
        { header: "etc_line_1", key: "etc_line_1", width: 40 },
        { header: "etc_line_2", key: "etc_line_2", width: 40 },
        { header: "etc_line_3", key: "etc_line_3", width: 40 },
        { header: "etc_line_4", key: "etc_line_4", width: 40 },
        { header: "etc_line_5", key: "etc_line_5", width: 40 },
        { header: "etc_line_6", key: "etc_line_6", width: 40 },
        { header: "etc_line_7", key: "etc_line_7", width: 40 },
        { header: "etc_line_8", key: "etc_line_8", width: 40 },
        { header: "etc_line_9", key: "etc_line_9", width: 40 },
        { header: "etc_line_10", key: "etc_line_10", width: 40 },
        { header: "etc_line_11", key: "etc_line_11", width: 40 },
        { header: "etc_line_12", key: "etc_line_12", width: 40 },
        { header: "etc_line_13", key: "etc_line_13", width: 40 },
        { header: "etc_line_14", key: "etc_line_14", width: 40 },
        { header: "etc_line_15", key: "etc_line_15", width: 40 },
        { header: "etc_line_16", key: "etc_line_16", width: 40 },
      ];
    }
    return { wb, sheet };
  }

  // 메인: data.xlsx → studentsInfo.xlsx
  async export(): Promise<void> {
    // 1) 입력 시트 로드
    const sheet = await this.loadInputSheet();

    // 2) 공통 헤더/상단 영역
    const date = this.joinRangeInRow(sheet, 3, 7, 1); // C1~G1
    const gradeClassRaw = this.joinRangeInRow(sheet, 8, 13, 1); // H1~M1
    const { grade, class: klass } = this.splitGradeClass(gradeClassRaw);
    const this_homework = this.buildThisHomework(sheet); // E12, E13

    // 참여도 라벨 열(AA~AF: 27~32)
    const participationHeaders = [
      { col: 27, label: "최상" },
      { col: 28, label: "상" },
      { col: 29, label: "중" },
      { col: 30, label: "하" },
      { col: 31, label: "최하" },
      { col: 32, label: "미참여" },
    ];
    // 저번 숙제 완성도(AH~AM: 34~39)
    const prevHomeworkHeaders = [
      { col: 34, label: "최상" },
      { col: 35, label: "상" },
      { col: 36, label: "중" },
      { col: 37, label: "하" },
      { col: 38, label: "최하" },
      { col: 39, label: "미제출" },
    ];

    // 새 필드(단일 셀)
    const unit1_textbook = this.cellText(sheet, "F3");
    const unit2_textbook = this.cellText(sheet, "F7");
    const unit1_content_1 = this.cellText(sheet, "F4");
    const unit1_content_2 = this.cellText(sheet, "F5");
    const unit1_content_3 = this.cellText(sheet, "F6");
    const unit2_content_1 = this.cellText(sheet, "F8");
    const unit2_content_2 = this.cellText(sheet, "F9");
    const unit2_content_3 = this.cellText(sheet, "F10");

    const simple_range_1 = this.cellText(sheet, "F15");
    const simple_range_2 = this.cellText(sheet, "F16");
    const simple_range_3 = this.cellText(sheet, "F17");
    const simple_range_4 = this.cellText(sheet, "F18");
    const simple_range_5 = this.cellText(sheet, "F19");

    const detailed_range_1 = this.cellText(sheet, "G15");
    const detailed_range_2 = this.cellText(sheet, "G16");
    const detailed_range_3 = this.cellText(sheet, "G17");
    const detailed_range_4 = this.cellText(sheet, "G18");
    const detailed_range_5 = this.cellText(sheet, "G19");

    // 기타내용 1~16
    const etc_line_1 = this.cellText(sheet, "F21");
    const etc_line_2 = this.cellText(sheet, "N21");
    const etc_line_3 = this.cellText(sheet, "V21");
    const etc_line_4 = this.cellText(sheet, "AD21");
    const etc_line_5 = this.cellText(sheet, "F22");
    const etc_line_6 = this.cellText(sheet, "N22");
    const etc_line_7 = this.cellText(sheet, "V22");
    const etc_line_8 = this.cellText(sheet, "AD22");
    const etc_line_9 = this.cellText(sheet, "F23");
    const etc_line_10 = this.cellText(sheet, "N23");
    const etc_line_11 = this.cellText(sheet, "V23");
    const etc_line_12 = this.cellText(sheet, "AD23");
    const etc_line_13 = this.cellText(sheet, "F24");
    const etc_line_14 = this.cellText(sheet, "N24");
    const etc_line_15 = this.cellText(sheet, "V24");
    const etc_line_16 = this.cellText(sheet, "AD24");

    // 3) 출력 파일 준비
    const { wb: outWb, sheet: outSheet } = await this.openOrCreateOutput();

    // 4) 학생 행 반복(M/N/O~S/AA~AF/AH~AM, r=4..19)
    for (let r = 4; r <= 19; r++) {
      const name = this.cellText(sheet, `M${r}`); // 이름
      if (!name) continue; // 이름 없으면 스킵

      const id = this.cellText(sheet, `L${r}`).trim(); // 학생 ID (L열)
      const idNum = Number(id);
      const rr = Number.isFinite(idNum) ? idNum + 3 : r; // id 기반 참조행, 실패 시 r로 대체

      const arrival_note = this.cellText(sheet, `N${r}`);
      const special_note = this.joinRangeInRow(sheet, 15, 19, r); // O(15)~S(19)

      const participation = this.pickLabelByHeaderPresence(
        sheet,
        participationHeaders,
        r
      );
      const prev_homework_completion = this.pickLabelByHeaderPresence(
        sheet,
        prevHomeworkHeaders,
        r
      );

      // 참여도 개별 체크값(AA~AF) - 값 그대로 저장, 공백이면 공백
      const participation_1 = this.cellText(sheet, `AA${rr}`);
      const participation_2 = this.cellText(sheet, `AB${rr}`);
      const participation_3 = this.cellText(sheet, `AC${rr}`);
      const participation_4 = this.cellText(sheet, `AD${rr}`);
      const participation_5 = this.cellText(sheet, `AE${rr}`);
      const participation_6 = this.cellText(sheet, `AF${rr}`);

      // 저번 숙제 완성도 개별 체크값(AH~AM) - 값 그대로 저장, 공백이면 공백
      const prev_homework_completion_1 = this.cellText(sheet, `AH${rr}`);
      const prev_homework_completion_2 = this.cellText(sheet, `AI${rr}`);
      const prev_homework_completion_3 = this.cellText(sheet, `AJ${rr}`);
      const prev_homework_completion_4 = this.cellText(sheet, `AK${rr}`);
      const prev_homework_completion_5 = this.cellText(sheet, `AL${rr}`);
      const prev_homework_completion_6 = this.cellText(sheet, `AM${rr}`);

      const row: StudentsInfoRow = {
        // 기본
        date,
        grade,
        class: klass,
        id,
        name,
        arrival_note,
        special_note,

        // 라벨 요약
        participation,
        prev_homework_completion,

        // 개별 체크값 그대로 저장(공백 허용)
        participation_1,
        participation_2,
        participation_3,
        participation_4,
        participation_5,
        participation_6,
        prev_homework_completion_1,
        prev_homework_completion_2,
        prev_homework_completion_3,
        prev_homework_completion_4,
        prev_homework_completion_5,
        prev_homework_completion_6,

        // 숙제/기타
        this_homework,
        etc_note: "",

        // 확장(출제/수업/기타)
        simple_range_1,
        simple_range_2,
        simple_range_3,
        simple_range_4,
        simple_range_5,

        detailed_range_1,
        detailed_range_2,
        detailed_range_3,
        detailed_range_4,
        detailed_range_5,

        unit1_textbook,
        unit1_content_1,
        unit1_content_2,
        unit1_content_3,

        unit2_textbook,
        unit2_content_1,
        unit2_content_2,
        unit2_content_3,

        etc_line_1,
        etc_line_2,
        etc_line_3,
        etc_line_4,
        etc_line_5,
        etc_line_6,
        etc_line_7,
        etc_line_8,
        etc_line_9,
        etc_line_10,
        etc_line_11,
        etc_line_12,
        etc_line_13,
        etc_line_14,
        etc_line_15,
        etc_line_16,
      };

      outSheet.addRow(row);

      // 긴 텍스트 wrap 적용
      const last = outSheet.lastRow;
      if (last) {
        const totalCols = outSheet.columnCount;
        for (let c = 5; c <= totalCols; c++) {
          last.getCell(c).alignment = {
            wrapText: true,
            vertical: "top",
            horizontal: "left",
          };
        }
      }
    }

    // 5) 저장
    await outWb.xlsx.writeFile(this.outputPath);
    console.log(`✅ studentsInfo.xlsx 저장 완료: ${this.outputPath}`);
  }
}
