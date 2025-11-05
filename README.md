# EduMate

## 🧭 Overview

> **Agentica**는 **AI 기반 대화형 시스템**으로,  
> 자연어 대화만으로 학원 데스크의 반복적인 행정 업무를 자동화합니다.  
> 복잡한 설정이나 별도의 학습 과정 없이 **직관적인 웹 인터페이스**를 통해 누구나 쉽게 사용할 수 있으며,  
> AI가 빠르고 정확하게 처리하여 **업무 효율성을 극대화**합니다.

---

### 💡 주요 기능

- **자연어 기반 대화형 업무 처리** — 자연어로 요청 가능
- **엑셀 데이터 처리 및 분석** — 수강생 정보, 출결, 점수 자동 처리
- **AI 코멘트 생성** — 학생 답안 기반의 자동 코멘트 작성
- **SMS 발송** — 학부모에게 데일리테스트 메시지 전송
- **실시간 처리 및 정확도 향상** — 반복 업무의 처리 속도 향상과 오류 최소화

---

## 📈 Project Status

> **Status:** 🚀 **Operational (Live Service Running)**

Agentica는 현재 **실제 학원 환경에서 운영 중**이며,  
AI 기반 대화형 시스템을 통해 **데스크 업무 자동화 및 피드백 생성** 기능을 제공합니다.  
주요 기능은 안정적으로 동작하고 있으며, 사용자 피드백을 기반으로 **지속적인 고도화 작업**이 진행되고 있습니다.

---

### ✅ 운영 중인 주요 기능

1. **엑셀 파일 업로드**

   - 학원 담당자가 학생 답안 및 점수 데이터를 엑셀 파일로 업로드
   - 문제별/학생별 데이터를 자동 파싱 및 저장

2. **문제별 코멘트 생성**

   - 데스크 선생님이 문제의 특징을 간단히 입력하면  
     **EduMate AI**가 각 문제에 대한 피드백을 자동 생성
   - 문제별 상황에 따른 코멘트 예시:
     ```text
     - 정답일 때: "이 유형은 정확하게 이해했네요! 계산도 빠릅니다. "
     - 오답일 때: "분모 통일 과정에서 실수가 있었어요. 개념 복습이 필요해요."
     - 보완점: "유사 문제를 2~3개 더 풀어보면 완벽하게 익힐 수 있습니다."
     ```

3. **학생별 코멘트 생성**

   - 문제별 코멘트를 종합하여 **학생 맞춤형 피드백 자동 생성**
   - 여러 문제를 틀린 학생 → **격려 중심 피드백**
   - 일부 실수한 학생 → **보완 중심 피드백**
   - 매번 다양한 문체로 자연스러운 코멘트 제공
   - 생성된 코멘트는 화면에서 즉시 확인 가능

4. **학부모용 데일리 테스트 이미지 생성**

   - 학생별 점수, 코멘트가 포함된 **자동 이미지 생성**

5. **SMS 발송 기능**
   - 학부모님께 데일리 테스트 결과 이미지를 **문자(SMS)** 로 자동 송부
   - 발송 내역 및 상태를 시스템에서 확인 가능

---

### 🔧 지속 개선 중인 항목

- 피드백 표현 다양화 (톤/스타일 선택 기능)
- 외부 학원 관리 시스템 연동 기능

---

### **📝 How to Build**

```bash
# 저장소 클론
git clone https://github.com/OpenSoftware-agentAI/AIagent_OS.git

# 의존성 설치
npm install

# 환경변수 설정
## Frontend (FE)
# 1. 개발 환경 (FE/.env.development)
VITE_API_BASE_URL=http://localhost:3000

# 2. 배포 환경 (FE/.env.production)
VITE_API_BASE_URL=https://<your-production-domain>

## Backend (BE)
# 개발 환경 (BE/.env)

# OpenAI API Key (비공개)
OPENAI_API_KEY=<your_openai_api_key>

# Solapi 문자 API
SOLAPI_API_KEY=<your_solapi_api_key>
SOLAPI_API_SECRET=<your_solapi_api_secret>
SOLAPI_FROM=<registered_sender_number>

# 서버 설정
PORT=3000
NODE_ENV=development

# Prisma Database URL
DATABASE_URL="prisma+postgres://<your_database_url>"

# 관리자용 인증키
ADMIN_KEY=<your_admin_key>


# BE 패키지로 이동
cd BE

# 서버 구동
npm run dev

# ngrok 실행 (포트 번호 3000 고정)
ngrok http 3000

# 웹 서비스 접속
https://tory-edumate.netlify.app/

```

### ⚙️ Tech Stack

#### 🖥️ Frontend

[![React](https://img.shields.io/badge/React-Vite-blue?logo=react)](https://reactjs.org/)  
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.3-blue?logo=tailwind-css)](https://tailwindcss.com/)  
[![Netlify](https://img.shields.io/badge/Deployment-Netlify-green?logo=netlify)](https://www.netlify.com/)

#### ⚙️ Backend

[![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)](https://nodejs.org/)  
[![Express](https://img.shields.io/badge/Express.js-4.18-lightgrey?logo=express)](https://expressjs.com/)  
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)  
[![Prisma](https://img.shields.io/badge/Prisma-4.15-blue?logo=prisma)](https://www.prisma.io/)  
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.7-lightgrey?logo=socket.io)](https://socket.io/)  
[![npm](https://img.shields.io/badge/npm-9.8-red?logo=npm)](https://www.npmjs.com/)

