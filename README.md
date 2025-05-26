# docsify-c-runner-plugin

## 소개

Docsify C Runner Plugin은 문서를 읽으면서 C 코드 예제를 즉시 실행하고 결과를 확인할 수 있게 해주는 플러그인입니다.   
또한, 코드 하이라이트, 복사 등 개발 편의를 위한 유용한 기능을 함께 제공합니다.

[mdBook](https://github.com/rust-lang/mdBook)의 [Hiding code lines](https://rust-lang.github.io/mdBook/format/mdbook.html#hiding-code-lines), [Rust Playground](https://rust-lang.github.io/mdBook/format/mdbook.html#rust-playground) 기능에서 영감을 받아 만들어졌습니다.

이 저장소는 다음을 포함하고 있습니다.

* Docsify C Runner Plugin 
* 플러그인이 적용된 예제 Docsify 프로젝트

---

## 실행 영상

TODO: 추가하기

---

## 요구사항 및 구성

이 프로젝트는 Docsify 환경에서 C Runner 플러그인을 함께 사용하도록 구성된 샘플 리포지토리입니다. 다음 요소가 필요합니다:

* **Docsify**: 정적 사이트 생성 도구
    * 이미 예시 프로젝트에 적용되어 있으므로 이 프로젝트를 clone하여 사용한다면 따로 구성할 필요 없습니다.
* **C Runner API 서버**: C 코드를 컴파일·실행할 수 있는 백엔드
    * 서버로는 [c-runner-api-server](https://github.com/YangSiJun528/c-runner-api-server)를 사용합니다. 다른 서버를 사용하려면 코드 수정이 필요합니다. (아래 설명 참고)
* **웹 서버**: Docsify 문서를 서빙할 로컬/원격 서버

> Docsify 공식 문서와 이 문서에서는 Python의 `http-server`를 사용한 가이드를 제공하지만, 이 외의 사용자가 원하는 서버를 사용할 수 있습니다.

> 다른 C Runner API를 사용하려면, 사용하려는 서버의 요구사항에 맞게 코드를 수정해야 합니다.   
> `docsify-c-runner-plugin/docsify-c-runner.js` 내 `CApiClient` 클래스와 `docsify-c-runner-plugin/config.js` 설정을 함께 업데이트하세요.  

---

## 설치 및 실행 방법

1. 저장소를 클론합니다:

   ```bash
   git clone https://github.com/YangSiJun528/docsify-c-runner-plugin.git
   cd docsify-c-runner-plugin
   ```
2. `docsify-c-runner-plugin/config.js`에서 `apiServer.url`을 실제 C Runner API 엔드포인트로 수정합니다.
3. 루트 디렉터리에서 웹 서버를 실행합니다:

   ```bash
   python -m http.server 3000
   ```
4. 브라우저에서 `http://localhost:3000`에 접속하여 Docsify 문서를 확인합니다.


---

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

각 파일 역할:

* **\_sidebar.md**: docs 내 사이드바 메뉴 구성
* **home.md**: Docsify 메인 페이지
* **examples.md**: C Runner 플러그인 예제
* **config.js**: API 엔드포인트, UI 옵션 등 플러그인 설정
* **docsify-c-runner.js**: 코드 실행, 토글, 복사 기능 구현
* **docsify-c-runner.css**: 버튼 및 출력창 스타일 정의
* **index.html**: Docsify 초기화 스크립트와 플러그인 로드

---

## 제목 필요.

기존 Docsify 프로젝트가 존재하거나, 이 프로젝트 예시가 마음에 들지 않는 경우를 위해 플러그인만 적용하는 방법을 설명드립니다.

`docsify-c-runner-plugin` 하위 파일들을 복사한 뒤 `index.html`에 스크립트와 스타일 시트를 로드하세요:

```html
<script src="{플러그인 파일의 위치}/docsify-c-runner.js"></script>
<link rel="stylesheet" href="{플러그인 파일의 위치}/docsify-c-runner.css">
```

---

# License

["MIT-0" License](./LICENSE)

자유롭게 수정 및 재배포 가능합니다.
