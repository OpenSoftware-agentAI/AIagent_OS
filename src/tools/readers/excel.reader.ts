import * as xlsx from "xlsx";
import * as fs from "fs";
import { ASSET_PATHS } from "./excel.paths";
import { ExcelReaders } from "./excel.types";

function sheetToJson(range: string, sheetIndex = 0): string[][] {
  const workbook = xlsx.readFile(ASSET_PATHS.data);
  const sheetName = workbook.SheetNames[sheetIndex];
  const worksheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(worksheet, {
    range,
    header: 1,
  }) as string[][];
}

function readLines(filePath: string): string[] {
  try {
    const file = fs.readFileSync(filePath, "utf-8");
    return file
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export const ExcelFileReader: ExcelReaders = {
  readDailyTest(): string[][] {
    return sheetToJson("T3:Y9", 0);
  },
  readTestRanges(): string[] {
    const raw = sheetToJson("G15:K19", 0);
    const flat = raw
      .flat()
      .map((v) =>
        String(v)
          .replace(/[\r\n]+/g, " ")
          .trim()
      )
      .filter((v) => v.length > 0);
    return Array.from(new Set(flat));
  },
  readExplanations(): string[] {
    return readLines(ASSET_PATHS.explanation);
  },
  readEndingComments(): string[] {
    return readLines(ASSET_PATHS.endingComment);
  },
  readEncouragementComments(): string[] {
    return readLines(ASSET_PATHS.encouragements);
  },
};
