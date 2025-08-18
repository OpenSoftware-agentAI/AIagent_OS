export interface ExcelReaders {
  readDailyTest(): string[][];
  readTestRanges(): string[];
  readExplanations(): string[];
  readEndingComments(): string[];
  readEncouragementComments(): string[];
}

// 선택 타입들
export type DailyTestTable = string[][];
export type TestRanges = string[];
export type Explanations = string[];
export type Comments = string[];
