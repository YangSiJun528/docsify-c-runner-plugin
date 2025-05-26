# Docsify C Runner Plugin 예제

이 문서에는 Docsify C Runner Plugin의 실제 코드 예제들만을 모아두었습니다. 

플러그인의 다양한 기능을 직접 확인해 보세요.

---

## 기본 예제

```c,runnable
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

---

## 하이라이트 예제

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

---

## 컴파일 실패 예제

```c,runnable
#include <stdio.h>

int main() {
    intt a = 0;
    return 0;
}
```

---

## 런타임 실패 예제

```c,runnable
#include <stdio.h>

int main() {
    int *p = NULL;
    *p = 5;
    return 0;
}
```

---

## 추가 예제 - 팩토리얼 계산

```c,runnable
#include <stdio.h>

// 팩토리얼 계산 함수
int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n-1);
}

int main() {
    int num = 5;
    
    // START_HIGHLIGHT
    printf("%d의 팩토리얼은 %d입니다.\n", num, factorial(num));
    // END_HIGHLIGHT
    
    // 1부터 10까지의 팩토리얼 출력
    printf("1부터 10까지의 팩토리얼:\n");
    for (int i = 1; i <= 10; i++) {
        printf("%2d! = %d\n", i, factorial(i));
    }
    
    return 0;
}
```
