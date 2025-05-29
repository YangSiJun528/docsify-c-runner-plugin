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

## 커맨드라인 인자 사용 예제

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

## 추가 예제 

### 팩토리얼 계산

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

### 시스템 명령어 호출

```c,runnable
#include <stdio.h>
#include <stdlib.h>

int main() {
    printf("현재 작업 디렉토리:\n");
    system("pwd");
    
    printf("\n디렉토리 내 파일 목록:\n");
    system("ls -al");

    return 0;
}
```

---

### 파일 읽고 쓰기

```c,runnable
#include <stdio.h>

int main() {
    FILE *fp;
    
    // 파일 쓰기
    fp = fopen("example.txt", "w");
    if (fp == NULL) {
        perror("파일 열기 실패");
        return 1;
    }
    fprintf(fp, "이 파일은 C 프로그램에 의해 생성되었습니다.\n");
    fprintf(fp, "두 번째 줄입니다.\n");
    fclose(fp);
    
    // 파일 읽기
    fp = fopen("example.txt", "r");
    if (fp == NULL) {
        perror("파일 읽기 실패");
        return 1;
    }
    
    char buffer[256];
    printf("파일 내용:\n");
    while (fgets(buffer, sizeof(buffer), fp)) {
        printf("%s", buffer);
    }
    fclose(fp);

    return 0;
}
```


### 커맨드라인 인자를 활용한 계산기

```c,runnable,args
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char *argv[]) {
    if (argc != 4) {
        printf("사용법: %s <숫자1> <연산자(+,-,*,/)> <숫자2>\n", argv[0]);
        return 1;
    }
    
    double num1 = atof(argv[1]);
    char op = argv[2][0];
    double num2 = atof(argv[3]);
    double result;
    
    switch (op) {
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            if (num2 == 0) {
                printf("오류: 0으로 나눌 수 없습니다.\n");
                return 1;
            }
            result = num1 / num2;
            break;
        default:
            printf("지원하지 않는 연산자입니다: %c\n", op);
            return 1;
    }
    
    printf("%.2f %c %.2f = %.2f\n", num1, op, num2, result);
    return 0;
}
```