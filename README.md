# docsify-c-runner-plugin

## 소개

Docsify C Runner Plugin은 문서를 읽으면서 C 코드 예제를 즉시 실행하고 결과를 확인할 수 있게 해주는 플러그인입니다.   
또한, 코드 하이라이트, 복사 등 개발 편의를 위한 유용한 기능을 함께 제공합니다.

[mdBook](https://github.com/rust-lang/mdBook)의 [Hiding code lines](https://rust-lang.github.io/mdBook/format/mdbook.html#hiding-code-lines), [Rust Playground](https://rust-lang.github.io/mdBook/format/mdbook.html#rust-playground) 기능에서 영감을 받아 만들어졌습니다.

이 저장소는 다음을 포함하고 있습니다.

* Docsify C Runner Plugin 
* 플러그인이 적용된 예제 Docsify 프로젝트

## 주요 기능

- **실시간 C 코드 실행**: 문서 내 C 코드 블록을 브라우저에서 바로 실행
- **커맨드라인 인자 지원**: 코드 실행 시 커맨드라인 인자 입력 가능
- **코드 결과 출력**: 실행 결과와 오류 메시지를 문서 내에서 직접 확인
- **코드 복사**: 코드 클립보드 복사
- **문법 하이라이팅**: C 코드 구문 강조 표시

## 실행 영상

https://github.com/user-attachments/assets/f187a3b0-8b15-497e-a19b-11f0d116c33d

## 요구사항 및 구성

이 프로젝트는 Docsify 환경에서 C Runner 플러그인을 함께 사용하도록 구성된 샘플 리포지토리입니다. 다음 요소가 필요합니다:

* **Docsify**: 정적 사이트 생성 도구
    * 이미 예시 프로젝트에 적용되어 있으므로 이 프로젝트를 clone하여 사용한다면 따로 구성할 필요 없습니다.
* **C Runner API 서버**: C 코드를 컴파일·실행할 수 있는 백엔드
    * 서버로는 [c-runner-api-server](https://github.com/YangSiJun528/c-runner-api-server)를 사용합니다. 다른 서버를 사용하려면 코드 수정이 필요합니다. (아래 설명 참고)
* **웹 서버**: Docsify 문서를 서빙할 로컬/원격 서버

> **참고**:   
> Docsify 공식 문서와 이 문서에서는 Python의 `http.server`를 사용한 가이드를 제공하지만,   
> 이 외의 사용자가 원하는 웹 서버를 자유롭게 사용할 수 있습니다.   

> **다른 C Runner API 사용시**:    
> 다른 C Runner API를 사용하려면, 사용하려는 서버의 요구사항에 맞게 코드를 수정해야 합니다.   
> 다음 파일을 업데이트하세요.  
> - `docsify-c-runner-plugin/docsify-c-runner.js` 안의 `CApiClient` 
> - `docsify-c-runner-plugin/config.js` 

## 설치 및 실행 방법

### 1. 저장소 클론

```bash
git clone https://github.com/YangSiJun528/docsify-c-runner-plugin.git
cd docsify-c-runner-plugin
```

### 2. C Runner API 서버 설정

[c-runner-api-server](https://github.com/YangSiJun528/c-runner-api-server)를 설치하고 실행하세요.

`docsify-c-runner-plugin/config.js`에서 `apiServer.url`을 실제 C Runner API 엔드포인트로 수정합니다:

```javascript
const config = {
    apiServer: {
        url: "http://localhost:8080" // 실제 API 서버 주소로 변경
    }
};
```

### 3. 웹 서버 실행

루트 디렉터리에서 웹 서버를 실행합니다:

```bash
python -m http.server 3000
```

또는 Node.js를 사용하는 경우:

```bash
npx http-server -p 3000
```

### 4. 문서 확인

브라우저에서 `http://localhost:3000`에 접속하여 Docsify 문서를 확인합니다.

## 파일 구조

```plaintext
.
├── README.md
├── docs
│   ├── _sidebar.md       # 사이드바 네비게이션 설정
│   ├── home.md           # 홈 페이지 내용
│   └── examples.md       # 플러그인 예제 모음
├── docsify-c-runner-plugin
│   ├── config.js         # 플러그인 설정 파일
│   ├── docsify-c-runner.css # 스타일 정의
│   └── docsify-c-runner.js  # 플러그인 핵심 로직
└── index.html            # Docsify 초기화 스크립트 포함 페이지
```

## 기존 프로젝트에 플러그인 적용하기

기존 Docsify 프로젝트에 이 플러그인을 적용하거나, 새로운 프로젝트를 구성하고 싶은 경우 다음 단계를 따르세요:

### 1. 플러그인 파일 복사

`docsify-c-runner-plugin` 디렉터리의 모든 파일을 기존 프로젝트에 복사하세요.

### 2. HTML 파일에 플러그인 로드

`index.html`에 다음 스크립트와 스타일시트를 추가합니다:

```html
<!-- C Runner Plugin CSS -->
<link rel="stylesheet" href="{플러그인 파일의 위치}/docsify-c-runner-plugin/docsify-c-runner.css">
<!-- C Runner Plugin -->
<script src="{플러그인 파일의 위치}/docsify-c-runner-plugin/docsify-c-runner.js"></script>
```

### 3. 설정 파일 수정

`docsify-c-runner-plugin/config.js`에서 API 서버 URL을 실제 환경에 맞게 수정합니다.

## 사용법

### 실행 가능한 코드 블록

마크다운 문서에서 C 코드 블록을 다음과 같이 작성하면 실행 버튼이 자동으로 추가됩니다.

````markdown
```c,runnable
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```
````

코드 블록 옆의 "Run" 버튼을 클릭하면 코드가 실행되고 결과가 표시됩니다.

### 코드 블록 하이라이트

복잡하거나 긴 코드 중 핵심 부분만 강조하여 보여주고 싶을 때 사용합니다.

강조할 시작 지점 위에 `// START_HIGHLIGHT` 을 추가합니다.
강조할 끝 지점 아래에 `// END_HIGHLIGHT` 을 추가합니다.

Docsify에서 문서를 볼 떄는 `// START_HIGHLIGHT`, `// END_HIGHLIGHT`의 코드 라인은 제거됩니다. 

````markdown
```c,runnable
#include <stdio.h>

int main() {
    // START_HIGHLIGHT
    printf("이 부분만 처음에 보입니다!\n");
    // END_HIGHLIGHT
    
    printf("전체 코드를 보려면 토글 버튼을 클릭하세요.\n");
    return 0;
}
```
````

### 커맨드라인 인자 지원

커맨드라인 인자를 입력받아 실행하려면 다음과 같이 `c,runnable,args` 옵션을 사용합니다.

````markdown
```c,runnable,args
#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("인자 개수: %d\n", argc);
    
    for (int i = 0; i < argc; i++) {
        printf("인자 %d: %s\n", i, argv[i]);
    }
    
    return 0;
}
```
````

"Run" 버튼을 클릭하면 커맨드라인 인자를 입력할 수 있는 프롬프트가 표시됩니다.   
인자를 입력하고 확인하면 코드가 실행됩니다.

## 문제 해결

### API 서버 연결 오류
- C Runner API 서버가 실행 중인지 확인하세요
- `config.js`의 API URL이 올바른지 확인하세요
- CORS 설정이 적절한지 확인하세요

### 웹 서버 실행 오류
- Python이나 Node.js가 설치되어 있는지 확인하세요
- 포트가 이미 사용 중인 경우 다른 포트를 사용해보세요

## 라이선스

["MIT-0" License](./LICENSE)

자유롭게 수정 및 재배포 가능합니다.
