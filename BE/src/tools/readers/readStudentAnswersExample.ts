import fs from "fs";
import path from "path";
import { parse } from "csv-parse";

/**
 
 * 저작권 보호를 위하여 해당 파일은 주석 및 예시로 대체합니다. 
  */
export const readStudentAnswers = (
  filePath: string
): Promise<
  {
//
  }[]
> => {
  return new Promise((resolve, reject) => {
    const students: {
//
    }[] = [];

    let rowIndex = 0;

    fs.createReadStream(filePath)
      .pipe(parse({ trim: true, skip_empty_lines: true }))
      .on("data", (row: string[]) => {
        rowIndex++;

        //내용 읽어들이기
        //엑셀파일의 셀 위치에 따라 내용을 읽어들이는 코드를 작성하시면 됩니다. 

        }
      })
      .on("end", () => resolve(students))
      .on("error", (err) => reject(err));
  });
};

export const getCsvFilePath = () =>
  path.join(__dirname, "../../../uploaded file path");
