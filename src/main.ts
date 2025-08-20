import { Agentica } from "@agentica/core";
import { OpenAI } from "openai";
import { ExcelTool } from "./tools/ExcelTool";
import { StudentExcelTool } from "./tools/StudentExcelTool";
import typia from "typia";
import readline from "readline";
import dotenv from "dotenv";
import { SmsTool } from "./tools/SmsTool"; // 새로 추가

dotenv.config();

async function main() {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: openai,
    },
    controllers: [
      {
        name: "Excel Tool",
        protocol: "class",
        application: typia.llm.application<ExcelTool, "chatgpt">(),
        execute: new ExcelTool(),
      },
      {
        name: "Student Excel Tool",
        protocol: "class",
        application: typia.llm.application<StudentExcelTool, "chatgpt">(),
        execute: new StudentExcelTool(),
      },
      {
        name: "Sms Tool",
        protocol: "class",
        application: typia.llm.application<SmsTool, "chatgpt">(),
        execute: new SmsTool(),
      },
    ],
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const conversation = () => {
    rl.question('User Input (exit: q) : ', async (input) => {
      if (input === 'q') {
        rl.close();
        return;
      }
      try {
        const answers = await agent.conversate(input);
        // 필요 시 디버깅:
        // answers.forEach((a) => console.log(JSON.stringify(a, null, 2)));
      } catch (e) {
        console.error('Agent error:', e);
      }
      conversation();
    });
  };
  conversation();
}

main().catch(console.error);
