export const corsConfig = {
  origin: [
    "https://tory-edumate.netlify.app",
    "https://aiagent-edumate.netlify.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
