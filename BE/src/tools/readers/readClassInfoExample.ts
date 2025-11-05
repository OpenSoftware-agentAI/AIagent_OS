import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

/**
 
 * 저작권 보호를 위하여 해당 파일은 주석 및 예시로 대체합니다. 
  */

export const readClassInfo = (
  filePath: string
): Promise<{
  //
}> => {
  return new Promise((resolve, reject) => {
    const rows: string[][] = [];

    fs.createReadStream(filePath)
      .pipe(parse({ trim: true, skip_empty_lines: true }))
      .on("data", (row: string[]) => rows.push(row))
      .on("end", () => {
        const getRange = (
          startRow: number,
          endRow: number,
          startCol: number,
          endCol: number
        ) =>
          rows
            .slice(startRow - 1, endRow)
            .flatMap((r) => r.slice(startCol - 1, endCol))
            .filter((cell) => cell.trim() !== "");

            /**
             * 데이터가 저장된 셀 위치에 따라 내용을 읽어오는 코드를 작성하시면 됩니다. 
             */



        resolve({
          //

        });
      })
      .on("error", (err) => reject(err));
  });
};

export const getCsvFilePath = () =>
  path.join(__dirname, "../../../uploaded file path");
