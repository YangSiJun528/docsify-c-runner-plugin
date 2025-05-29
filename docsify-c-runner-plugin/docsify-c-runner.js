/**
 * Docsify C 러너 플러그인
 * C 코드를 실행할 수 있는 docsify 플러그인입니다.
 * 
 * 이 파일은 다음 요소를 포함합니다.
 * - C API 클라이언트
 * - 코드 마커 처리기
 * - 코드 블록 UI
 * - Docsify C 러너 플러그인
 */

(function() {
  'use strict';

  //==========================================================================
  // 1. C API 클라이언트 모듈
  // C API 서버와의 통신을 처리하는 기능을 제공합니다.
  //==========================================================================

  /**
   * C API 클라이언트 클래스
   */
  class CApiClient {
    /**
     * 생성자
     * @param {Object} config API 서버 설정
     */
    constructor(config) {
      this.config = config || {};
      this.url = this.config.url || 'http://localhost:5555/execute_c';
      this.headers = this.config.headers || {
        'Content-Type': 'application/json'
      };
      this.timeout = this.config.timeout || 10000;
    }

    /**
     * C 코드 실행 요청
     * @param {string} code 실행할 C 코드
     * @param {string} args 명령행 인수 (선택사항)
     * @returns {Promise<Object>} 실행 결과
     */
    async executeCode(code, args = '') {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        
        const response = await fetch(this.url, {
          method: 'POST',
          headers: this.headers,
          body: JSON.stringify({ 
            code: code,
            args: args 
          }),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        return await response.json();
      } catch (error) {
        if (error.name === 'AbortError') {
          return {
            error: '요청 시간 초과',
            exit_code: -1,
            output: ''
          };
        }
        
        return {
          error: `API 요청 오류: ${error.message}`,
          exit_code: -1,
          output: ''
        };
      }
    }

    /**
     * 실행 결과 포맷팅
     * @param {Object} result API 응답 결과
     * @returns {Object} 포맷팅된 결과
     */
    formatResult(result) {
      const isSuccess = result.exit_code === 0 && !result.error;
      const output = result.output || '';
      const error = result.error || '';
      const exitCode = result.exit_code;
      
      return {
        isSuccess,
        output,
        error,
        exitCode,
        formattedOutput: isSuccess ? output : error,
        statusClass: isSuccess ? 'success' : 'error'
      };
    }
  }

  //==========================================================================
  // 2. 코드 마커 처리 모듈
  // 코드 블록 내 마커를 식별하고 처리하는 기능을 제공합니다.
  //==========================================================================

  /**
   * 코드 마커 처리 클래스
   */
  class CodeMarkerHandler {
    /**
     * 생성자
     * @param {Object} config 마커 설정
     */
    constructor(config) {
      this.config = config || {};
      this.startMarker = this.config.startMarker || '// START_HIGHLIGHT';
      this.endMarker = this.config.endMarker || '// END_HIGHLIGHT';
      this.hideMarkers = this.config.hideMarkers !== false;
    }

    /**
     * 코드에서 마커 사이의 내용을 추출
     * @param {string} code 전체 코드
     * @returns {Object} 추출된 코드 정보
     */
    extractMarkedCode(code) {
      const lines = code.split('\n');
      let startIndex = -1;
      let endIndex = -1;
      
      // 마커 위치 찾기
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(this.startMarker)) {
          startIndex = i;
        } else if (lines[i].includes(this.endMarker)) {
          endIndex = i;
          break;
        }
      }
      
      // 마커가 없거나 잘못된 경우 전체 코드 반환
      if (startIndex === -1 || endIndex === -1 || startIndex >= endIndex) {
        return {
          hasMarkers: false,
          visibleCode: code,
          fullCode: code,
          startIndex: -1,
          endIndex: -1
        };
      }
      
      // 마커 사이의 코드 추출 (마커 라인 제외)
      const visibleLines = lines.slice(startIndex + 1, endIndex);
      const visibleCode = visibleLines.join('\n');
      
      return {
        hasMarkers: true,
        visibleCode: visibleCode,
        fullCode: code,
        startIndex: startIndex,
        endIndex: endIndex
      };
    }

    /**
     * 마커를 제외한 전체 코드 추출
     * @param {string} code 전체 코드
     * @returns {string} 마커가 제거된 코드
     */
    getCleanCode(code) {
      const lines = code.split('\n');
      return lines.filter(line => 
        !line.includes(this.startMarker) && 
        !line.includes(this.endMarker)
      ).join('\n');
    }

    /**
     * 코드 블록 HTML 생성
     * @param {string} code 전체 코드
     * @param {boolean} showFull 전체 코드 표시 여부
     * @returns {string} 처리된 HTML
     */
    generateCodeBlockHtml(code, showFull = false) {
      const extracted = this.extractMarkedCode(code);
      
      if (!extracted.hasMarkers) {
        return code;
      }
      
      if (showFull) {
        return this.hideMarkers ? this.getCleanCode(code) : code;
      } else {
        return extracted.visibleCode;
      }
    }
  }

  //==========================================================================
  // 3. 코드 블록 UI 모듈
  // 코드 블록의 UI 요소를 생성하고 관리하는 기능을 제공합니다.
  //==========================================================================

  /**
   * 코드 블록 UI 클래스
   */
  class CodeBlockUI {
    /**
     * 생성자
     * @param {Object} config UI 설정
     */
    constructor(config) {
      this.config = config || {};
      this.theme = this.config.theme || 'light';
      this.buttonStyle = this.config.buttonStyle || 'minimal';
      this.showLineNumbers = this.config.showLineNumbers !== false;
      this.animationSpeed = this.config.animationSpeed || 300;
    }

    /**
     * 코드 블록 컨테이너 생성
     * @param {string} codeContent 코드 내용
     * @param {string} language 언어 (c)
     * @param {Object} markerHandler 코드 마커 처리기
     * @param {Object} apiClient C API 클라이언트
     * @param {boolean} hasArgsOption 커맨드라인 인자 옵션 여부
     * @returns {HTMLElement} 생성된 코드 블록 컨테이너
     */
    createCodeBlockContainer(codeContent, language, markerHandler, apiClient, hasArgsOption) {
      const container = document.createElement('div');
      container.className = 'c-runner-container';
      container.dataset.expanded = 'false';
      container.dataset.hasArgs = hasArgsOption ? 'true' : 'false';
      
      // 코드 마커 처리
      const codeInfo = markerHandler.extractMarkedCode(codeContent);
      const initialCode = codeInfo.hasMarkers ? codeInfo.visibleCode : codeContent;
      const fullCode = codeContent;
      const cleanCode = markerHandler.getCleanCode(fullCode);
      
      // 코드 블록 생성
      const codeBlock = document.createElement('pre');
      codeBlock.className = `language-${language} c-runner-code`;
      
      const codeElement = document.createElement('code');
      codeElement.className = `language-${language}`;
      codeElement.textContent = initialCode;
      
      codeBlock.appendChild(codeElement);
      container.appendChild(codeBlock);
      
      // 버튼 컨테이너 생성
      const buttonContainer = this.createButtonContainer(container, codeElement, fullCode, cleanCode, initialCode, codeInfo, markerHandler, apiClient, hasArgsOption);
      container.appendChild(buttonContainer);
      
      // 결과 컨테이너 생성
      const resultContainer = document.createElement('div');
      resultContainer.className = 'c-runner-result';
      resultContainer.style.display = 'none';
      container.appendChild(resultContainer);
      
      // 이벤트 리스너 등록
      this.registerEventListeners(container, buttonContainer);
      
      // 코드 하이라이팅 적용 (Prism.js 사용 시)
      if (window.Prism) {
        window.Prism.highlightElement(codeElement);
      }
      
      return container;
    }

    /**
     * 버튼 컨테이너 생성
     * @param {HTMLElement} container 코드 블록 컨테이너
     * @param {HTMLElement} codeElement 코드 요소
     * @param {string} fullCode 전체 코드
     * @param {string} cleanCode 마커가 제거된 코드
     * @param {string} initialCode 초기 표시 코드
     * @param {Object} codeInfo 코드 정보
     * @param {Object} markerHandler 코드 마커 처리기
     * @param {Object} apiClient C API 클라이언트
     * @param {boolean} hasArgsOption 커맨드라인 인자 옵션 여부
     * @returns {HTMLElement} 생성된 버튼 컨테이너
     */
    createButtonContainer(container, codeElement, fullCode, cleanCode, initialCode, codeInfo, markerHandler, apiClient, hasArgsOption) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'c-runner-buttons';
      
      // 실행 버튼
      const runButton = document.createElement('button');
      runButton.className = 'c-runner-button c-runner-run';
      runButton.innerHTML = '<span class="c-runner-icon">▶</span>';
      runButton.title = 'Run Code';
      runButton.onclick = async () => {
        let args = '';
        
        // 커맨드라인 인자 옵션이 있는 경우 프롬프트로 입력 받기
        if (hasArgsOption) {
          args = prompt('커맨드라인 인자를 입력하세요:', '');
          // 취소 버튼 클릭 시 실행 중단
          if (args === null) return;
        }
        
        await this.runCode(container, cleanCode, apiClient, args);
      };
      
      // 토글 버튼 (코드 숨김/표시)
      const toggleButton = document.createElement('button');
      toggleButton.className = 'c-runner-button c-runner-toggle';
      toggleButton.innerHTML = '<span class="c-runner-icon">↕</span>';
      toggleButton.title = 'Toggle Full Code';
      toggleButton.onclick = () => {
        this.toggleCode(container, codeElement, fullCode, initialCode, codeInfo, markerHandler);
      };
      
      // 복사 버튼
      const copyButton = document.createElement('button');
      copyButton.className = 'c-runner-button c-runner-copy';
      copyButton.innerHTML = '<span class="c-runner-icon">📋</span>';
      copyButton.title = 'Copy Code';
      copyButton.onclick = () => {
        this.copyCode(cleanCode, copyButton);
      };
      
      buttonContainer.appendChild(runButton);
      
      // 마커가 있는 경우에만 토글 버튼 추가
      if (codeInfo.hasMarkers) {
        buttonContainer.appendChild(toggleButton);
      }
      
      buttonContainer.appendChild(copyButton);
      
      return buttonContainer;
    }

    /**
     * 이벤트 리스너 등록
     * @param {HTMLElement} container 코드 블록 컨테이너
     * @param {HTMLElement} buttonContainer 버튼 컨테이너
     */
    registerEventListeners(container, buttonContainer) {
      // 호버 시 버튼 표시
      container.addEventListener('mouseenter', () => {
        buttonContainer.style.opacity = '1';
      });
      
      container.addEventListener('mouseleave', () => {
        buttonContainer.style.opacity = '0';
      });
    }

    /**
     * 코드 실행
     * @param {HTMLElement} container 코드 블록 컨테이너
     * @param {string} code 실행할 코드
     * @param {Object} apiClient C API 클라이언트
     * @param {string} args 명령행 인수 (선택사항)
     */
    async runCode(container, code, apiClient, args = '') {
      const resultContainer = container.querySelector('.c-runner-result');
      
      // 로딩 표시
      resultContainer.innerHTML = '<div class="c-runner-loading">실행 중...</div>';
      resultContainer.style.display = 'block';
      
      try {
        // API 요청
        const result = await apiClient.executeCode(code, args);
        const formattedResult = apiClient.formatResult(result);
        
        // 결과 표시
        resultContainer.innerHTML = '';
        resultContainer.className = `c-runner-result ${formattedResult.statusClass}`;
        
        const resultContent = document.createElement('pre');
        resultContent.className = 'c-runner-result-content';
        resultContent.textContent = formattedResult.formattedOutput;
        
        resultContainer.appendChild(resultContent);
        
        // 종료 코드 표시 (설정에 따라)
        if (this.config.showExitCode && formattedResult.exitCode !== 0) {
          const exitCodeElement = document.createElement('div');
          exitCodeElement.className = 'c-runner-exit-code';
          exitCodeElement.textContent = `Exit Code: ${formattedResult.exitCode}`;
          resultContainer.appendChild(exitCodeElement);
        }
      } catch (error) {
        // 오류 처리
        resultContainer.innerHTML = '';
        resultContainer.className = 'c-runner-result error';
        
        const errorContent = document.createElement('pre');
        errorContent.className = 'c-runner-result-content';
        errorContent.textContent = `Error: ${error.message}`;
        
        resultContainer.appendChild(errorContent);
      }
    }

    /**
     * 코드 토글 (숨김/표시)
     * @param {HTMLElement} container 코드 블록 컨테이너
     * @param {HTMLElement} codeElement 코드 요소
     * @param {string} fullCode 전체 코드
     * @param {string} initialCode 초기 표시 코드
     * @param {Object} codeInfo 코드 정보
     * @param {Object} markerHandler 코드 마커 처리기
     */
    toggleCode(container, codeElement, fullCode, initialCode, codeInfo, markerHandler) {
      const isExpanded = container.dataset.expanded === 'true';
      
      if (isExpanded) {
        // 축소 상태로 변경
        codeElement.textContent = initialCode;
        container.dataset.expanded = 'false';
      } else {
        // 확장 상태로 변경
        const displayCode = markerHandler.hideMarkers ? markerHandler.getCleanCode(fullCode) : fullCode;
        codeElement.textContent = displayCode;
        container.dataset.expanded = 'true';
      }
      
      // 코드 하이라이팅 다시 적용 (Prism.js 사용 시)
      if (window.Prism) {
        window.Prism.highlightElement(codeElement);
      }
    }

    /**
     * 코드 복사
     * @param {string} code 복사할 코드
     * @param {HTMLElement} button 복사 버튼
     */
    copyCode(code, button) {
      navigator.clipboard.writeText(code)
        .then(() => {
          // 복사 성공 피드백
          const originalText = button.innerHTML;
          button.innerHTML = '<span class="c-runner-icon">✓</span>';
          button.classList.add('success');
          
          setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('success');
          }, 2000);
        })
        .catch(err => {
          // 복사 실패 피드백
          const originalText = button.innerHTML;
          button.innerHTML = '<span class="c-runner-icon">✗</span>';
          button.classList.add('error');
          
          setTimeout(() => {
            button.innerHTML = originalText;
            button.classList.remove('error');
          }, 2000);
          
          console.error('Failed to copy code:', err);
        });
    }
  }

  //==========================================================================
  // 4. Docsify C 러너 플러그인 메인 모듈
  // C 코드를 실행할 수 있는 docsify 플러그인입니다.
  //==========================================================================

  // 기본 설정
  const DEFAULT_CONFIG = {
    apiServer: {
      url: 'http://localhost:5555/execute_c',
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    },
    ui: {
      theme: 'light',
      buttonStyle: 'minimal',
      showLineNumbers: true,
      animationSpeed: 300
    },
    codeMarker: {
      startMarker: '// START_HIGHLIGHT',
      endMarker: '// END_HIGHLIGHT',
      hideMarkers: true
    },
    result: {
      maxHeight: '200px',
      fontFamily: 'monospace',
      showExitCode: true
    }
  };

  /**
   * 플러그인 초기화
   * @param {Object} config 사용자 설정
   * @returns {Object} 플러그인 인스턴스
   */
  function init(config = {}) {
    // 사용자 설정과 기본 설정 병합
    const mergedConfig = mergeConfig(DEFAULT_CONFIG, window.$docsifyCRunnerConfig || {}, config);
    
    // 모듈 인스턴스 생성
    const markerHandler = new CodeMarkerHandler(mergedConfig.codeMarker);
    const apiClient = new CApiClient(mergedConfig.apiServer);
    const codeBlockUI = new CodeBlockUI(mergedConfig.ui);
    
    return {
      markerHandler,
      apiClient,
      codeBlockUI,
      config: mergedConfig
    };
  }

  /**
   * 설정 병합
   * @param {...Object} configs 병합할 설정 객체들
   * @returns {Object} 병합된 설정
   */
  function mergeConfig(...configs) {
    return configs.reduce((merged, config) => {
      if (!config) return merged;
      
      Object.keys(config).forEach(key => {
        if (typeof config[key] === 'object' && config[key] !== null && !Array.isArray(config[key])) {
          merged[key] = merged[key] || {};
          merged[key] = { ...merged[key], ...config[key] };
        } else {
          merged[key] = config[key];
        }
      });
      
      return merged;
    }, {});
  }

  /**
   * Docsify 플러그인 등록
   */
  function docsifyCRunnerPlugin(hook, vm) {
    // 플러그인 인스턴스 초기화
    const plugin = init();
    
    // 마크다운 파서 확장
    hook.beforeEach(function(content) {
      return content;
    });
    
    // 마크다운 렌더링 후 코드 블록 처리
    hook.afterEach(function(html, next) {
      next(html);
    });
    
    // DOM 준비 후
    hook.doneEach(function() {
      // 코드 블록 처리
      const preElements = document.querySelectorAll('pre[data-lang]');
      
      preElements.forEach(preElement => {
        const codeElement = preElement.querySelector('code');
        if (!codeElement) return;
        
        const lang = preElement.getAttribute('data-lang');
        const isRunnable = lang.includes('c,runnable');
        const hasArgsOption = lang.includes('c,runnable,args');
        
        if (isRunnable) {
          const codeContent = codeElement.textContent;
          const container = plugin.codeBlockUI.createCodeBlockContainer(
            codeContent, 
            'c', 
            plugin.markerHandler, 
            plugin.apiClient,
            hasArgsOption
          );
          
          // 기존 코드 블록 대체
          preElement.parentNode.replaceChild(container, preElement);
        }
      });
    });
  }

  // Docsify 플러그인 등록
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = window.$docsify.plugins || [];
  window.$docsify.plugins.push(docsifyCRunnerPlugin);

})();
