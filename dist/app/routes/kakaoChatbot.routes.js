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
const express_1 = require("express");
const core_1 = require("@agentica/core");
const openai_1 = require("openai");
const ExcelTool_1 = require("../../tools/ExcelTool");
const SmsTool_1 = require("../../tools/SmsTool");
const StudentExcelTool_1 = require("../../tools/StudentExcelTool");
const typia_1 = __importDefault(require("typia"));
const openai = new openai_1.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const agent = new core_1.Agentica({
    model: 'chatgpt',
    vendor: {
        model: 'gpt-4o-mini',
        api: openai,
    },
    controllers: [
        {
            name: 'Excel Tool',
            protocol: 'class',
            application: {
                model: "chatgpt",
                options: {
                    reference: true,
                    strict: false,
                    separate: null
                },
                functions: [
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
                    },
                    {
                        name: "insertFeedback",
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
                    },
                    {
                        name: "runNodeScript",
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
            name: 'Student Excel Tool',
            protocol: 'class',
            application: {
                model: "chatgpt",
                options: {
                    reference: true,
                    strict: false,
                    separate: null
                },
                functions: [
                    {
                        name: "export",
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
            execute: new StudentExcelTool_1.StudentExcelTool(),
        },
        {
            name: 'Sms Tool',
            protocol: 'class',
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
    ],
});
const router = (0, express_1.Router)();
const pendingResults = new Map();
function isAgenticaExecute(answer) {
    return answer.type === 'execute';
}
function isAgenticaAssistantMessage(answer) {
    return answer.type === 'assistantMessage';
}
function withTimeout(promise, ms) {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout(${ms}ms)`)), ms)),
    ]);
}
function kakaoText(text) {
    return {
        version: '2.0',
        template: {
            outputs: [{ simpleText: { text } }],
        },
    };
}
function quickIntentReplyOrNull(utterance) {
    if (!utterance)
        return kakaoText('메시지 내용을 찾을 수 없습니다.');
    const msg = utterance.trim();
    if (/^(도움말|help|사용법)$/i.test(msg)) {
        return kakaoText([
            '📋 사용 가이드',
            '',
            '• SMS: 010-0000-0000로 "내용" 문자 보내줘',
            '• LMS/MMS도 동일, 이미지 파일은 업로드 후 지시',
            '• 엑셀: 엑셀 데이터 정리/분석/요약 요청',
            '• 결과 확인: "결과 확인" 또는 "어떻게 됐어?"',
        ].join('\n'));
    }
    if (/^(헬스체크|상태|health)$/i.test(msg)) {
        return kakaoText('서버는 정상 동작 중입니다.');
    }
    return null;
}
function getActionParams(body) {
    const p = (body && body.action && body.action.params) || {};
    const d = (body && body.action && body.action.detailParams) || {};
    const flatDetail = {};
    Object.keys(d).forEach((k) => {
        var _a, _b;
        const v = d[k];
        if (v && typeof v === 'object') {
            flatDetail[k] = (_b = (_a = v.value) !== null && _a !== void 0 ? _a : v.origin) !== null && _b !== void 0 ? _b : '';
        }
        else {
            flatDetail[k] = v;
        }
    });
    return Object.assign(Object.assign({}, p), flatDetail);
}
const recentRequests = new Map();
function makeReqKey(body) {
    var _a, _b, _c, _d;
    const userId = ((_b = (_a = body === null || body === void 0 ? void 0 : body.userRequest) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.id) || 'unknown';
    const actionId = ((_c = body === null || body === void 0 ? void 0 : body.action) === null || _c === void 0 ? void 0 : _c.id) || 'noaction';
    const utter = (((_d = body === null || body === void 0 ? void 0 : body.userRequest) === null || _d === void 0 ? void 0 : _d.utterance) || '').trim();
    return `${userId}::${actionId}::${utter}`;
}
function isDuplicateAndMark(key, ttlMs = 10000) {
    const now = Date.now();
    const prev = recentRequests.get(key) || 0;
    if (now - prev < ttlMs)
        return true;
    recentRequests.set(key, now);
    if (recentRequests.size > 1000) {
        const threshold = now - 60000;
        for (const [k, t] of recentRequests)
            if (t < threshold)
                recentRequests.delete(k);
    }
    return false;
}
function summarizeToolResult(executeResult) {
    var _a, _b;
    const toolName = (_a = executeResult.operation) === null || _a === void 0 ? void 0 : _a.name;
    const success = (_b = executeResult.value) === null || _b === void 0 ? void 0 : _b.success;
    if (toolName === null || toolName === void 0 ? void 0 : toolName.includes('Sms')) {
        return success ? '문자 메시지를 성공적으로 전송했습니다!' : '문자 전송 중 오류가 발생했습니다.';
    }
    if (toolName === null || toolName === void 0 ? void 0 : toolName.includes('Excel')) {
        return success ? '엑셀 데이터 처리를 완료했습니다!' : '엑셀 처리 중 오류가 발생했습니다.';
    }
    return success ? '요청을 성공적으로 처리했습니다!' : '처리 중 오류가 발생했습니다.';
}
function isResultCheckRequest(utterance) {
    return /^(결과|확인|어떻게|완료|됐어|상황|어떡|처리|끝났)/i.test(utterance.trim());
}
router.post('/webhook', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const utterance = (((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.userRequest) === null || _b === void 0 ? void 0 : _b.utterance) || '').trim();
    const userId = ((_e = (_d = (_c = req.body) === null || _c === void 0 ? void 0 : _c.userRequest) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.id) || 'unknown';
    const params = getActionParams(req.body);
    const textCandidate = (params.textCandidate || '').toString();
    const urlCandidate = (params.urlCandidate || '').toString();
    const imageUrlCandidate = (params.imageUrlCandidate || '').toString();
    const dateCandidate = (params.dateCandidate || '').toString();
    const timeCandidate = (params.timeCandidate || '').toString();
    const reqKey = makeReqKey(req.body);
    if (isDuplicateAndMark(reqKey)) {
        console.warn('중복 요청 차단:', reqKey);
        return res.json(kakaoText('요청을 처리 중입니다.'));
    }
    console.log('--- 카카오 웹훅 ---', { userId, utterance });
    try {
        const quick = quickIntentReplyOrNull(utterance);
        if (quick)
            return res.json(quick);
        if (isResultCheckRequest(utterance)) {
            const pending = pendingResults.get(userId);
            if (pending && Date.now() - pending.timestamp < 300000) {
                pendingResults.delete(userId);
                return res.json(kakaoText(pending.result));
            }
            else {
                return res.json(kakaoText('확인할 결과가 없거나 만료되었습니다. 새로운 요청을 해주세요.'));
            }
        }
        let toolExecutedInFastPath = false;
        try {
            const answers = yield withTimeout(agent.conversate(utterance), 4000);
            const last = answers[answers.length - 1];
            if (isAgenticaExecute(last)) {
                res.json(kakaoText(summarizeToolResult(last)));
                toolExecutedInFastPath = true;
            }
            else if (isAgenticaAssistantMessage(last)) {
                res.json(kakaoText(last.text || '요청을 처리했습니다.'));
            }
            else {
                res.json(kakaoText('요청을 처리했습니다.'));
            }
        }
        catch (_f) {
            res.json(kakaoText('요청을 처리 중입니다. 완료되면 "결과 확인"이라고 말씀해 주세요.'));
        }
        setImmediate(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (toolExecutedInFastPath) {
                console.log('빠른 경로에서 도구 실행 완료. 백그라운드 처리 전체 스킵.');
                return;
            }
            const maybeSms = /(문자|sms|메시지|메세지|보내줘|전송|발송)/i.test(utterance);
            if (maybeSms) {
                console.log('SMS 의도는 빠른 경로에서 처리. 백그라운드 스킵.');
                return;
            }
            try {
                const bgAnswers = yield withTimeout(agent.conversate(utterance), 6000);
                const last = bgAnswers[bgAnswers.length - 1];
                let backgroundResult = '';
                if (isAgenticaAssistantMessage(last)) {
                    backgroundResult = last.text || '요청이 처리되었습니다.';
                    console.log('백그라운드 AI 응답:', last.text);
                }
                else if (isAgenticaExecute(last)) {
                    backgroundResult = summarizeToolResult(last);
                    console.log('백그라운드 도구 실행:', (_a = last.operation) === null || _a === void 0 ? void 0 : _a.name, (_b = last.value) !== null && _b !== void 0 ? _b : {});
                }
                else {
                    backgroundResult = '요청이 처리되었습니다.';
                    console.log('백그라운드 AI 응답(요약):', JSON.stringify(last !== null && last !== void 0 ? last : {}));
                }
                if (/(엑셀|excel|시트|sheet)/i.test(utterance)) {
                    console.log('엑셀 관련 요청 감지');
                }
                if (backgroundResult) {
                    pendingResults.set(userId, {
                        result: backgroundResult,
                        timestamp: Date.now()
                    });
                    console.log(`백그라운드 결과 저장됨 (${userId}):`, backgroundResult);
                }
            }
            catch (bgErr) {
                const errorMessage = '처리 중 오류가 발생했습니다. 다시 시도해주세요.';
                pendingResults.set(userId, {
                    result: errorMessage,
                    timestamp: Date.now()
                });
                console.error('백그라운드 처리 오류:', bgErr);
            }
        }));
    }
    catch (error) {
        console.error('웹훅 처리 오류:', (error === null || error === void 0 ? void 0 : error.message) || error);
        return res.json(kakaoText('처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'));
    }
}));
exports.default = router;
