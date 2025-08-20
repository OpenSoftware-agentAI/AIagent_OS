"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelTool = void 0;
const excel_reader_1 = require("./readers/excel.reader");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const Excel = __importStar(require("exceljs"));
const child_process_1 = require("child_process");
class ExcelTool {
    constructor(readers = excel_reader_1.ExcelFileReader) {
        this.readers = readers;
    }
    pickRandom(list) {
        if (!list.length)
            return "";
        return list[Math.floor(Math.random() * list.length)];
    }
    printFeedbacks() {
        const data = this.readers.readDailyTest();
        const explanations = this.readers.readExplanations();
        const endingComments = this.readers.readEndingComments();
        const encouragementComments = this.readers.readEncouragementComments();
        const testRanges = this.readers.readTestRanges();
        const outputLines = [];
        if (data.length === 0) {
            const msg = "엑셀 데이터가 비어있습니다.";
            console.log(msg);
            outputLines.push(msg);
        }
        const totalProblems = data[0].length - 1;
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const fullName = row[0];
            const shortName = fullName.length > 1 ? fullName.slice(1) : fullName;
            const answers = row.slice(1);
            const noShowCount = answers.filter((a) => a === "미응시").length;
            const randomEnding = this.pickRandom(endingComments);
            const randomEncouragement = this.pickRandom(encouragementComments);
            let output = "";
            const wrongProblems = [];
            const correctProblems = [];
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
                }
                else if (ans === "O") {
                    correctProblems.push({ num: idx + 1, desc });
                }
            });
            if (testRanges.length > 0) {
                output += `오늘 데일리테스트는 ${testRanges.join(", ")} 범위 내에서 출제되었습니다. `;
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
            }
            else {
                output += `${shortName} 학생은 오늘 데일리테스트를 어려워했습니다. ${wrongText} 에서 실수가 있었습니다.`;
                if (correctProblems.length > 0) {
                    output += ` 그러나 ${correctText} 는 올바르게 풀었습니다.`;
                }
                output += ` ${randomEncouragement}`;
            }
            console.log(output);
            outputLines.push(output);
        }
        const assetsDir = path.resolve(__dirname, "../assets");
        if (!fs.existsSync(assetsDir)) {
            fs.mkdirSync(assetsDir, { recursive: true });
        }
        const filePath = path.join(assetsDir, "finalComment.txt");
        fs.writeFileSync(filePath, outputLines.join("\n\n"), "utf-8");
        console.log(`📄 최종 피드백이 ${filePath} 에 저장되었습니다.`);
    }
    insertFeedback() {
        return __awaiter(this, void 0, void 0, function* () {
            const filePath = path.resolve(__dirname, "../assets/finalComment.txt");
            const rawText = fs.readFileSync(filePath, "utf-8");
            const paragraphs = rawText
                .split(/\n{2,}/)
                .map((p) => p.trim())
                .filter(Boolean);
            const excelPath = path.resolve(__dirname, "../assets/data.xlsx");
            const workbook = new Excel.Workbook();
            yield workbook.xlsx.readFile(excelPath);
            const worksheet = workbook.getWorksheet("데일리 작성");
            if (!worksheet) {
                throw new Error("❌ '데일리 작성' 시트를 찾을 수 없습니다.");
            }
            const cellRefs = [
                "F21",
                "N21",
                "V21",
                "AD21",
                "F22",
                "N22",
                "V22",
                "AD22",
                "F23",
                "N23",
                "V23",
                "AD23",
                "F24",
                "N24",
                "V24",
                "AD24",
            ];
            paragraphs.forEach((txt, idx) => {
                if (idx >= cellRefs.length)
                    return;
                const cell = worksheet.getCell(cellRefs[idx]);
                cell.value = txt;
                cell.alignment = { wrapText: true, vertical: "top", horizontal: "left" };
            });
            yield workbook.xlsx.writeFile(excelPath);
            console.log("✅ ../assets/data.xlsx : '데일리 작성' 시트에 피드백 입력 완료 (양식 유지)");
        });
    }
    runNodeScript() {
        const process = (0, child_process_1.exec)("node src/index.js", (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ 실행 오류 발생: ${error.message}`);
                return;
            }
            if (stderr) {
                console.error(`⚠️ stderr: ${stderr}`);
            }
            console.log(`📢 실행 결과:\n${stdout}`);
        });
    }
}
exports.ExcelTool = ExcelTool;
