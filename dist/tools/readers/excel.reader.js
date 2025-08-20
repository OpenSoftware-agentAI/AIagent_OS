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
exports.ExcelFileReader = void 0;
const xlsx = __importStar(require("xlsx"));
const fs = __importStar(require("fs"));
const excel_paths_1 = require("./excel.paths");
function sheetToJson(range, sheetIndex = 0) {
    const workbook = xlsx.readFile(excel_paths_1.ASSET_PATHS.data);
    const sheetName = workbook.SheetNames[sheetIndex];
    const worksheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(worksheet, {
        range,
        header: 1,
    });
}
function readLines(filePath) {
    try {
        const file = fs.readFileSync(filePath, "utf-8");
        return file
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
    }
    catch (_a) {
        return [];
    }
}
exports.ExcelFileReader = {
    readDailyTest() {
        return sheetToJson("T3:Y9", 0);
    },
    readTestRanges() {
        const raw = sheetToJson("G15:J19", 0);
        const flat = raw
            .flat()
            .map((v) => String(v)
            .replace(/[\r\n]+/g, " ")
            .trim())
            .filter((v) => v.length > 0);
        return Array.from(new Set(flat));
    },
    readExplanations() {
        return readLines(excel_paths_1.ASSET_PATHS.explanation);
    },
    readEndingComments() {
        return readLines(excel_paths_1.ASSET_PATHS.endingComment);
    },
    readEncouragementComments() {
        return readLines(excel_paths_1.ASSET_PATHS.encouragements);
    },
};
