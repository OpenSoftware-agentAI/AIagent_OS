"use strict";
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
exports.dlrRouter = void 0;
const express_1 = require("express");
exports.dlrRouter = (0, express_1.Router)();
/**
 * POST /callbacks/dlr - SOLAPI 배달 결과 수신
 */
exports.dlrRouter.post('/callbacks/dlr', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('DLR 수신:', JSON.stringify(req.body, null, 2));
        // TODO: 데이터베이스에 배달 결과 저장
        // const reports = Array.isArray(req.body) ? req.body : [req.body];
        // for (const report of reports) {
        //   await saveDlrResult(report);
        // }
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('DLR 처리 오류:', error);
        res.status(500).json({ success: false });
    }
}));
