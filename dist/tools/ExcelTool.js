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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExcelTool = void 0;
const xlsx = __importStar(require("xlsx"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class ExcelTool {
    constructor() {
        this.filePath = path.join(__dirname, "../assets/data.xlsm");
        this.explanationPath = path.join(__dirname, "../assets/explanation.txt");
        this.endingCommentPath = path.join(__dirname, "../assets/endingComment.txt");
        this.encouragementsPath = path.join(__dirname, "../assets/encouragementsComment.txt");
    }
    /**
     * 엑셀 파일의 T3:Y9 범위(예시)를 읽어서 반환합니다.
     */
    readDailyTest() {
        const workbook = xlsx.readFile(this.filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, {
            range: "T3:Y9",
            header: 1,
        });
        return data;
    }
    readTestRanges() {
        const workbook = xlsx.readFile(this.filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, {
            range: "G15:K19",
            header: 1,
        });
        const flat = data
            .flat()
            .map((v) => String(v)
            .replace(/[\r\n]+/g, " ")
            .trim())
            .filter((v) => v.length > 0);
        const uniqueRanges = Array.from(new Set(flat));
        return uniqueRanges;
    }
    readExplanations() {
        try {
            const file = fs.readFileSync(this.explanationPath, "utf-8");
            return file
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        }
        catch (error) {
            console.warn("explanation.txt 파일을 읽는 도중 오류 발생:", error);
            return [];
        }
    }
    readEndingComments() {
        try {
            const file = fs.readFileSync(this.endingCommentPath, "utf-8");
            return file
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        }
        catch (error) {
            console.warn("endingComment.txt 파일을 읽는 중 오류 발생:", error);
            return [];
        }
    }
    getRandomEndingComment(comments) {
        if (comments.length === 0)
            return "";
        const randomIndex = Math.floor(Math.random() * comments.length);
        return comments[randomIndex];
    }
    readEncouragementComments() {
        try {
            const file = fs.readFileSync(this.encouragementsPath, "utf-8");
            return file
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.length > 0);
        }
        catch (error) {
            console.warn("encouragementsComment.txt 파일을 읽는 중 오류 발생:", error);
            return [];
        }
    }
    getRandomEncouragementComment(comments) {
        if (comments.length === 0)
            return "";
        const randomIndex = Math.floor(Math.random() * comments.length);
        return comments[randomIndex];
    }
    printFeedbacks() {
        const data = this.readDailyTest();
        const explanations = this.readExplanations();
        const endingComments = this.readEndingComments();
        const encouragementComments = this.readEncouragementComments();
        const testRanges = this.readTestRanges();
        if (data.length === 0) {
            console.log("엑셀 데이터가 비어있습니다.");
            return;
        }
        const totalProblems = data[0].length - 1;
        for (let i = 1; i < data.length; i++) {
            const row = data[i];
            const fullName = row[0];
            const shortName = fullName.length > 1 ? fullName.slice(1) : fullName;
            const answers = row.slice(1);
            const noShowCount = answers.filter((a) => a === "미응시").length;
            const randomEnding = this.getRandomEndingComment(endingComments);
            const randomEncouragement = this.getRandomEncouragementComment(encouragementComments);
            if (noShowCount > 0) {
                console.log(`${shortName} 학생은 시험에 미응시하였습니다.`);
                continue;
            }
            const wrongProblems = [];
            const correctProblems = [];
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
            let output = "";
            if (testRanges.length > 0) {
                output += `오늘 데일리테스트는 ${testRanges.join(", ")} 범위 내에서 출제되었습니다. `;
            }
            // 오답 없는 경우
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
            // 오답이 있는 경우
            const wrongText = wrongProblems
                .map((p) => `${p.desc}(${p.num}번)`)
                .join(", ");
            const correctText = correctProblems
                .map((p) => `${p.desc}(${p.num}번)`)
                .join(", ");
            // 1, 2개 문제 틀린 경우
            if (wrongProblems.length <= 3) {
                output += `${shortName} 학생은 ${totalProblems}문제 중에서 ${wrongProblems.length}문제가 오답이었습니다. ${wrongText} 에서 실수가 있었습니다.`;
                if (correctProblems.length > 0) {
                    output += ` 그러나 ${correctText} 는 올바르게 풀었습니다.`;
                }
                output += ` ${randomEnding}`;
            }
            // 3개 이상(과반수 이상) 틀린 경우
            else {
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
exports.ExcelTool = ExcelTool;
