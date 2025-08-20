# Agentica AI 카카오톡 비서 서비스
> 카카오톡 대화창에서 자연어로 SMS/이미지/엑셀 업무를 자동화하는 Agentica AI 기반 대화형 비서

## 📋 프로젝트 개요
이 프로젝트는 기존 터미널 환경에서 사용하던 Agentica AI 비서를 카카오톡 UI로 확장하여, 사용자가 자연어 대화만으로 다양한 업무(문자 발송, 이미지 처리, 엑셀 가공)를 처리할 수 있는 서비스입니다.

### 🎯 주요 특징
- **자유 대화**: 터미널처럼 제약 없는 자연어 대화
- **즉시 응답**: 2.5초 이내 가벼운 질의는 실시간 답변
- **업무 자동화**: SMS/LMS/MMS, 이미지 첨부, 엑셀 처리 자동 실행
- **안정성**: 중복 방지, 타임아웃 가드, 오류 핸들링

## 🛠 기술 스택
- **Language**: TypeScript (ES2016)
- **Runtime**: Node.js + Express
- **AI Engine**: Agentica AI (LLM 기반 의도 해석·도구 선택)
- **Tools**: SmsTool, ExcelTool, StudentExcelTool (typia 스키마)
- **Platform**: 카카오 비즈니스 챗봇 (단일 시나리오·블록·스킬)
- **External APIs**: 메시징 API (SMS/LMS/MMS), 파일 처리
- **Infrastructure**: 환경변수 설정, 정적 파일 서빙, 헬스체크

## 🏗 시스템 아키텍처
```
[사용자 (카카오톡)]
        ↓
[카카오 챗봇 관리자센터]
├─ 웰컴 블록 (고정)
├─ 폴백 블록 (고정)  
├─ 탈출 블록 (고정)
└─ 메인 담화 블록 (단일 시나리오)
   ├─ 시스템 엔티티: @sys.text, @sys.url, @sys.image.url
   └─ 스킬: POST /webhook
        ↓
[Express 서버]
├─ Fast Response (≤2.5s)
│  ├─ 간단 질의 → 즉시 응답
│  └─ 복잡한 작업 → "접수" 응답
│
└─ Background Worker
   ├─ 파라미터 결합
   │  ├─ 시스템 엔티티 우선
   │  ├─ NLP 정규식 보정
   │  └─ LLM 해석 보완
   │
   ├─ [Agentica AI]
   │  └─ 컨트롤러 실행
   │     ├─ SmsTool
   │     ├─ ExcelTool  
   │     └─ StudentExcelTool
   │
   └─ 결과 처리
      ├─ 파일 생성 (/downloads)
      ├─ 로깅
      └─ 중복 방지 (10초)
```

## 🚀 주요 기능
### 1. 자유 대화
- 일반 질문: "오늘 몇 일이야?" → 즉시 답변
- 복잡한 작업: 접수 후 백그라운드 처리

### 2. 메시지 전송 (SMS/LMS/MMS)
```
사용자: "010-1234-5678로 '회의 시간이 변경되었습니다' 문자 보내줘"
→ SMS 자동 발송

사용자: [이미지 업로드] + "이 이미지를 010-1234-5678에 전송해줘"  
→ MMS 자동 발송
```
### 3. 엑셀 데이터 처리
```
사용자: "출석 데이터 정리해줘"
→ ExcelTool/StudentExcelTool 실행 → 결과 파일 다운로드 링크 제공
```
### 4. 파일 처리
- 이미지 수신: `@sys.image.url` 시스템 엔티티 활용
- 결과 제공: `/downloads` 경로로 생성된 파일 다운로드

## 📦 설치 및 실행

### 1. 환경 설정
```bash
# 저장소 클론
git clone [repository-url]
cd [project-directory]
# 의존성 설치
npm install
# 환경변수 설정
cp .env.example .env
# .env 파일에 필요한 키값 설정
```
### 2. 실행
```bash
# 개발 환경
npm run start:dev
# 프로덕션 빌드
npm run build
npm run start
```
### 3. 카카오 챗봇 연동
1. 카카오 비즈니스 챗봇 관리자센터에서 챗봇 생성
2. 스킬 서버 URL 설정: `https://your-domain.com/kakao/webhook`
3. 시나리오 구성:
   - 메인 담화 블록 생성
   - 시스템 엔티티 매핑 (선택사항)
   - 발화 패턴: `*`, `@any`, `@any 해줘` 등

## 🔧 환경변수 설정
```bash
# .env 파일
OPENAI_API_KEY=your_openai_api_key
MESSAGING_API_KEY=your_messaging_api_key
MESSAGING_SECRET=your_messaging_secret
SENDER_PHONE=01012345678
PORT=3000
```
## 📁 프로젝트 구조
```
src/
├── app/
│   ├── routes/
│   │   ├── kakaoChatbot.routes.ts    # 메인 웹훅 라우터
│   │   ├── messaging.routes.ts       # 메시징 API
│   │   └── dlr.webhook.ts           # 배달 결과 수신
│   └── app.ts                       # Express 앱 설정
├── tools/
│   ├── SmsTool.ts                   # SMS/LMS/MMS 발송
│   ├── ExcelTool.ts                 # 범용 엑셀 처리
│   └── StudentExcelTool.ts          # 학생 데이터 전용
├── utils/
│   └── nlp.ts                       # 자연어 파라미터 추출
└── main.ts                          # 터미널 대화용 (개발/테스트)
```

## 🎯 사용 예시
### SMS 발송
```
사용자: "010-1234-5678로 '안녕하세요' 문자 보내줘"
봇: "요청을 접수했습니다. 잠시만 기다려 주세요."
→ 백그라운드에서 SMS 발송 완료
```
### 이미지 MMS 발송  
```
사용자: [이미지 업로드] + "010-1234-5678로 이 이미지 전송해줘"
봇: "요청을 접수했습니다. 잠시만 기다려 주세요."
→ 백그라운드에서 MMS 발송 완료
```
### 엑셀 처리
```
사용자: "학생 출석 데이터 정리해줘"  
봇: "파일이 생성되었습니다. [다운로드 링크]"
```
## ⚡ 성능 및 안정성

- **응답 속도**: 간단한 질의 2.5초 이내 즉시 응답
- **중복 방지**: 동일 요청 10초간 차단
- **타임아웃 가드**: 장기 작업 6초 제한으로 안정성 확보
- **오류 처리**: 상세 로깅 및 사용자 친화적 오류 메시지

## 🔮 향후 계획
- [ ] 카카오 후속 메시지 API 연동 (백그라운드 결과 실시간 전달)
- [ ] 예약 발송 기능 (`@sys.date`/`@sys.time` 활용)
- [ ] 다중 수신자 처리 UX 개선
- [ ] 주소록 연계 및 그룹 발송 기능
- [ ] 파일 업로드 전용 블록 UX 고도화

**Made with using Agentica AI**
