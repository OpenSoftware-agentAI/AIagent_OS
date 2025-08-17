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
const xlsx = __importStar(require("xlsx"));
const path = __importStar(require("path"));
// 엑셀 파일 경로
const filePath = path.join(__dirname, "data.xlsm");
// 엑셀 파일 읽기
const workbook = xlsx.readFile(filePath);
// 첫 번째 시트 가져오기
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
// 범위 지정: A3~F9 (예상되는 표 범위)
const range = xlsx.utils.sheet_to_json(worksheet, {
    range: "T3:Y9", // 정확한 범위는 시트 구조에 따라 조정
    header: 1, // 첫 행을 헤더로 가져옴
});
// 결과 출력
console.log("데일리 테스트 결과:");
console.log(range);
