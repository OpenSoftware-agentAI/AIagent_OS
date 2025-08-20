import * as path from "path";
import * as fs from "fs";
import * as Excel from "exceljs";

type StudentsInfoRowBase = {
  date: string;
  gradeAndClass: string;
  id: string;
  name: string;
  arrival_note: string;
  special_note: string;

  participation: string;
  prev_homework_completion: string;

  participation_1: string;
  participation_2: string;
  participation_3: string;
  participation_4: string;
  participation_5: string;
  participation_6: string;

  prev_homework_completion_1: string;
  prev_homework_completion_2: string;
  prev_homework_completion_3: string;
  prev_homework_completion_4: string;
  prev_homework_completion_5: string;
  prev_homework_completion_6: string;

  this_homework: string;
  etc_note: string;
};

type StudentsInfoRowExtra = {
  simple_range_1: string;
  simple_range_2: string;
  simple_range_3: string;
  simple_range_4: string;
  simple_range_5: string;

  detailed_range_1: string;
  detailed_range_2: string;
  detailed_range_3: string;
  detailed_range_4: string;
  detailed_range_5: string;

  unit1_textbook: string;
  unit1_content_1: string;
  unit1_content_2: string;
  unit1_content_3: string;

  unit2_textbook: string;
  unit2_content_1: string;
  unit2_content_2: string;
  unit2_content_3: string;

  etc: string;

  correct_wrong_1: string;
  correct_wrong_2: string;
  correct_wrong_3: string;
  correct_wrong_4: string;
  correct_wrong_5: string;
};

type StudentsInfoRow = StudentsInfoRowBase & StudentsInfoRowExtra;

export class StudentExcelTool {
  constructor(
    private readonly inputPath = path.resolve(__dirname, "../assets/data.xlsx"),
    private readonly outputPath = path.resolve(
      __dirname,
      "../assets/studentsInfo.xlsx"
    ),
    private readonly inputSheetIndexOrName: number | string = 1
  ) {}

  private cellText(sheet: Excel.Worksheet, addr: string): string {
    const v = sheet.getCell(addr).value;
    if (v == null) return "";
    if (typeof v === "object" && (v as any).text) {
      return String((v as any).text).trim();
    }
    return String(v).trim();
  }

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

  private pickLabelByHeaderPresence(
    sheet: Excel.Worksheet,
    headers: { col: number; label: string }[],
    row: number
  ): string {
    for (const h of headers) {
      const v = sheet.getRow(row).getCell(h.col).value;
      if (v != null && String(v).trim() !== "") return h.label;
    }
    return "";
  }

  private buildThisHomework(sheet: Excel.Worksheet): string {
    const l1 = this.cellText(sheet, "E12");
    const l2 = this.cellText(sheet, "E13");
    return [l1, l2].filter(Boolean).join("\n");
  }

  private async loadInputSheet(): Promise<Excel.Worksheet> {
    const wb = new Excel.Workbook();
    await wb.xlsx.readFile(this.inputPath);
    const sheet =
      typeof this.inputSheetIndexOrName === "number"
        ? wb.getWorksheet(this.inputSheetIndexOrName)
        : wb.getWorksheet(this.inputSheetIndexOrName);
    if (!sheet) throw new Error("입력 시트를 찾을 수 없습니다.");
    return sheet;
  }

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
        { header: "date", key: "date", width: 14 },
        { header: "gradeAndClass", key: "gradeAndClass", width: 16 },
        { header: "id", key: "id", width: 12 },
        { header: "name", key: "name", width: 14 },
        { header: "arrival_note", key: "arrival_note", width: 30 },
        { header: "special_note", key: "special_note", width: 40 },
        { header: "participation", key: "participation", width: 10 },
        {
          header: "prev_homework_completion",
          key: "prev_homework_completion",
          width: 16,
        },
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
        { header: "this_homework", key: "this_homework", width: 40 },
        { header: "etc_note", key: "etc_note", width: 40 },
        { header: "simple_range_1", key: "simple_range_1", width: 30 },
        { header: "simple_range_2", key: "simple_range_2", width: 30 },
        { header: "simple_range_3", key: "simple_range_3", width: 30 },
        { header: "simple_range_4", key: "simple_range_4", width: 30 },
        { header: "simple_range_5", key: "simple_range_5", width: 30 },
        { header: "detailed_range_1", key: "detailed_range_1", width: 40 },
        { header: "detailed_range_2", key: "detailed_range_2", width: 40 },
        { header: "detailed_range_3", key: "detailed_range_3", width: 40 },
        { header: "detailed_range_4", key: "detailed_range_4", width: 40 },
        { header: "detailed_range_5", key: "detailed_range_5", width: 40 },
        { header: "unit1_textbook", key: "unit1_textbook", width: 30 },
        { header: "unit1_content_1", key: "unit1_content_1", width: 40 },
        { header: "unit1_content_2", key: "unit1_content_2", width: 40 },
        { header: "unit1_content_3", key: "unit1_content_3", width: 40 },
        { header: "unit2_textbook", key: "unit2_textbook", width: 30 },
        { header: "unit2_content_1", key: "unit2_content_1", width: 40 },
        { header: "unit2_content_2", key: "unit2_content_2", width: 40 },
        { header: "unit2_content_3", key: "unit2_content_3", width: 40 },
        { header: "etc", key: "etc", width: 40 },
        { header: "correct_wrong_1", key: "correct_wrong_1", width: 10 },
        { header: "correct_wrong_2", key: "correct_wrong_2", width: 10 },
        { header: "correct_wrong_3", key: "correct_wrong_3", width: 10 },
        { header: "correct_wrong_4", key: "correct_wrong_4", width: 10 },
        { header: "correct_wrong_5", key: "correct_wrong_5", width: 10 },
      ];
    }
    return { wb, sheet };
  }

  async export(): Promise<void> {
    const sheet = await this.loadInputSheet();

    const date = this.cellText(sheet, "C1");
    const gradeAndClass = this.cellText(sheet, "H1");
    const this_homework = this.buildThisHomework(sheet);

    const participationHeaders = [
      { col: 27, label: "최상" },
      { col: 28, label: "상" },
      { col: 29, label: "중" },
      { col: 30, label: "하" },
      { col: 31, label: "최하" },
      { col: 32, label: "미참여" },
    ];
    const prevHomeworkHeaders = [
      { col: 34, label: "최상" },
      { col: 35, label: "상" },
      { col: 36, label: "중" },
      { col: 37, label: "하" },
      { col: 38, label: "최하" },
      { col: 39, label: "미제출" },
    ];

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

    const etcLineValues: string[] = [
      this.cellText(sheet, "F21"),
      this.cellText(sheet, "N21"),
      this.cellText(sheet, "V21"),
      this.cellText(sheet, "AD21"),
      this.cellText(sheet, "F22"),
      this.cellText(sheet, "N22"),
      this.cellText(sheet, "V22"),
      this.cellText(sheet, "AD22"),
      this.cellText(sheet, "F23"),
      this.cellText(sheet, "N23"),
      this.cellText(sheet, "V23"),
      this.cellText(sheet, "AD23"),
      this.cellText(sheet, "F24"),
      this.cellText(sheet, "N24"),
      this.cellText(sheet, "V24"),
      this.cellText(sheet, "AD24"),
    ];

    const { wb: outWb, sheet: outSheet } = await this.openOrCreateOutput();

    for (let r = 4; r <= 19; r++) {
      const name = this.cellText(sheet, `M${r}`);
      if (!name) continue;

      const id = this.cellText(sheet, `L${r}`).trim();
      const idNum = Number(id);
      const rr = Number.isFinite(idNum) ? idNum + 3 : r;

      const arrival_note = this.cellText(sheet, `N${r}`);
      const special_note = this.joinRangeInRow(sheet, 15, 19, r);

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

      const participation_1 = this.cellText(sheet, `AA${rr}`);
      const participation_2 = this.cellText(sheet, `AB${rr}`);
      const participation_3 = this.cellText(sheet, `AC${rr}`);
      const participation_4 = this.cellText(sheet, `AD${rr}`);
      const participation_5 = this.cellText(sheet, `AE${rr}`);
      const participation_6 = this.cellText(sheet, `AF${rr}`);

      const prev_homework_completion_1 = this.cellText(sheet, `AH${rr}`);
      const prev_homework_completion_2 = this.cellText(sheet, `AI${rr}`);
      const prev_homework_completion_3 = this.cellText(sheet, `AJ${rr}`);
      const prev_homework_completion_4 = this.cellText(sheet, `AK${rr}`);
      const prev_homework_completion_5 = this.cellText(sheet, `AL${rr}`);
      const prev_homework_completion_6 = this.cellText(sheet, `AM${rr}`);

      // ✅ 정오 기록 (U~Y 열)
      const correct_wrong_1 = this.cellText(sheet, `U${r}`);
      const correct_wrong_2 = this.cellText(sheet, `V${r}`);
      const correct_wrong_3 = this.cellText(sheet, `W${r}`);
      const correct_wrong_4 = this.cellText(sheet, `X${r}`);
      const correct_wrong_5 = this.cellText(sheet, `Y${r}`);

      const studentIndex = r - 3;
      const etc = etcLineValues[studentIndex - 1] || "";

      const row: StudentsInfoRow = {
        date,
        gradeAndClass,
        id,
        name,
        arrival_note,
        special_note,
        participation,
        prev_homework_completion,
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
        this_homework,
        etc_note: "",
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
        etc,
        correct_wrong_1,
        correct_wrong_2,
        correct_wrong_3,
        correct_wrong_4,
        correct_wrong_5,
      };

      outSheet.addRow(row);

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

    await outWb.xlsx.writeFile(this.outputPath);
    console.log(`✅ studentsInfo.xlsx 저장 완료: ${this.outputPath}`);
  }
}
