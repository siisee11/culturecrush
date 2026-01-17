## 1. 프로젝트 개요 (Overview)
**Culture Crush**는 스타트업이 회의 후 회사의 핵심 가치(Core Values)와 참여자들의 발언이 얼마나 일치(Align)하는지 분석하고 리포트를 제공하는 서비스입니다. 
- **Product Type**: MVP 형태의 **일회성 웹 도구** (새로고침 시 데이터 초기화). 별도의 DB나 로그인 없이 가볍게 사용.
- **Goal**: 딱딱한 분석보다는, 듀오링고(Duolingo) 스타일의 게이미피케이션 요소를 통해 "기분 좋은 피드백"을 제공하는 것이 주목적.

## 2. 핵심 기능 (Core Features)

### 2.1. 입력 (Input)
- **핵심 가치 입력 (Core Values)**: 사용자가 회사의 핵심 가치들을 입력합니다. (예: "Move Fast", "Be Transparent")
- **미팅 노트/트랜스크립트 입력 (Meeting Transcript)**: 
    - 텍스트 박스에 붙여넣기 방식.
    - **Format Examples**: `Speaker Name` 줄바꿈 후 발언 내용이 이어지는 형태 (예: `MEETING_NOTE_EXAMPLE.md`).
    ```text
    Speaker 1
    안녕하세요. 
    오늘 회의 시작합시다.
    
    Speaker 2
    네 알겠습니다.
    ```
    - LLM에게 파싱을 맡기거나 간단한 정규식으로 화자와 발언을 분리합니다.

### 2.2. 분석 및 처리 (Analysis & Processing)
- **발언 분석**: 텍스트를 발언 단위 및 의미 단위로 분리.
- **연관성 점수 산출 (Scoring)**: 
    - 범위: **-5점 ~ +5점**
    - **-5 ~ -1**: 핵심 가치 위배 (Negative Alignment)
    - **0**: 관련 없음
    - **1 ~ 5**: 핵심 가치 일치 (Positive Alignment)
- **점수 경합 처리**: 한 문장이 여러 핵심 가치와 연관될 경우, **가장 높은 점수**의 가치(색상) 하나만 대표로 표시합니다.

### 2.3. 결과 뷰 1: 인터랙티브 트랜스크립트 (Interactive Transcript)
- **Analyzing Animation**: 분석 시간이 길어질 수 있음(LLM 처리). 사용자가 지루하지 않게 **게이미피케이션 요소를 활용한 재미있는 로딩/채점 애니메이션**을 제공합니다. (예: 캐릭터가 열심히 받아적는 모션, 점수판이 돌아가는 효과 등)
- **뷰 모드 (View Modes)**:
    - **General Mode (기본)**: 
        - **3점 이상** (긍정적)인 부분만 하이라이트/밑줄 표시.
        - 부정적인 발언은 표시하지 않음 (칭찬 위주).
    - **CEO Mode (Hidden)**: 
        - 개발자 도구 콘솔(`window.ceo = true`) 혹은 URL 파라미터(`?ceo=true`) 등으로 활성화.
        - 부정적 점수(-5 ~ -1)를 받은 발언에 대해 **경고(Warning)** 표시 또는 붉은색 밑줄로 피드백.
- **호버 인터랙션 (Hover Interaction)**: 마우스 호버 시 상세 점수와 어떤 가치와 연결되었는지 툴팁 표시.

### 2.4. 결과 뷰 2: 얼라인먼트 리포트 (Alignment Report)
- **회의 요약 (Meeting Summary)**: 전체 회의 내용의 요약.
- **참여자 얼라인먼트 (Participant Alignment)**:
    - 각 참가자의 "기여도"를 캐릭터와 XP 바 등으로 시각화.
    - 긍정적인 점수 합산 위주로 랭킹/레벨 표시.
    - **게이미피케이션**: "이달의 밸류 챔피언", "속도광(Move Fast 1위)" 같은 칭호 부여.

## 3. 사용자 흐름 (User Flow)
1. **Landing**: 서비스 소개, "Start Analysis" 버튼.
2. **Setup**: 
    - 핵심 가치 입력 (Tag Input).
    - 트랜스크립트 본문 붙여넣기 (Textarea).
3. **Analyzing**: **Fun Loading Sequence** (분석 진행률 시각화).
4. **Transcript Review**: 
    - 기본적으로 긍정 피드백 위주의 하이라이트.
    - (CEO 모드 진입 시 부정 피드백 확인 가능).
5. **Report**: 최종 게이미피케이션 리포트 (스크린샷 공유 유도).

## 4. UI/UX 디자인 가이드 (Design Guidelines)
- **Mood**: Energetic, Playful, Premium. (지루한 기업용 SW 탈피)
- **Color Palette**:
    - Primary: Vibrant Green/Orange (like Duolingo/Headspace).
    - Background: Clean White or Soft Cream (Light Mode).
    - Accents: Varies by Core Value (e.g., Value A=Blue, Value B=Purple).
- **Interactions**:
    - 점수 카운팅, 프로그레스 바 차오르는 애니메이션.
    - 기분 좋은 햅틱/사운드 효과(가능하다면).

## 5. 기술 스택 (Tech Stack)
- **Framework**: Next.js (React) - `apps/web` (User prefers manual setup or standard npx without strict monorepo usually, but checking workspace). *Assuming standard Next.js app.*
- **Styling**: Vanilla CSS (CSS Modules) - **Premium Design Requirement**.
- **State Management**: Zustand (Ephemeral store).
- **AI/LLM**: OpenAI API (gpt-4o or similar) via API Routes.
