/**
 * Docsify C 러너 플러그인 설정 파일
 * 플러그인의 동작을 사용자 정의할 수 있는 설정 옵션을 제공합니다.
 */

window.$docsifyCRunnerConfig = {
  // API 서버 설정
  apiServer: {
    // C 코드 실행 API 서버 URL
    url: 'http://localhost:5555/execute_c',
    
    // API 요청 헤더
    headers: {
      'Content-Type': 'application/json',
      // 추가 헤더가 필요한 경우 여기에 설정
      // 'Authorization': 'Bearer YOUR_TOKEN',
      // 'Custom-Header': 'Custom-Value',
    },
    
    // API 요청 타임아웃 (밀리초)
    timeout: 10000,
  },
  
  // UI/UX 설정
  ui: {
    // 테마 ('light' 또는 'dark')
    theme: 'light',
    
    // 버튼 스타일 ('minimal' 또는 'full')
    buttonStyle: 'minimal',
    
    // 코드 라인 번호 표시 여부
    showLineNumbers: true,
    
    // 애니메이션 속도 (밀리초)
    animationSpeed: 300,
    
    // 버튼 텍스트 (아이콘 대신 텍스트 사용 시)
    buttonText: {
      run: '실행',
      toggle: '토글',
      copy: '복사',
    },
    
    // 버튼 아이콘 (텍스트 대신 아이콘 사용 시)
    buttonIcons: {
      run: '▶',
      toggle: '↕',
      copy: '📋',
    },
    
    // 버튼 툴팁
    buttonTooltips: {
      run: '코드 실행',
      toggle: '전체 코드 보기/숨기기',
      copy: '코드 복사',
    },
  },
  
  // 코드 마커 설정
  codeMarker: {
    // 시작 마커
    startMarker: '// START_HIGHLIGHT',
    
    // 종료 마커
    endMarker: '// END_HIGHLIGHT',
    
    // 마커 숨김 여부
    hideMarkers: true,
  },
  
  // 실행 결과 설정
  result: {
    // 결과 창 최대 높이
    maxHeight: '200px',
    
    // 결과 창 폰트
    fontFamily: 'monospace',
    
    // 종료 코드 표시 여부
    showExitCode: true,
    
    // 결과 창 자동 스크롤 여부
    autoScroll: true,
    
    // 결과 창 접기/펼치기 가능 여부
    collapsible: true,
  },
  
  // 디버그 모드 (개발용)
  debug: false,
};
