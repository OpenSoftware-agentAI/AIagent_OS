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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __typia_transform__validateReport = __importStar(require("typia/lib/internal/_validateReport.js"));
// src/app/routes/kakaoChatbot.routes.ts
const express_1 = require("express");
// AgenticaHistory와 함께, 필요한 구체적인 History 타입들을 임포트합니다.
// AgenticaHistory.d.ts에 정의된 모든 타입을 가져와야 합니다.
const core_1 = require("@agentica/core");
const openai_1 = require("openai");
const ExcelTool_1 = require("../../tools/ExcelTool"); // 경로 조정
const SmsTool_1 = require("../../tools/SmsTool"); // 새로 추가한 도구
const typia_1 = __importDefault(require("typia"));
// Agentica 인스턴스 (main.ts와 동일하게 설정)
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const agent = new core_1.Agentica({
    model: "chatgpt",
    vendor: {
        model: "gpt-4o-mini", // main.ts와 동일한 모델
        api: openai,
    },
    controllers: [
        {
            name: "Excel Tool",
            protocol: "class",
            application: {
                model: "chatgpt",
                options: {
                    reference: true,
                    strict: false,
                    separate: null
                },
                functions: [
                    {
                        name: "readDailyTest",
                        parameters: {
                            type: "object",
                            properties: {},
                            additionalProperties: false,
                            required: [],
                            $defs: {}
                        },
                        output: {
                            type: "array",
                            items: {
                                type: "array",
                                items: {
                                    type: "string"
                                }
                            }
                        },
                        description: "\uC5D1\uC140 \uD30C\uC77C\uC758 T3:Y9 \uBC94\uC704(\uC608\uC2DC)\uB97C \uC77D\uC5B4\uC11C \uBC18\uD658\uD569\uB2C8\uB2E4.",
                        validate: (() => { const __is = input => true; let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => true)(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "readTestRanges",
                        parameters: {
                            type: "object",
                            properties: {},
                            additionalProperties: false,
                            required: [],
                            $defs: {}
                        },
                        output: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        validate: (() => { const __is = input => true; let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => true)(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "readExplanations",
                        parameters: {
                            type: "object",
                            properties: {},
                            additionalProperties: false,
                            required: [],
                            $defs: {}
                        },
                        output: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        validate: (() => { const __is = input => true; let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => true)(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "readEndingComments",
                        parameters: {
                            type: "object",
                            properties: {},
                            additionalProperties: false,
                            required: [],
                            $defs: {}
                        },
                        output: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        validate: (() => { const __is = input => true; let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => true)(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "readEncouragementComments",
                        parameters: {
                            type: "object",
                            properties: {},
                            additionalProperties: false,
                            required: [],
                            $defs: {}
                        },
                        output: {
                            type: "array",
                            items: {
                                type: "string"
                            }
                        },
                        validate: (() => { const __is = input => true; let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => true)(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "printFeedbacks",
                        parameters: {
                            type: "object",
                            properties: {},
                            additionalProperties: false,
                            required: [],
                            $defs: {}
                        },
                        validate: (() => { const __is = input => true; let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => true)(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    }
                ]
            },
            execute: new ExcelTool_1.ExcelTool(),
        },
        {
            name: "Sms Tool",
            protocol: "class",
            application: {
                model: "chatgpt",
                options: {
                    reference: true,
                    strict: false,
                    separate: null
                },
                functions: [
                    {
                        name: "sendSms",
                        parameters: {
                            type: "object",
                            properties: {
                                to: {
                                    type: "string"
                                },
                                text: {
                                    type: "string"
                                },
                                isAdvertisement: {
                                    type: "boolean"
                                },
                                allowNightSend: {
                                    type: "boolean"
                                }
                            },
                            required: [
                                "to",
                                "text"
                            ],
                            additionalProperties: false,
                            $defs: {
                                DetailGroupMessageResponse: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uC2DC \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130\n\n### Description of {@link groupInfo} property:\n\n> \uBC1C\uC1A1 \uC815\uBCF4(\uC131\uACF5, \uC2E4\uD328 \uB4F1) \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        failedMessageList: {
                                            description: "\uBA54\uC2DC\uC9C0 \uBC1C\uC1A1 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uC694\uCCAD \uBAA9\uB85D\uB4E4",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/FailedMessage"
                                            }
                                        },
                                        groupInfo: {
                                            $ref: "#/$defs/GroupMessageResponse"
                                        },
                                        messageList: {
                                            description: "Send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC showMessageList \uAC12\uC774 true\uB85C \uB418\uC5B4\uC788\uC744 \uB54C \uD45C\uC2DC\uB418\uB294 \uBA54\uC2DC\uC9C0 \uBAA9\uB85D",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/MessageResponseItem"
                                            }
                                        }
                                    },
                                    required: [
                                        "failedMessageList",
                                        "groupInfo"
                                    ]
                                },
                                FailedMessage: {
                                    description: "\uBA54\uC2DC\uC9C0 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uAC1D\uCCB4",
                                    type: "object",
                                    properties: {
                                        to: {
                                            type: "string"
                                        },
                                        from: {
                                            type: "string"
                                        },
                                        type: {
                                            type: "string"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        },
                                        country: {
                                            type: "string"
                                        },
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        }
                                    },
                                    required: [
                                        "to",
                                        "from",
                                        "type",
                                        "statusMessage",
                                        "country",
                                        "messageId",
                                        "statusCode",
                                        "accountId"
                                    ]
                                },
                                Recordstringstring: {
                                    description: "Construct a type with a set of properties K of type T",
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "string"
                                    }
                                },
                                GroupMessageResponse: {
                                    type: "object",
                                    properties: {
                                        count: {
                                            $ref: "#/$defs/Count"
                                        },
                                        countForCharge: {
                                            $ref: "#/$defs/CountForCharge"
                                        },
                                        balance: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        point: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        app: {
                                            $ref: "#/$defs/App"
                                        },
                                        log: {
                                            $ref: "#/$defs/Log"
                                        },
                                        status: {
                                            type: "string"
                                        },
                                        allowDuplicates: {
                                            type: "boolean"
                                        },
                                        isRefunded: {
                                            type: "boolean"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        masterAccountId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        },
                                        apiVersion: {
                                            type: "string"
                                        },
                                        groupId: {
                                            type: "string"
                                        },
                                        price: {
                                            $ref: "#/$defs/object"
                                        },
                                        dateCreated: {
                                            type: "string"
                                        },
                                        dateUpdated: {
                                            type: "string"
                                        },
                                        scheduledDate: {
                                            type: "string"
                                        },
                                        dateSent: {
                                            type: "string"
                                        },
                                        dateCompleted: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "count",
                                        "countForCharge",
                                        "balance",
                                        "point",
                                        "app",
                                        "log",
                                        "status",
                                        "allowDuplicates",
                                        "isRefunded",
                                        "accountId",
                                        "masterAccountId",
                                        "apiVersion",
                                        "groupId",
                                        "price",
                                        "dateCreated",
                                        "dateUpdated"
                                    ]
                                },
                                Count: {
                                    type: "object",
                                    properties: {
                                        total: {
                                            type: "number"
                                        },
                                        sentTotal: {
                                            type: "number"
                                        },
                                        sentFailed: {
                                            type: "number"
                                        },
                                        sentSuccess: {
                                            type: "number"
                                        },
                                        sentPending: {
                                            type: "number"
                                        },
                                        sentReplacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        registeredFailed: {
                                            type: "number"
                                        },
                                        registeredSuccess: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "total",
                                        "sentTotal",
                                        "sentFailed",
                                        "sentSuccess",
                                        "sentPending",
                                        "sentReplacement",
                                        "refund",
                                        "registeredFailed",
                                        "registeredSuccess"
                                    ]
                                },
                                CountForCharge: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        ata: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cta: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cti: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        nsa: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_tpl: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                CountryChargeStatus: {
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "number"
                                    }
                                },
                                CommonCashResponse: {
                                    type: "object",
                                    properties: {
                                        requested: {
                                            type: "number"
                                        },
                                        replacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        sum: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "requested",
                                        "replacement",
                                        "refund",
                                        "sum"
                                    ]
                                },
                                App: {
                                    type: "object",
                                    properties: {
                                        profit: {
                                            $ref: "#/$defs/MessageTypeRecord"
                                        },
                                        appId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        }
                                    },
                                    required: [
                                        "profit"
                                    ]
                                },
                                MessageTypeRecord: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            type: "number"
                                        },
                                        lms: {
                                            type: "number"
                                        },
                                        mms: {
                                            type: "number"
                                        },
                                        ata: {
                                            type: "number"
                                        },
                                        cta: {
                                            type: "number"
                                        },
                                        cti: {
                                            type: "number"
                                        },
                                        nsa: {
                                            type: "number"
                                        },
                                        rcs_sms: {
                                            type: "number"
                                        },
                                        rcs_lms: {
                                            type: "number"
                                        },
                                        rcs_mms: {
                                            type: "number"
                                        },
                                        rcs_tpl: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                Log: {
                                    type: "array",
                                    items: {
                                        $ref: "#/$defs/object"
                                    }
                                },
                                object: {
                                    type: "object",
                                    properties: {},
                                    required: []
                                },
                                MessageResponseItem: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC\uC5D0 showMessageList \uAC12\uC744 true\uB85C \uB123\uC5B4\uC11C \uC694\uCCAD\uD588\uC744 \uACBD\uC6B0 \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "messageId",
                                        "statusCode",
                                        "statusMessage"
                                    ]
                                }
                            }
                        },
                        output: {
                            description: "\uC804\uC1A1 \uACB0\uACFC",
                            anyOf: [
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                originalResponse: {
                                                    $ref: "#/$defs/DetailGroupMessageResponse"
                                                },
                                                groupId: {},
                                                messageCount: {},
                                                accountId: {},
                                                success: {
                                                    type: "boolean"
                                                }
                                            },
                                            required: [
                                                "originalResponse",
                                                "groupId",
                                                "messageCount",
                                                "accountId",
                                                "success"
                                            ]
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message",
                                        "data"
                                    ]
                                },
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message"
                                    ]
                                }
                            ]
                        },
                        description: "\uB2E8\uC77C SMS \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0C5\uB2C8\uB2E4. (90\uBC14\uC774\uD2B8 \uC774\uD558, \uD55C\uAE00 45\uC790 \uC774\uD558)",
                        validate: (() => { const _io0 = input => "string" === typeof input.to && "string" === typeof input.text && (undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement) && (undefined === input.allowNightSend || "boolean" === typeof input.allowNightSend); const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.to || _report(_exceptionable, {
                                path: _path + ".to",
                                expected: "string",
                                value: input.to
                            }), "string" === typeof input.text || _report(_exceptionable, {
                                path: _path + ".text",
                                expected: "string",
                                value: input.text
                            }), undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement || _report(_exceptionable, {
                                path: _path + ".isAdvertisement",
                                expected: "(boolean | undefined)",
                                value: input.isAdvertisement
                            }), undefined === input.allowNightSend || "boolean" === typeof input.allowNightSend || _report(_exceptionable, {
                                path: _path + ".allowNightSend",
                                expected: "(boolean | undefined)",
                                value: input.allowNightSend
                            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                })) && _vo0(input, _path + "", true) || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                }))(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "sendLms",
                        parameters: {
                            type: "object",
                            properties: {
                                to: {
                                    type: "string"
                                },
                                text: {
                                    type: "string"
                                },
                                subject: {
                                    type: "string"
                                },
                                isAdvertisement: {
                                    type: "boolean"
                                },
                                allowNightSend: {
                                    type: "boolean"
                                }
                            },
                            required: [
                                "to",
                                "text"
                            ],
                            additionalProperties: false,
                            $defs: {
                                DetailGroupMessageResponse: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uC2DC \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130\n\n### Description of {@link groupInfo} property:\n\n> \uBC1C\uC1A1 \uC815\uBCF4(\uC131\uACF5, \uC2E4\uD328 \uB4F1) \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        failedMessageList: {
                                            description: "\uBA54\uC2DC\uC9C0 \uBC1C\uC1A1 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uC694\uCCAD \uBAA9\uB85D\uB4E4",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/FailedMessage"
                                            }
                                        },
                                        groupInfo: {
                                            $ref: "#/$defs/GroupMessageResponse"
                                        },
                                        messageList: {
                                            description: "Send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC showMessageList \uAC12\uC774 true\uB85C \uB418\uC5B4\uC788\uC744 \uB54C \uD45C\uC2DC\uB418\uB294 \uBA54\uC2DC\uC9C0 \uBAA9\uB85D",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/MessageResponseItem"
                                            }
                                        }
                                    },
                                    required: [
                                        "failedMessageList",
                                        "groupInfo"
                                    ]
                                },
                                FailedMessage: {
                                    description: "\uBA54\uC2DC\uC9C0 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uAC1D\uCCB4",
                                    type: "object",
                                    properties: {
                                        to: {
                                            type: "string"
                                        },
                                        from: {
                                            type: "string"
                                        },
                                        type: {
                                            type: "string"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        },
                                        country: {
                                            type: "string"
                                        },
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        }
                                    },
                                    required: [
                                        "to",
                                        "from",
                                        "type",
                                        "statusMessage",
                                        "country",
                                        "messageId",
                                        "statusCode",
                                        "accountId"
                                    ]
                                },
                                Recordstringstring: {
                                    description: "Construct a type with a set of properties K of type T",
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "string"
                                    }
                                },
                                GroupMessageResponse: {
                                    type: "object",
                                    properties: {
                                        count: {
                                            $ref: "#/$defs/Count"
                                        },
                                        countForCharge: {
                                            $ref: "#/$defs/CountForCharge"
                                        },
                                        balance: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        point: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        app: {
                                            $ref: "#/$defs/App"
                                        },
                                        log: {
                                            $ref: "#/$defs/Log"
                                        },
                                        status: {
                                            type: "string"
                                        },
                                        allowDuplicates: {
                                            type: "boolean"
                                        },
                                        isRefunded: {
                                            type: "boolean"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        masterAccountId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        },
                                        apiVersion: {
                                            type: "string"
                                        },
                                        groupId: {
                                            type: "string"
                                        },
                                        price: {
                                            $ref: "#/$defs/object"
                                        },
                                        dateCreated: {
                                            type: "string"
                                        },
                                        dateUpdated: {
                                            type: "string"
                                        },
                                        scheduledDate: {
                                            type: "string"
                                        },
                                        dateSent: {
                                            type: "string"
                                        },
                                        dateCompleted: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "count",
                                        "countForCharge",
                                        "balance",
                                        "point",
                                        "app",
                                        "log",
                                        "status",
                                        "allowDuplicates",
                                        "isRefunded",
                                        "accountId",
                                        "masterAccountId",
                                        "apiVersion",
                                        "groupId",
                                        "price",
                                        "dateCreated",
                                        "dateUpdated"
                                    ]
                                },
                                Count: {
                                    type: "object",
                                    properties: {
                                        total: {
                                            type: "number"
                                        },
                                        sentTotal: {
                                            type: "number"
                                        },
                                        sentFailed: {
                                            type: "number"
                                        },
                                        sentSuccess: {
                                            type: "number"
                                        },
                                        sentPending: {
                                            type: "number"
                                        },
                                        sentReplacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        registeredFailed: {
                                            type: "number"
                                        },
                                        registeredSuccess: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "total",
                                        "sentTotal",
                                        "sentFailed",
                                        "sentSuccess",
                                        "sentPending",
                                        "sentReplacement",
                                        "refund",
                                        "registeredFailed",
                                        "registeredSuccess"
                                    ]
                                },
                                CountForCharge: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        ata: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cta: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cti: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        nsa: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_tpl: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                CountryChargeStatus: {
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "number"
                                    }
                                },
                                CommonCashResponse: {
                                    type: "object",
                                    properties: {
                                        requested: {
                                            type: "number"
                                        },
                                        replacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        sum: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "requested",
                                        "replacement",
                                        "refund",
                                        "sum"
                                    ]
                                },
                                App: {
                                    type: "object",
                                    properties: {
                                        profit: {
                                            $ref: "#/$defs/MessageTypeRecord"
                                        },
                                        appId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        }
                                    },
                                    required: [
                                        "profit"
                                    ]
                                },
                                MessageTypeRecord: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            type: "number"
                                        },
                                        lms: {
                                            type: "number"
                                        },
                                        mms: {
                                            type: "number"
                                        },
                                        ata: {
                                            type: "number"
                                        },
                                        cta: {
                                            type: "number"
                                        },
                                        cti: {
                                            type: "number"
                                        },
                                        nsa: {
                                            type: "number"
                                        },
                                        rcs_sms: {
                                            type: "number"
                                        },
                                        rcs_lms: {
                                            type: "number"
                                        },
                                        rcs_mms: {
                                            type: "number"
                                        },
                                        rcs_tpl: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                Log: {
                                    type: "array",
                                    items: {
                                        $ref: "#/$defs/object"
                                    }
                                },
                                object: {
                                    type: "object",
                                    properties: {},
                                    required: []
                                },
                                MessageResponseItem: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC\uC5D0 showMessageList \uAC12\uC744 true\uB85C \uB123\uC5B4\uC11C \uC694\uCCAD\uD588\uC744 \uACBD\uC6B0 \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "messageId",
                                        "statusCode",
                                        "statusMessage"
                                    ]
                                }
                            }
                        },
                        output: {
                            description: "\uC804\uC1A1 \uACB0\uACFC",
                            anyOf: [
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                originalResponse: {
                                                    $ref: "#/$defs/DetailGroupMessageResponse"
                                                },
                                                groupId: {},
                                                messageCount: {},
                                                accountId: {},
                                                success: {
                                                    type: "boolean"
                                                }
                                            },
                                            required: [
                                                "originalResponse",
                                                "groupId",
                                                "messageCount",
                                                "accountId",
                                                "success"
                                            ]
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message",
                                        "data"
                                    ]
                                },
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message"
                                    ]
                                }
                            ]
                        },
                        description: "LMS(\uC7A5\uBB38 \uBA54\uC2DC\uC9C0)\uB97C \uBCF4\uB0C5\uB2C8\uB2E4. (2000\uBC14\uC774\uD2B8 \uC774\uD558, \uD55C\uAE00 1000\uC790 \uC774\uD558)",
                        validate: (() => { const _io0 = input => "string" === typeof input.to && "string" === typeof input.text && (undefined === input.subject || "string" === typeof input.subject) && (undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement) && (undefined === input.allowNightSend || "boolean" === typeof input.allowNightSend); const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.to || _report(_exceptionable, {
                                path: _path + ".to",
                                expected: "string",
                                value: input.to
                            }), "string" === typeof input.text || _report(_exceptionable, {
                                path: _path + ".text",
                                expected: "string",
                                value: input.text
                            }), undefined === input.subject || "string" === typeof input.subject || _report(_exceptionable, {
                                path: _path + ".subject",
                                expected: "(string | undefined)",
                                value: input.subject
                            }), undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement || _report(_exceptionable, {
                                path: _path + ".isAdvertisement",
                                expected: "(boolean | undefined)",
                                value: input.isAdvertisement
                            }), undefined === input.allowNightSend || "boolean" === typeof input.allowNightSend || _report(_exceptionable, {
                                path: _path + ".allowNightSend",
                                expected: "(boolean | undefined)",
                                value: input.allowNightSend
                            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                })) && _vo0(input, _path + "", true) || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                }))(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "sendImageMessage",
                        parameters: {
                            type: "object",
                            properties: {
                                to: {
                                    type: "string"
                                },
                                text: {
                                    type: "string"
                                },
                                imageFilePath: {
                                    type: "string"
                                },
                                subject: {
                                    type: "string"
                                },
                                isAdvertisement: {
                                    type: "boolean"
                                },
                                allowNightSend: {
                                    type: "boolean"
                                }
                            },
                            required: [
                                "to",
                                "text",
                                "imageFilePath"
                            ],
                            additionalProperties: false,
                            $defs: {
                                DetailGroupMessageResponse: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uC2DC \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130\n\n### Description of {@link groupInfo} property:\n\n> \uBC1C\uC1A1 \uC815\uBCF4(\uC131\uACF5, \uC2E4\uD328 \uB4F1) \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        failedMessageList: {
                                            description: "\uBA54\uC2DC\uC9C0 \uBC1C\uC1A1 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uC694\uCCAD \uBAA9\uB85D\uB4E4",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/FailedMessage"
                                            }
                                        },
                                        groupInfo: {
                                            $ref: "#/$defs/GroupMessageResponse"
                                        },
                                        messageList: {
                                            description: "Send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC showMessageList \uAC12\uC774 true\uB85C \uB418\uC5B4\uC788\uC744 \uB54C \uD45C\uC2DC\uB418\uB294 \uBA54\uC2DC\uC9C0 \uBAA9\uB85D",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/MessageResponseItem"
                                            }
                                        }
                                    },
                                    required: [
                                        "failedMessageList",
                                        "groupInfo"
                                    ]
                                },
                                FailedMessage: {
                                    description: "\uBA54\uC2DC\uC9C0 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uAC1D\uCCB4",
                                    type: "object",
                                    properties: {
                                        to: {
                                            type: "string"
                                        },
                                        from: {
                                            type: "string"
                                        },
                                        type: {
                                            type: "string"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        },
                                        country: {
                                            type: "string"
                                        },
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        }
                                    },
                                    required: [
                                        "to",
                                        "from",
                                        "type",
                                        "statusMessage",
                                        "country",
                                        "messageId",
                                        "statusCode",
                                        "accountId"
                                    ]
                                },
                                Recordstringstring: {
                                    description: "Construct a type with a set of properties K of type T",
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "string"
                                    }
                                },
                                GroupMessageResponse: {
                                    type: "object",
                                    properties: {
                                        count: {
                                            $ref: "#/$defs/Count"
                                        },
                                        countForCharge: {
                                            $ref: "#/$defs/CountForCharge"
                                        },
                                        balance: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        point: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        app: {
                                            $ref: "#/$defs/App"
                                        },
                                        log: {
                                            $ref: "#/$defs/Log"
                                        },
                                        status: {
                                            type: "string"
                                        },
                                        allowDuplicates: {
                                            type: "boolean"
                                        },
                                        isRefunded: {
                                            type: "boolean"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        masterAccountId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        },
                                        apiVersion: {
                                            type: "string"
                                        },
                                        groupId: {
                                            type: "string"
                                        },
                                        price: {
                                            $ref: "#/$defs/object"
                                        },
                                        dateCreated: {
                                            type: "string"
                                        },
                                        dateUpdated: {
                                            type: "string"
                                        },
                                        scheduledDate: {
                                            type: "string"
                                        },
                                        dateSent: {
                                            type: "string"
                                        },
                                        dateCompleted: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "count",
                                        "countForCharge",
                                        "balance",
                                        "point",
                                        "app",
                                        "log",
                                        "status",
                                        "allowDuplicates",
                                        "isRefunded",
                                        "accountId",
                                        "masterAccountId",
                                        "apiVersion",
                                        "groupId",
                                        "price",
                                        "dateCreated",
                                        "dateUpdated"
                                    ]
                                },
                                Count: {
                                    type: "object",
                                    properties: {
                                        total: {
                                            type: "number"
                                        },
                                        sentTotal: {
                                            type: "number"
                                        },
                                        sentFailed: {
                                            type: "number"
                                        },
                                        sentSuccess: {
                                            type: "number"
                                        },
                                        sentPending: {
                                            type: "number"
                                        },
                                        sentReplacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        registeredFailed: {
                                            type: "number"
                                        },
                                        registeredSuccess: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "total",
                                        "sentTotal",
                                        "sentFailed",
                                        "sentSuccess",
                                        "sentPending",
                                        "sentReplacement",
                                        "refund",
                                        "registeredFailed",
                                        "registeredSuccess"
                                    ]
                                },
                                CountForCharge: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        ata: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cta: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cti: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        nsa: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_tpl: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                CountryChargeStatus: {
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "number"
                                    }
                                },
                                CommonCashResponse: {
                                    type: "object",
                                    properties: {
                                        requested: {
                                            type: "number"
                                        },
                                        replacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        sum: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "requested",
                                        "replacement",
                                        "refund",
                                        "sum"
                                    ]
                                },
                                App: {
                                    type: "object",
                                    properties: {
                                        profit: {
                                            $ref: "#/$defs/MessageTypeRecord"
                                        },
                                        appId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        }
                                    },
                                    required: [
                                        "profit"
                                    ]
                                },
                                MessageTypeRecord: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            type: "number"
                                        },
                                        lms: {
                                            type: "number"
                                        },
                                        mms: {
                                            type: "number"
                                        },
                                        ata: {
                                            type: "number"
                                        },
                                        cta: {
                                            type: "number"
                                        },
                                        cti: {
                                            type: "number"
                                        },
                                        nsa: {
                                            type: "number"
                                        },
                                        rcs_sms: {
                                            type: "number"
                                        },
                                        rcs_lms: {
                                            type: "number"
                                        },
                                        rcs_mms: {
                                            type: "number"
                                        },
                                        rcs_tpl: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                Log: {
                                    type: "array",
                                    items: {
                                        $ref: "#/$defs/object"
                                    }
                                },
                                object: {
                                    type: "object",
                                    properties: {},
                                    required: []
                                },
                                MessageResponseItem: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC\uC5D0 showMessageList \uAC12\uC744 true\uB85C \uB123\uC5B4\uC11C \uC694\uCCAD\uD588\uC744 \uACBD\uC6B0 \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "messageId",
                                        "statusCode",
                                        "statusMessage"
                                    ]
                                }
                            }
                        },
                        output: {
                            anyOf: [
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                result: {
                                                    $ref: "#/$defs/DetailGroupMessageResponse"
                                                },
                                                failureReasons: {
                                                    type: "array",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            to: {
                                                                type: "string"
                                                            },
                                                            statusCode: {
                                                                type: "string"
                                                            },
                                                            statusMessage: {
                                                                type: "string"
                                                            },
                                                            messageId: {
                                                                type: "string"
                                                            }
                                                        },
                                                        required: [
                                                            "to",
                                                            "statusCode",
                                                            "statusMessage",
                                                            "messageId"
                                                        ]
                                                    }
                                                }
                                            },
                                            required: [
                                                "result",
                                                "failureReasons"
                                            ]
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message",
                                        "data"
                                    ]
                                },
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        },
                                        data: {
                                            $ref: "#/$defs/DetailGroupMessageResponse"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message",
                                        "data"
                                    ]
                                },
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message"
                                    ]
                                }
                            ]
                        },
                        description: "\uC774\uBBF8\uC9C0\uC640 \uD568\uAED8 \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0C5\uB2C8\uB2E4 (MMS) - SOLAPI \uC5C5\uB85C\uB4DC \uBC29\uC2DD \uC0AC\uC6A9\n\uC774\uBBF8\uC9C0\uC640 \uD14D\uC2A4\uD2B8\uB97C \uD568\uAED8\uBCF4\uB0B4\uC57C \uC131\uACF5\uC801\uC73C\uB85C \uBA54\uC138\uC9C0\uAC00 \uC804\uC1A1\uB429\uB2C8\uB2E4.",
                        validate: (() => { const _io0 = input => "string" === typeof input.to && "string" === typeof input.text && "string" === typeof input.imageFilePath && (undefined === input.subject || "string" === typeof input.subject) && (undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement) && (undefined === input.allowNightSend || "boolean" === typeof input.allowNightSend); const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.to || _report(_exceptionable, {
                                path: _path + ".to",
                                expected: "string",
                                value: input.to
                            }), "string" === typeof input.text || _report(_exceptionable, {
                                path: _path + ".text",
                                expected: "string",
                                value: input.text
                            }), "string" === typeof input.imageFilePath || _report(_exceptionable, {
                                path: _path + ".imageFilePath",
                                expected: "string",
                                value: input.imageFilePath
                            }), undefined === input.subject || "string" === typeof input.subject || _report(_exceptionable, {
                                path: _path + ".subject",
                                expected: "(string | undefined)",
                                value: input.subject
                            }), undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement || _report(_exceptionable, {
                                path: _path + ".isAdvertisement",
                                expected: "(boolean | undefined)",
                                value: input.isAdvertisement
                            }), undefined === input.allowNightSend || "boolean" === typeof input.allowNightSend || _report(_exceptionable, {
                                path: _path + ".allowNightSend",
                                expected: "(boolean | undefined)",
                                value: input.allowNightSend
                            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                })) && _vo0(input, _path + "", true) || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                }))(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "sendBulkMessage",
                        parameters: {
                            type: "object",
                            properties: {
                                recipients: {
                                    type: "array",
                                    items: {
                                        type: "string"
                                    }
                                },
                                text: {
                                    type: "string"
                                },
                                subject: {
                                    type: "string"
                                },
                                imageFilePath: {
                                    type: "string"
                                },
                                isAdvertisement: {
                                    type: "boolean"
                                },
                                allowNightSend: {
                                    type: "boolean"
                                }
                            },
                            required: [
                                "recipients",
                                "text"
                            ],
                            additionalProperties: false,
                            $defs: {
                                DetailGroupMessageResponse: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uC2DC \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130\n\n### Description of {@link groupInfo} property:\n\n> \uBC1C\uC1A1 \uC815\uBCF4(\uC131\uACF5, \uC2E4\uD328 \uB4F1) \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        failedMessageList: {
                                            description: "\uBA54\uC2DC\uC9C0 \uBC1C\uC1A1 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uC694\uCCAD \uBAA9\uB85D\uB4E4",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/FailedMessage"
                                            }
                                        },
                                        groupInfo: {
                                            $ref: "#/$defs/GroupMessageResponse"
                                        },
                                        messageList: {
                                            description: "Send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC showMessageList \uAC12\uC774 true\uB85C \uB418\uC5B4\uC788\uC744 \uB54C \uD45C\uC2DC\uB418\uB294 \uBA54\uC2DC\uC9C0 \uBAA9\uB85D",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/MessageResponseItem"
                                            }
                                        }
                                    },
                                    required: [
                                        "failedMessageList",
                                        "groupInfo"
                                    ]
                                },
                                FailedMessage: {
                                    description: "\uBA54\uC2DC\uC9C0 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uAC1D\uCCB4",
                                    type: "object",
                                    properties: {
                                        to: {
                                            type: "string"
                                        },
                                        from: {
                                            type: "string"
                                        },
                                        type: {
                                            type: "string"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        },
                                        country: {
                                            type: "string"
                                        },
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        }
                                    },
                                    required: [
                                        "to",
                                        "from",
                                        "type",
                                        "statusMessage",
                                        "country",
                                        "messageId",
                                        "statusCode",
                                        "accountId"
                                    ]
                                },
                                Recordstringstring: {
                                    description: "Construct a type with a set of properties K of type T",
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "string"
                                    }
                                },
                                GroupMessageResponse: {
                                    type: "object",
                                    properties: {
                                        count: {
                                            $ref: "#/$defs/Count"
                                        },
                                        countForCharge: {
                                            $ref: "#/$defs/CountForCharge"
                                        },
                                        balance: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        point: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        app: {
                                            $ref: "#/$defs/App"
                                        },
                                        log: {
                                            $ref: "#/$defs/Log"
                                        },
                                        status: {
                                            type: "string"
                                        },
                                        allowDuplicates: {
                                            type: "boolean"
                                        },
                                        isRefunded: {
                                            type: "boolean"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        masterAccountId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        },
                                        apiVersion: {
                                            type: "string"
                                        },
                                        groupId: {
                                            type: "string"
                                        },
                                        price: {
                                            $ref: "#/$defs/object"
                                        },
                                        dateCreated: {
                                            type: "string"
                                        },
                                        dateUpdated: {
                                            type: "string"
                                        },
                                        scheduledDate: {
                                            type: "string"
                                        },
                                        dateSent: {
                                            type: "string"
                                        },
                                        dateCompleted: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "count",
                                        "countForCharge",
                                        "balance",
                                        "point",
                                        "app",
                                        "log",
                                        "status",
                                        "allowDuplicates",
                                        "isRefunded",
                                        "accountId",
                                        "masterAccountId",
                                        "apiVersion",
                                        "groupId",
                                        "price",
                                        "dateCreated",
                                        "dateUpdated"
                                    ]
                                },
                                Count: {
                                    type: "object",
                                    properties: {
                                        total: {
                                            type: "number"
                                        },
                                        sentTotal: {
                                            type: "number"
                                        },
                                        sentFailed: {
                                            type: "number"
                                        },
                                        sentSuccess: {
                                            type: "number"
                                        },
                                        sentPending: {
                                            type: "number"
                                        },
                                        sentReplacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        registeredFailed: {
                                            type: "number"
                                        },
                                        registeredSuccess: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "total",
                                        "sentTotal",
                                        "sentFailed",
                                        "sentSuccess",
                                        "sentPending",
                                        "sentReplacement",
                                        "refund",
                                        "registeredFailed",
                                        "registeredSuccess"
                                    ]
                                },
                                CountForCharge: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        ata: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cta: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cti: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        nsa: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_tpl: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                CountryChargeStatus: {
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "number"
                                    }
                                },
                                CommonCashResponse: {
                                    type: "object",
                                    properties: {
                                        requested: {
                                            type: "number"
                                        },
                                        replacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        sum: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "requested",
                                        "replacement",
                                        "refund",
                                        "sum"
                                    ]
                                },
                                App: {
                                    type: "object",
                                    properties: {
                                        profit: {
                                            $ref: "#/$defs/MessageTypeRecord"
                                        },
                                        appId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        }
                                    },
                                    required: [
                                        "profit"
                                    ]
                                },
                                MessageTypeRecord: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            type: "number"
                                        },
                                        lms: {
                                            type: "number"
                                        },
                                        mms: {
                                            type: "number"
                                        },
                                        ata: {
                                            type: "number"
                                        },
                                        cta: {
                                            type: "number"
                                        },
                                        cti: {
                                            type: "number"
                                        },
                                        nsa: {
                                            type: "number"
                                        },
                                        rcs_sms: {
                                            type: "number"
                                        },
                                        rcs_lms: {
                                            type: "number"
                                        },
                                        rcs_mms: {
                                            type: "number"
                                        },
                                        rcs_tpl: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                Log: {
                                    type: "array",
                                    items: {
                                        $ref: "#/$defs/object"
                                    }
                                },
                                object: {
                                    type: "object",
                                    properties: {},
                                    required: []
                                },
                                MessageResponseItem: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC\uC5D0 showMessageList \uAC12\uC744 true\uB85C \uB123\uC5B4\uC11C \uC694\uCCAD\uD588\uC744 \uACBD\uC6B0 \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "messageId",
                                        "statusCode",
                                        "statusMessage"
                                    ]
                                }
                            }
                        },
                        output: {
                            description: "\uC804\uC1A1 \uACB0\uACFC",
                            anyOf: [
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                results: {
                                                    type: "array",
                                                    items: {
                                                        anyOf: [
                                                            {
                                                                type: "object",
                                                                properties: {
                                                                    to: {
                                                                        type: "string"
                                                                    },
                                                                    success: {
                                                                        type: "boolean"
                                                                    },
                                                                    error: {}
                                                                },
                                                                required: [
                                                                    "to",
                                                                    "success",
                                                                    "error"
                                                                ]
                                                            },
                                                            {
                                                                type: "object",
                                                                properties: {
                                                                    to: {
                                                                        type: "string"
                                                                    },
                                                                    success: {
                                                                        type: "boolean"
                                                                    },
                                                                    result: {
                                                                        anyOf: [
                                                                            {
                                                                                type: "object",
                                                                                properties: {
                                                                                    originalResponse: {
                                                                                        $ref: "#/$defs/DetailGroupMessageResponse"
                                                                                    },
                                                                                    groupId: {},
                                                                                    messageCount: {},
                                                                                    accountId: {},
                                                                                    success: {
                                                                                        type: "boolean"
                                                                                    }
                                                                                },
                                                                                required: [
                                                                                    "originalResponse",
                                                                                    "groupId",
                                                                                    "messageCount",
                                                                                    "accountId",
                                                                                    "success"
                                                                                ]
                                                                            },
                                                                            {
                                                                                $ref: "#/$defs/DetailGroupMessageResponse"
                                                                            }
                                                                        ]
                                                                    }
                                                                },
                                                                required: [
                                                                    "to",
                                                                    "success",
                                                                    "result"
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                },
                                                successCount: {
                                                    type: "number"
                                                },
                                                failCount: {
                                                    type: "number"
                                                },
                                                totalCount: {
                                                    type: "number"
                                                }
                                            },
                                            required: [
                                                "results",
                                                "successCount",
                                                "failCount",
                                                "totalCount"
                                            ]
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message",
                                        "data"
                                    ]
                                },
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message"
                                    ]
                                }
                            ]
                        },
                        description: "\uC5EC\uB7EC \uC218\uC2E0\uC790\uC5D0\uAC8C \uB3D9\uC77C\uD55C \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0C5\uB2C8\uB2E4 (\uB2E4\uC911 \uBC1C\uC1A1, 1~2\uBA85 \uAD8C\uC7A5)",
                        validate: (() => { const _io0 = input => Array.isArray(input.recipients) && input.recipients.every(elem => "string" === typeof elem) && "string" === typeof input.text && (undefined === input.subject || "string" === typeof input.subject) && (undefined === input.imageFilePath || "string" === typeof input.imageFilePath) && (undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement) && (undefined === input.allowNightSend || "boolean" === typeof input.allowNightSend); const _vo0 = (input, _path, _exceptionable = true) => [(Array.isArray(input.recipients) || _report(_exceptionable, {
                                path: _path + ".recipients",
                                expected: "Array<string>",
                                value: input.recipients
                            })) && input.recipients.map((elem, _index2) => "string" === typeof elem || _report(_exceptionable, {
                                path: _path + ".recipients[" + _index2 + "]",
                                expected: "string",
                                value: elem
                            })).every(flag => flag) || _report(_exceptionable, {
                                path: _path + ".recipients",
                                expected: "Array<string>",
                                value: input.recipients
                            }), "string" === typeof input.text || _report(_exceptionable, {
                                path: _path + ".text",
                                expected: "string",
                                value: input.text
                            }), undefined === input.subject || "string" === typeof input.subject || _report(_exceptionable, {
                                path: _path + ".subject",
                                expected: "(string | undefined)",
                                value: input.subject
                            }), undefined === input.imageFilePath || "string" === typeof input.imageFilePath || _report(_exceptionable, {
                                path: _path + ".imageFilePath",
                                expected: "(string | undefined)",
                                value: input.imageFilePath
                            }), undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement || _report(_exceptionable, {
                                path: _path + ".isAdvertisement",
                                expected: "(boolean | undefined)",
                                value: input.isAdvertisement
                            }), undefined === input.allowNightSend || "boolean" === typeof input.allowNightSend || _report(_exceptionable, {
                                path: _path + ".allowNightSend",
                                expected: "(boolean | undefined)",
                                value: input.allowNightSend
                            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                })) && _vo0(input, _path + "", true) || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                }))(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "sendUrgentAlert",
                        parameters: {
                            type: "object",
                            properties: {
                                to: {
                                    type: "string"
                                },
                                text: {
                                    type: "string"
                                },
                                subject: {
                                    type: "string"
                                }
                            },
                            required: [
                                "to",
                                "text"
                            ],
                            additionalProperties: false,
                            $defs: {
                                DetailGroupMessageResponse: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uC2DC \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130\n\n### Description of {@link groupInfo} property:\n\n> \uBC1C\uC1A1 \uC815\uBCF4(\uC131\uACF5, \uC2E4\uD328 \uB4F1) \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        failedMessageList: {
                                            description: "\uBA54\uC2DC\uC9C0 \uBC1C\uC1A1 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uC694\uCCAD \uBAA9\uB85D\uB4E4",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/FailedMessage"
                                            }
                                        },
                                        groupInfo: {
                                            $ref: "#/$defs/GroupMessageResponse"
                                        },
                                        messageList: {
                                            description: "Send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC showMessageList \uAC12\uC774 true\uB85C \uB418\uC5B4\uC788\uC744 \uB54C \uD45C\uC2DC\uB418\uB294 \uBA54\uC2DC\uC9C0 \uBAA9\uB85D",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/MessageResponseItem"
                                            }
                                        }
                                    },
                                    required: [
                                        "failedMessageList",
                                        "groupInfo"
                                    ]
                                },
                                FailedMessage: {
                                    description: "\uBA54\uC2DC\uC9C0 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uAC1D\uCCB4",
                                    type: "object",
                                    properties: {
                                        to: {
                                            type: "string"
                                        },
                                        from: {
                                            type: "string"
                                        },
                                        type: {
                                            type: "string"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        },
                                        country: {
                                            type: "string"
                                        },
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        }
                                    },
                                    required: [
                                        "to",
                                        "from",
                                        "type",
                                        "statusMessage",
                                        "country",
                                        "messageId",
                                        "statusCode",
                                        "accountId"
                                    ]
                                },
                                Recordstringstring: {
                                    description: "Construct a type with a set of properties K of type T",
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "string"
                                    }
                                },
                                GroupMessageResponse: {
                                    type: "object",
                                    properties: {
                                        count: {
                                            $ref: "#/$defs/Count"
                                        },
                                        countForCharge: {
                                            $ref: "#/$defs/CountForCharge"
                                        },
                                        balance: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        point: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        app: {
                                            $ref: "#/$defs/App"
                                        },
                                        log: {
                                            $ref: "#/$defs/Log"
                                        },
                                        status: {
                                            type: "string"
                                        },
                                        allowDuplicates: {
                                            type: "boolean"
                                        },
                                        isRefunded: {
                                            type: "boolean"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        masterAccountId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        },
                                        apiVersion: {
                                            type: "string"
                                        },
                                        groupId: {
                                            type: "string"
                                        },
                                        price: {
                                            $ref: "#/$defs/object"
                                        },
                                        dateCreated: {
                                            type: "string"
                                        },
                                        dateUpdated: {
                                            type: "string"
                                        },
                                        scheduledDate: {
                                            type: "string"
                                        },
                                        dateSent: {
                                            type: "string"
                                        },
                                        dateCompleted: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "count",
                                        "countForCharge",
                                        "balance",
                                        "point",
                                        "app",
                                        "log",
                                        "status",
                                        "allowDuplicates",
                                        "isRefunded",
                                        "accountId",
                                        "masterAccountId",
                                        "apiVersion",
                                        "groupId",
                                        "price",
                                        "dateCreated",
                                        "dateUpdated"
                                    ]
                                },
                                Count: {
                                    type: "object",
                                    properties: {
                                        total: {
                                            type: "number"
                                        },
                                        sentTotal: {
                                            type: "number"
                                        },
                                        sentFailed: {
                                            type: "number"
                                        },
                                        sentSuccess: {
                                            type: "number"
                                        },
                                        sentPending: {
                                            type: "number"
                                        },
                                        sentReplacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        registeredFailed: {
                                            type: "number"
                                        },
                                        registeredSuccess: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "total",
                                        "sentTotal",
                                        "sentFailed",
                                        "sentSuccess",
                                        "sentPending",
                                        "sentReplacement",
                                        "refund",
                                        "registeredFailed",
                                        "registeredSuccess"
                                    ]
                                },
                                CountForCharge: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        ata: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cta: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cti: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        nsa: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_tpl: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                CountryChargeStatus: {
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "number"
                                    }
                                },
                                CommonCashResponse: {
                                    type: "object",
                                    properties: {
                                        requested: {
                                            type: "number"
                                        },
                                        replacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        sum: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "requested",
                                        "replacement",
                                        "refund",
                                        "sum"
                                    ]
                                },
                                App: {
                                    type: "object",
                                    properties: {
                                        profit: {
                                            $ref: "#/$defs/MessageTypeRecord"
                                        },
                                        appId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        }
                                    },
                                    required: [
                                        "profit"
                                    ]
                                },
                                MessageTypeRecord: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            type: "number"
                                        },
                                        lms: {
                                            type: "number"
                                        },
                                        mms: {
                                            type: "number"
                                        },
                                        ata: {
                                            type: "number"
                                        },
                                        cta: {
                                            type: "number"
                                        },
                                        cti: {
                                            type: "number"
                                        },
                                        nsa: {
                                            type: "number"
                                        },
                                        rcs_sms: {
                                            type: "number"
                                        },
                                        rcs_lms: {
                                            type: "number"
                                        },
                                        rcs_mms: {
                                            type: "number"
                                        },
                                        rcs_tpl: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                Log: {
                                    type: "array",
                                    items: {
                                        $ref: "#/$defs/object"
                                    }
                                },
                                object: {
                                    type: "object",
                                    properties: {},
                                    required: []
                                },
                                MessageResponseItem: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC\uC5D0 showMessageList \uAC12\uC744 true\uB85C \uB123\uC5B4\uC11C \uC694\uCCAD\uD588\uC744 \uACBD\uC6B0 \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "messageId",
                                        "statusCode",
                                        "statusMessage"
                                    ]
                                }
                            }
                        },
                        output: {
                            description: "\uC804\uC1A1 \uACB0\uACFC",
                            anyOf: [
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                originalResponse: {
                                                    $ref: "#/$defs/DetailGroupMessageResponse"
                                                },
                                                groupId: {},
                                                messageCount: {},
                                                accountId: {},
                                                success: {
                                                    type: "boolean"
                                                }
                                            },
                                            required: [
                                                "originalResponse",
                                                "groupId",
                                                "messageCount",
                                                "accountId",
                                                "success"
                                            ]
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message",
                                        "data"
                                    ]
                                },
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message"
                                    ]
                                }
                            ]
                        },
                        description: "\uAE34\uAE09 \uC54C\uB9BC \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0C5\uB2C8\uB2E4 (LMS, \uC989\uC2DC \uBC1C\uC1A1, \uC57C\uAC04 \uBC1C\uC1A1 \uD5C8\uC6A9)",
                        validate: (() => { const _io0 = input => "string" === typeof input.to && "string" === typeof input.text && (undefined === input.subject || "string" === typeof input.subject); const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.to || _report(_exceptionable, {
                                path: _path + ".to",
                                expected: "string",
                                value: input.to
                            }), "string" === typeof input.text || _report(_exceptionable, {
                                path: _path + ".text",
                                expected: "string",
                                value: input.text
                            }), undefined === input.subject || "string" === typeof input.subject || _report(_exceptionable, {
                                path: _path + ".subject",
                                expected: "(string | undefined)",
                                value: input.subject
                            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                })) && _vo0(input, _path + "", true) || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                }))(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "sendParentNotice",
                        parameters: {
                            type: "object",
                            properties: {
                                to: {
                                    type: "string"
                                },
                                title: {
                                    type: "string"
                                },
                                content: {
                                    type: "string"
                                },
                                isAdvertisement: {
                                    type: "boolean"
                                }
                            },
                            required: [
                                "to",
                                "title",
                                "content"
                            ],
                            additionalProperties: false,
                            $defs: {
                                DetailGroupMessageResponse: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uC2DC \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130\n\n### Description of {@link groupInfo} property:\n\n> \uBC1C\uC1A1 \uC815\uBCF4(\uC131\uACF5, \uC2E4\uD328 \uB4F1) \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        failedMessageList: {
                                            description: "\uBA54\uC2DC\uC9C0 \uBC1C\uC1A1 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uC694\uCCAD \uBAA9\uB85D\uB4E4",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/FailedMessage"
                                            }
                                        },
                                        groupInfo: {
                                            $ref: "#/$defs/GroupMessageResponse"
                                        },
                                        messageList: {
                                            description: "Send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC showMessageList \uAC12\uC774 true\uB85C \uB418\uC5B4\uC788\uC744 \uB54C \uD45C\uC2DC\uB418\uB294 \uBA54\uC2DC\uC9C0 \uBAA9\uB85D",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/MessageResponseItem"
                                            }
                                        }
                                    },
                                    required: [
                                        "failedMessageList",
                                        "groupInfo"
                                    ]
                                },
                                FailedMessage: {
                                    description: "\uBA54\uC2DC\uC9C0 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uAC1D\uCCB4",
                                    type: "object",
                                    properties: {
                                        to: {
                                            type: "string"
                                        },
                                        from: {
                                            type: "string"
                                        },
                                        type: {
                                            type: "string"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        },
                                        country: {
                                            type: "string"
                                        },
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        }
                                    },
                                    required: [
                                        "to",
                                        "from",
                                        "type",
                                        "statusMessage",
                                        "country",
                                        "messageId",
                                        "statusCode",
                                        "accountId"
                                    ]
                                },
                                Recordstringstring: {
                                    description: "Construct a type with a set of properties K of type T",
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "string"
                                    }
                                },
                                GroupMessageResponse: {
                                    type: "object",
                                    properties: {
                                        count: {
                                            $ref: "#/$defs/Count"
                                        },
                                        countForCharge: {
                                            $ref: "#/$defs/CountForCharge"
                                        },
                                        balance: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        point: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        app: {
                                            $ref: "#/$defs/App"
                                        },
                                        log: {
                                            $ref: "#/$defs/Log"
                                        },
                                        status: {
                                            type: "string"
                                        },
                                        allowDuplicates: {
                                            type: "boolean"
                                        },
                                        isRefunded: {
                                            type: "boolean"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        masterAccountId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        },
                                        apiVersion: {
                                            type: "string"
                                        },
                                        groupId: {
                                            type: "string"
                                        },
                                        price: {
                                            $ref: "#/$defs/object"
                                        },
                                        dateCreated: {
                                            type: "string"
                                        },
                                        dateUpdated: {
                                            type: "string"
                                        },
                                        scheduledDate: {
                                            type: "string"
                                        },
                                        dateSent: {
                                            type: "string"
                                        },
                                        dateCompleted: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "count",
                                        "countForCharge",
                                        "balance",
                                        "point",
                                        "app",
                                        "log",
                                        "status",
                                        "allowDuplicates",
                                        "isRefunded",
                                        "accountId",
                                        "masterAccountId",
                                        "apiVersion",
                                        "groupId",
                                        "price",
                                        "dateCreated",
                                        "dateUpdated"
                                    ]
                                },
                                Count: {
                                    type: "object",
                                    properties: {
                                        total: {
                                            type: "number"
                                        },
                                        sentTotal: {
                                            type: "number"
                                        },
                                        sentFailed: {
                                            type: "number"
                                        },
                                        sentSuccess: {
                                            type: "number"
                                        },
                                        sentPending: {
                                            type: "number"
                                        },
                                        sentReplacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        registeredFailed: {
                                            type: "number"
                                        },
                                        registeredSuccess: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "total",
                                        "sentTotal",
                                        "sentFailed",
                                        "sentSuccess",
                                        "sentPending",
                                        "sentReplacement",
                                        "refund",
                                        "registeredFailed",
                                        "registeredSuccess"
                                    ]
                                },
                                CountForCharge: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        ata: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cta: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cti: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        nsa: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_tpl: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                CountryChargeStatus: {
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "number"
                                    }
                                },
                                CommonCashResponse: {
                                    type: "object",
                                    properties: {
                                        requested: {
                                            type: "number"
                                        },
                                        replacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        sum: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "requested",
                                        "replacement",
                                        "refund",
                                        "sum"
                                    ]
                                },
                                App: {
                                    type: "object",
                                    properties: {
                                        profit: {
                                            $ref: "#/$defs/MessageTypeRecord"
                                        },
                                        appId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        }
                                    },
                                    required: [
                                        "profit"
                                    ]
                                },
                                MessageTypeRecord: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            type: "number"
                                        },
                                        lms: {
                                            type: "number"
                                        },
                                        mms: {
                                            type: "number"
                                        },
                                        ata: {
                                            type: "number"
                                        },
                                        cta: {
                                            type: "number"
                                        },
                                        cti: {
                                            type: "number"
                                        },
                                        nsa: {
                                            type: "number"
                                        },
                                        rcs_sms: {
                                            type: "number"
                                        },
                                        rcs_lms: {
                                            type: "number"
                                        },
                                        rcs_mms: {
                                            type: "number"
                                        },
                                        rcs_tpl: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                Log: {
                                    type: "array",
                                    items: {
                                        $ref: "#/$defs/object"
                                    }
                                },
                                object: {
                                    type: "object",
                                    properties: {},
                                    required: []
                                },
                                MessageResponseItem: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC\uC5D0 showMessageList \uAC12\uC744 true\uB85C \uB123\uC5B4\uC11C \uC694\uCCAD\uD588\uC744 \uACBD\uC6B0 \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "messageId",
                                        "statusCode",
                                        "statusMessage"
                                    ]
                                }
                            }
                        },
                        output: {
                            description: "\uC804\uC1A1 \uACB0\uACFC",
                            anyOf: [
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        },
                                        data: {
                                            type: "object",
                                            properties: {
                                                originalResponse: {
                                                    $ref: "#/$defs/DetailGroupMessageResponse"
                                                },
                                                groupId: {},
                                                messageCount: {},
                                                accountId: {},
                                                success: {
                                                    type: "boolean"
                                                }
                                            },
                                            required: [
                                                "originalResponse",
                                                "groupId",
                                                "messageCount",
                                                "accountId",
                                                "success"
                                            ]
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message",
                                        "data"
                                    ]
                                },
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message"
                                    ]
                                }
                            ]
                        },
                        description: "\uD559\uBD80\uBAA8 \uACF5\uC9C0\uC0AC\uD56D\uC744 \uBCF4\uB0C5\uB2C8\uB2E4 (\uC77C\uBC18\uC801\uC73C\uB85C LMS \uC0AC\uC6A9)",
                        validate: (() => { const _io0 = input => "string" === typeof input.to && "string" === typeof input.title && "string" === typeof input.content && (undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement); const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.to || _report(_exceptionable, {
                                path: _path + ".to",
                                expected: "string",
                                value: input.to
                            }), "string" === typeof input.title || _report(_exceptionable, {
                                path: _path + ".title",
                                expected: "string",
                                value: input.title
                            }), "string" === typeof input.content || _report(_exceptionable, {
                                path: _path + ".content",
                                expected: "string",
                                value: input.content
                            }), undefined === input.isAdvertisement || "boolean" === typeof input.isAdvertisement || _report(_exceptionable, {
                                path: _path + ".isAdvertisement",
                                expected: "(boolean | undefined)",
                                value: input.isAdvertisement
                            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                })) && _vo0(input, _path + "", true) || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                }))(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    },
                    {
                        name: "sendScheduleImage",
                        parameters: {
                            type: "object",
                            properties: {
                                to: {
                                    type: "string"
                                },
                                text: {
                                    type: "string"
                                },
                                imageFilePath: {
                                    type: "string"
                                },
                                title: {
                                    type: "string"
                                }
                            },
                            required: [
                                "to",
                                "text",
                                "imageFilePath"
                            ],
                            additionalProperties: false,
                            $defs: {
                                DetailGroupMessageResponse: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uC2DC \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130\n\n### Description of {@link groupInfo} property:\n\n> \uBC1C\uC1A1 \uC815\uBCF4(\uC131\uACF5, \uC2E4\uD328 \uB4F1) \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        failedMessageList: {
                                            description: "\uBA54\uC2DC\uC9C0 \uBC1C\uC1A1 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uC694\uCCAD \uBAA9\uB85D\uB4E4",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/FailedMessage"
                                            }
                                        },
                                        groupInfo: {
                                            $ref: "#/$defs/GroupMessageResponse"
                                        },
                                        messageList: {
                                            description: "Send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC showMessageList \uAC12\uC774 true\uB85C \uB418\uC5B4\uC788\uC744 \uB54C \uD45C\uC2DC\uB418\uB294 \uBA54\uC2DC\uC9C0 \uBAA9\uB85D",
                                            type: "array",
                                            items: {
                                                $ref: "#/$defs/MessageResponseItem"
                                            }
                                        }
                                    },
                                    required: [
                                        "failedMessageList",
                                        "groupInfo"
                                    ]
                                },
                                FailedMessage: {
                                    description: "\uBA54\uC2DC\uC9C0 \uC811\uC218\uC5D0 \uC2E4\uD328\uD55C \uBA54\uC2DC\uC9C0 \uAC1D\uCCB4",
                                    type: "object",
                                    properties: {
                                        to: {
                                            type: "string"
                                        },
                                        from: {
                                            type: "string"
                                        },
                                        type: {
                                            type: "string"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        },
                                        country: {
                                            type: "string"
                                        },
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        }
                                    },
                                    required: [
                                        "to",
                                        "from",
                                        "type",
                                        "statusMessage",
                                        "country",
                                        "messageId",
                                        "statusCode",
                                        "accountId"
                                    ]
                                },
                                Recordstringstring: {
                                    description: "Construct a type with a set of properties K of type T",
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "string"
                                    }
                                },
                                GroupMessageResponse: {
                                    type: "object",
                                    properties: {
                                        count: {
                                            $ref: "#/$defs/Count"
                                        },
                                        countForCharge: {
                                            $ref: "#/$defs/CountForCharge"
                                        },
                                        balance: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        point: {
                                            $ref: "#/$defs/CommonCashResponse"
                                        },
                                        app: {
                                            $ref: "#/$defs/App"
                                        },
                                        log: {
                                            $ref: "#/$defs/Log"
                                        },
                                        status: {
                                            type: "string"
                                        },
                                        allowDuplicates: {
                                            type: "boolean"
                                        },
                                        isRefunded: {
                                            type: "boolean"
                                        },
                                        accountId: {
                                            type: "string"
                                        },
                                        masterAccountId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        },
                                        apiVersion: {
                                            type: "string"
                                        },
                                        groupId: {
                                            type: "string"
                                        },
                                        price: {
                                            $ref: "#/$defs/object"
                                        },
                                        dateCreated: {
                                            type: "string"
                                        },
                                        dateUpdated: {
                                            type: "string"
                                        },
                                        scheduledDate: {
                                            type: "string"
                                        },
                                        dateSent: {
                                            type: "string"
                                        },
                                        dateCompleted: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "count",
                                        "countForCharge",
                                        "balance",
                                        "point",
                                        "app",
                                        "log",
                                        "status",
                                        "allowDuplicates",
                                        "isRefunded",
                                        "accountId",
                                        "masterAccountId",
                                        "apiVersion",
                                        "groupId",
                                        "price",
                                        "dateCreated",
                                        "dateUpdated"
                                    ]
                                },
                                Count: {
                                    type: "object",
                                    properties: {
                                        total: {
                                            type: "number"
                                        },
                                        sentTotal: {
                                            type: "number"
                                        },
                                        sentFailed: {
                                            type: "number"
                                        },
                                        sentSuccess: {
                                            type: "number"
                                        },
                                        sentPending: {
                                            type: "number"
                                        },
                                        sentReplacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        registeredFailed: {
                                            type: "number"
                                        },
                                        registeredSuccess: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "total",
                                        "sentTotal",
                                        "sentFailed",
                                        "sentSuccess",
                                        "sentPending",
                                        "sentReplacement",
                                        "refund",
                                        "registeredFailed",
                                        "registeredSuccess"
                                    ]
                                },
                                CountForCharge: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        ata: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cta: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        cti: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        nsa: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_sms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_lms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_mms: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        },
                                        rcs_tpl: {
                                            $ref: "#/$defs/CountryChargeStatus"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                CountryChargeStatus: {
                                    type: "object",
                                    properties: {},
                                    required: [],
                                    additionalProperties: {
                                        type: "number"
                                    }
                                },
                                CommonCashResponse: {
                                    type: "object",
                                    properties: {
                                        requested: {
                                            type: "number"
                                        },
                                        replacement: {
                                            type: "number"
                                        },
                                        refund: {
                                            type: "number"
                                        },
                                        sum: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "requested",
                                        "replacement",
                                        "refund",
                                        "sum"
                                    ]
                                },
                                App: {
                                    type: "object",
                                    properties: {
                                        profit: {
                                            $ref: "#/$defs/MessageTypeRecord"
                                        },
                                        appId: {
                                            anyOf: [
                                                {
                                                    type: "null"
                                                },
                                                {
                                                    type: "string"
                                                }
                                            ]
                                        }
                                    },
                                    required: [
                                        "profit"
                                    ]
                                },
                                MessageTypeRecord: {
                                    type: "object",
                                    properties: {
                                        sms: {
                                            type: "number"
                                        },
                                        lms: {
                                            type: "number"
                                        },
                                        mms: {
                                            type: "number"
                                        },
                                        ata: {
                                            type: "number"
                                        },
                                        cta: {
                                            type: "number"
                                        },
                                        cti: {
                                            type: "number"
                                        },
                                        nsa: {
                                            type: "number"
                                        },
                                        rcs_sms: {
                                            type: "number"
                                        },
                                        rcs_lms: {
                                            type: "number"
                                        },
                                        rcs_mms: {
                                            type: "number"
                                        },
                                        rcs_tpl: {
                                            type: "number"
                                        }
                                    },
                                    required: [
                                        "sms",
                                        "lms",
                                        "mms",
                                        "ata",
                                        "cta",
                                        "cti",
                                        "nsa",
                                        "rcs_sms",
                                        "rcs_lms",
                                        "rcs_mms",
                                        "rcs_tpl"
                                    ]
                                },
                                Log: {
                                    type: "array",
                                    items: {
                                        $ref: "#/$defs/object"
                                    }
                                },
                                object: {
                                    type: "object",
                                    properties: {},
                                    required: []
                                },
                                MessageResponseItem: {
                                    description: "send \uBA54\uC18C\uB4DC \uD638\uCD9C \uB2F9\uC2DC\uC5D0 showMessageList \uAC12\uC744 true\uB85C \uB123\uC5B4\uC11C \uC694\uCCAD\uD588\uC744 \uACBD\uC6B0 \uBC18\uD658\uB418\uB294 \uC751\uB2F5 \uB370\uC774\uD130",
                                    type: "object",
                                    properties: {
                                        messageId: {
                                            type: "string"
                                        },
                                        statusCode: {
                                            type: "string"
                                        },
                                        customFields: {
                                            $ref: "#/$defs/Recordstringstring"
                                        },
                                        statusMessage: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "messageId",
                                        "statusCode",
                                        "statusMessage"
                                    ]
                                }
                            }
                        },
                        output: {
                            description: "\uC804\uC1A1 \uACB0\uACFC",
                            anyOf: [
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        },
                                        data: {
                                            $ref: "#/$defs/DetailGroupMessageResponse"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message",
                                        "data"
                                    ]
                                },
                                {
                                    type: "object",
                                    properties: {
                                        success: {
                                            type: "boolean"
                                        },
                                        message: {
                                            type: "string"
                                        }
                                    },
                                    required: [
                                        "success",
                                        "message"
                                    ]
                                }
                            ]
                        },
                        description: "\uC218\uC5C5 \uC2DC\uAC04\uD45C\uB098 \uC548\uB0B4 \uC774\uBBF8\uC9C0\uC640 \uD568\uAED8 \uBA54\uC2DC\uC9C0\uB97C \uBCF4\uB0C5\uB2C8\uB2E4 - SOLAPI \uC5C5\uB85C\uB4DC \uBC29\uC2DD",
                        validate: (() => { const _io0 = input => "string" === typeof input.to && "string" === typeof input.text && "string" === typeof input.imageFilePath && (undefined === input.title || "string" === typeof input.title); const _vo0 = (input, _path, _exceptionable = true) => ["string" === typeof input.to || _report(_exceptionable, {
                                path: _path + ".to",
                                expected: "string",
                                value: input.to
                            }), "string" === typeof input.text || _report(_exceptionable, {
                                path: _path + ".text",
                                expected: "string",
                                value: input.text
                            }), "string" === typeof input.imageFilePath || _report(_exceptionable, {
                                path: _path + ".imageFilePath",
                                expected: "string",
                                value: input.imageFilePath
                            }), undefined === input.title || "string" === typeof input.title || _report(_exceptionable, {
                                path: _path + ".title",
                                expected: "(string | undefined)",
                                value: input.title
                            })].every(flag => flag); const __is = input => "object" === typeof input && null !== input && _io0(input); let errors; let _report; return input => {
                            if (false === __is(input)) {
                                errors = [];
                                _report = __typia_transform__validateReport._validateReport(errors);
                                ((input, _path, _exceptionable = true) => ("object" === typeof input && null !== input || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                })) && _vo0(input, _path + "", true) || _report(true, {
                                    path: _path + "",
                                    expected: "__type",
                                    value: input
                                }))(input, "$input", true);
                                const success = 0 === errors.length;
                                return success ? {
                                    success,
                                    data: input
                                } : {
                                    success,
                                    errors,
                                    data: input
                                };
                            }
                            return {
                                success: true,
                                data: input
                            };
                        }; })()
                    }
                ]
            },
            execute: new SmsTool_1.SmsTool(),
        },
        // 다른 도구들도 여기에 등록 (예: PdfParserTool)
    ],
});
const router = (0, express_1.Router)();
// AgenticaHistory의 실제 타입을 바탕으로 사용자 정의 타입 가드 정의
// AgenticaExecuteHistory의 'type'은 "execute" 입니다.
// 이 타입 가드들은 answer가 특정 History 타입의 인스턴스임을 TypeScript에 알려줍니다.
// AgenticaExecuteHistory 타입 가드 (도구 호출 및 결과 포함)
function isAgenticaExecute(answer) {
    return answer.type === 'execute';
}
// AgenticaAssistantMessageHistory 타입 가드
function isAgenticaAssistantMessage(answer) {
    return answer.type === 'assistantMessage';
}
router.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log('--- 카카오톡 웹훅 수신 ---');
    console.log(JSON.stringify(req.body, null, 2));
    try {
        const userMessage = (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.userRequest) === null || _b === void 0 ? void 0 : _b.utterance; // 사용자의 발화 내용
        if (!userMessage) {
            console.log('사용자 메시지가 없습니다.');
            return res.json({
                version: "2.0",
                template: { outputs: [{ simpleText: { text: "메시지 내용을 찾을 수 없습니다." } }] }
            });
        }
        // Agentica에게 사용자 메시지 전달 및 응답 받기
        // conversate는 여러 개의 History 객체를 반환할 수 있습니다.
        // 마지막 히스토리를 주로 사용하거나, 모든 히스토리를 조합하여 응답을 만듭니다.
        const agentAnswers = yield agent.conversate(userMessage);
        let replyText = "명령을 이해하지 못했습니다. 다시 시도해 주세요.";
        if (agentAnswers && agentAnswers.length > 0) {
            // 가장 최신 또는 가장 관련성 높은 답변을 찾기 위해 배열을 역순으로 탐색하거나,
            // 특정 타입의 답변이 나올 때까지 기다릴 수 있습니다.
            // 여기서는 배열의 마지막 답변을 기준으로 처리합니다.
            const lastAnswer = agentAnswers[agentAnswers.length - 1];
            if (isAgenticaExecute(lastAnswer)) {
                // AgenticaExecuteHistory는 도구 호출 정보 (operation)와 반환값 (value)을 모두 포함합니다.
                // LLM이 함수 호출을 지시했을 때 이 타입이 반환됩니다.
                console.log(`Agentica가 도구를 호출했습니다 (execute): ${lastAnswer.operation.name}`);
                // `value` 속성에 실제 도구 실행 결과가 담겨 있습니다.
                // `value`는 `unknown` 타입이므로 사용 전에 타입 확인 또는 캐스팅이 필요합니다.
                const toolResult = lastAnswer.value; // toolResult는 IHttpResponse 또는 클래스 함수의 반환값
                // 여기서 toolResult가 SMS Tool의 반환값인 { success: boolean, message: string, data?: any } 형태라고 가정합니다.
                if (toolResult && typeof toolResult === 'object' && 'success' in toolResult) {
                    if (toolResult.success) {
                        replyText = `${toolResult.message || '요청이 성공적으로 처리되었습니다.'} GroupID: ${((_c = toolResult.data) === null || _c === void 0 ? void 0 : _c.groupId) || 'N/A'}`;
                    }
                    else {
                        replyText = `요청 처리 중 오류가 발생했습니다: ${toolResult.message || '알 수 없는 오류'}`;
                    }
                }
                else {
                    // toolResult가 예상했던 형태가 아닐 때
                    replyText = `요청 처리 완료. 결과: ${JSON.stringify(toolResult)}`;
                }
            }
            else if (isAgenticaAssistantMessage(lastAnswer)) {
                // Agentica가 직접 생성한 일반 텍스트 응답
                replyText = lastAnswer.text;
            }
            // 다른 History 타입들 (예: UserMessage, SystemMessage 등)은 여기에서 추가 처리할 수 있습니다.
            // else if (isAgenticaUserMessage(lastAnswer)) { /* ... */ }
            // else if (isAgenticaSystemMessage(lastAnswer)) { /* ... */ }
        }
        else {
            replyText = "Agentica가 응답을 생성하지 못했습니다.";
        }
        // 카카오톡 챗봇 응답 형식에 맞춰 JSON 반환
        res.json({
            version: "2.0",
            template: {
                outputs: [
                    {
                        simpleText: {
                            text: replyText
                        }
                    }
                ]
            }
        });
    }
    catch (error) {
        console.error('카카오톡 웹훅 처리 중 오류 발생:', error);
        res.status(500).json({
            version: "2.0",
            template: { outputs: [{ simpleText: { text: `오류가 발생했습니다: ${error.message}` } }] }
        });
    }
}));
exports.default = router;
