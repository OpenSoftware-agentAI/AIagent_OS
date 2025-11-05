import "dotenv/config";

export const ENV = {
  SOLAPI_API_KEY: process.env.SOLAPI_API_KEY ?? "",
  SOLAPI_API_SECRET: process.env.SOLAPI_API_SECRET ?? "",
  SOLAPI_FROM: process.env.SOLAPI_FROM ?? "",
  PORT: Number(3000),
  NODE_ENV: process.env.NODE_ENV ?? "development",
};

const requiredEnvs = ["SOLAPI_API_KEY", "SOLAPI_API_SECRET", "SOLAPI_FROM"];
for (const key of requiredEnvs) {
  if (!ENV[key as keyof typeof ENV]) {
    throw new Error(`환경변수 누락: ${key}`);
  }
}
