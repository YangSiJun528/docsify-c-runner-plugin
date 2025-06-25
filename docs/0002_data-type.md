# 자료형
- 기본 자료형 (총 7개)
- 대표적인 기본 자료형: `char`, `int`, `float`, `double`, `short int`, `long int`, `long double`
- 부호 식별자 키워드: 
    - 기본 자료형 앞에 `unsigned` 또는 `signed`를 붙일 수 있음  
    - `signed`는 생략 가능하지만 의미를 명확하게 하기 위해 사용됨 
        - 자료형, 컴파일러 구현에 따라 다르나 일반적으로 `char`를 제외하면 `signed`가 암시적 사용됨
    - 자세한 내용은 C89 문서 _6.52 Type specifiers_ 참고

## 표준에서 기본 자료형과 1 byte의 크기

- C 표준은 기본 자료형의 정확한 바이트 수를 강제하지 않고 컴파일러 구현에 맡김
    - 이식성을 위한 역사적 배경

- 1 byte는 `<limits.h>`의 `CHAR_BIT`만큼의 비트로 정의됨  
    - 즉, `char`의 비트 수 = `CHAR_BIT` = C에서의 1 byte
    - 컴파일러 환경에 따라 1 byte의 크기가 달라질 수 있음
        - 최근에는 거의 다 8bit를 기준으로 하지만, 임베디드 영역에선 여전히 1byte가 8bit가 아닐 수 있음.

- C 표준에 정의된 기본 자료형의 크기는 C89 표준 문서의 _5.2.4.2 Numerical limits_ 을 참고한다.
    - _5.2.4.2.1 Sizes of integral types <limits. h>_ 
    - _5.2.4.2.2 Characteristics of floating types <float. h>_ 

- [<limit.h>](https://pubs.opengroup.org/onlinepubs/009695399/basedefs/limits.h.html)
    - 구현에서 제공하는 기본 자료형을 포함한 여러 데이터의 범위를 표현한다.
    - C89는 `<limits.h>` 헤더를 통해 시스템별 데이터 타입의 한계를 제공해야 한다고 명시한다. 
        - `<limits.h>`의 정의된 매크로의 값은 Implementation-Defined Behavior (IdB) 이다.
    - 컴파일러, 빌드 환경에 의존적이므로 이식성을 위해선 이를 의존하지 않는게 좋다.
- [<float.h>]()
    - `<float.h>`는 부동소수점 관련 정보를 매크로로 제공하는 헤더
    - C89는 `<float.h>` 헤더를 통해 부동소수점 수의 정확도, 범위, 정수 기반 등을 제공해야 한다고 명시한다.
    - 다음 값을 포함한다. 
        - 표현 가능 지수 범위, 표현 가능 수의 범위, 정확도 및 표현 범위 관련 값, 반올림 모드 등
        - 부동소수점 자료형의 이름 별로 설명한다 FLT, DBL, LDBL이 있다.

### 실습 코드: 기본 자료형 크기 확인

```c,runnable
#include <stdio.h>
#include <limits.h>
#include <float.h>  // float 관련 상수

int main(void)
{
    // START_HIGHLIGHT
    printf("=== 기본 자료형 크기 확인 ===\n");
    printf("char 크기: %zu bytes\n", sizeof(char));
    printf("short 크기: %zu bytes\n", sizeof(short));
    printf("int 크기: %zu bytes\n", sizeof(int));
    printf("long 크기: %zu bytes\n", sizeof(long));
    printf("float 크기: %zu bytes\n", sizeof(float));
    printf("double 크기: %zu bytes\n", sizeof(double));
    printf("long double 크기: %zu bytes\n", sizeof(long double));

    printf("\n=== 1 byte 개념 ===\n");
    printf("CHAR_BIT (1 byte의 비트 수): %d\n", CHAR_BIT);

    printf("\n=== limits.h에서 정의된 값들 ===\n");
    printf("CHAR_MIN: %d\n", CHAR_MIN);
    printf("CHAR_MAX: %d\n", CHAR_MAX);
    printf("SCHAR_MIN: %d\n", SCHAR_MIN);
    printf("SCHAR_MAX: %d\n", SCHAR_MAX);
    printf("UCHAR_MAX: %u\n", UCHAR_MAX);
    printf("INT_MIN: %d\n", INT_MIN);
    printf("INT_MAX: %d\n", INT_MAX);
    printf("UINT_MAX: %u\n", UINT_MAX);
    printf("LONG_MIN: %ld\n", LONG_MIN);
    printf("LONG_MAX: %ld\n", LONG_MAX);
    printf("ULONG_MAX: %lu\n", ULONG_MAX);

    printf("\n=== float.h에서 정의된 값들 ===\n");
    printf("FLT_MIN: %e\n", FLT_MIN);
    printf("FLT_MAX: %e\n", FLT_MAX);
    printf("DBL_MIN: %e\n", DBL_MIN);
    printf("DBL_MAX: %e\n", DBL_MAX);
    // END_HIGHLIGHT

    return 0;
}
```

## char

- 기본 특성 및 최소 비트 수
    - `char`는 최소 8비트인 정수형
    - 실제 비트 수는 `<limits.h>`의 `CHAR_BIT` 매크로를 통해 확인할 수 있으며 컴파일러마다 다름

- 부호 지정 관련
    - `signed`/`unsigned` 키워드를 생략하면 표준에서는 어떤 키워드가 적용되는지 명시하지 않음 (IdB)
        - 예를 들어, clang의 Windows 버전에서는 기본적으로 `signed`로 처리됨
    - 문자 표시용으로 사용할 때는 큰 영향을 주지 않지만, 8비트 타입 정수형으로 사용할 경우 명시적으로 부호를 지정하는 것이 좋음
    - `<limits.h>`의 `CHAR_MIN` 매크로로 부호 지정 여부를 확인할 수 있음

- 포팅에 안전한 최소 범위 (C89 표준 최소)
    - `unsigned char`: 0 ~ 255  
    - `char` (부호 지정 없이): 0 ~ 127  
            - 0 ~ 127이라고 표준에서 말하진 않으나, 부호를 붙이지 않으면 실행 환경에 따라 어떤 부호 식별자가 붙을지 모르므로 이 범위를 사용하는게 안전하다.
    - `signed char`: -127 ~ 127  
    - 참고: 왜 -128가 아닌가?  
        - 이는 1의 보수 방식을 사용하는 오래된 기계와의 호환성을 위해, 표준에서는 -127까지만 지원하도록 규정되어 있다.
        - 1의 보수 방식은 +0과 -0 두 가지를 표현하기 때문에, 표현 가능한 음수의 개수가 2의 보수 방식보다 하나 적다.

- 범용 컴퓨터에서 사용 시
    - 임베디드 환경이나, 아주 오래된 환경의 이식성을 고려하지 않고, 일반적인 범용 컴퓨터를 대상으로 하는 경우 다음과 같이 가정해도 무방하다.
    - 대부분의 시스템에서 char는 8비트이며, 1의 보수를 사용해 음수를 표현한다. 부호 지정 키워드를 생략하면 보통 `signed`로 처리된다.
    - 범위:
        - `unsigned char`: 0 ~ 255
        - `signed char`: -128 ~ 127  

### 실습 코드: char 자료형

```c,runnable
#include <stdio.h>
#include <limits.h>

int main(void)
{
    // START_HIGHLIGHT
    printf("=== char 자료형 범위 확인 ===\n");
    printf("CHAR_MIN: %d\n", CHAR_MIN);
    printf("CHAR_MAX: %d\n", CHAR_MAX);
    printf("UCHAR_MAX: %d\n", UCHAR_MAX);
    
    printf("\n=== char의 부호 지정 여부 확인 ===\n");
    if (CHAR_MIN == 0) {
        printf("이 시스템에서 char는 unsigned입니다.\n");
    } else {
        printf("이 시스템에서 char는 signed입니다.\n");
    }
    
    printf("\n=== char 사용 예제 ===\n");
    char c1 = 'A';
    signed char c2 = -100;
    unsigned char c3 = 200;
    
    printf("char c1 = 'A': %c (ASCII: %d)\n", c1, c1);
    printf("signed char c2 = -100: %d\n", c2);
    printf("unsigned char c3 = 200: %d\n", c3);
    // END_HIGHLIGHT
    
    return 0;
}
```

## short
- 최소 16비트이고 `char`의 크기 이상인 정수형
- 부호 식별자를 정의하지 않으면 `signed`
- 포팅에 안전한 최소 범위 (C89 표준 최소)
    - `unsigned short`: 0~65535
    - `signed short, short`: -32767~32767
- 기본 정수형(int)보다 짦음
    - 메모리 사용을 줄이기 위해 사용되나, CPU의 기본 연산 단위보다 작아 추가적인 변환/로드/연산이 필요해 성능에 영향을 줄 수도 있음.
- 범용 컴퓨터에서 short의 사용
    - 크기: 16비트
    - 범위
        - `unsigned short`: 0~65535
        - `signed short, short`: -32768~32767

### 실습 코드: short 자료형

```c,runnable
#include <stdio.h>
#include <limits.h>

int main(void)
{
    // START_HIGHLIGHT
    printf("=== short 자료형 범위 ===\n");
    printf("SHRT_MIN: %d\n", SHRT_MIN);
    printf("SHRT_MAX: %d\n", SHRT_MAX);
    printf("USHRT_MAX: %u\n", USHRT_MAX);
    
    printf("\n=== short 사용 예제 ===\n");
    short s1 = 32000;
    unsigned short s2 = 65000;
    
    printf("short s1 = 32000: %d\n", s1);
    printf("unsigned short s2 = 65000: %u\n", s2);
    
    // 메모리 사용량 비교
    printf("\n=== 메모리 사용량 비교 ===\n");
    printf("short 배열 1000개: %zu bytes\n", sizeof(short) * 1000);
    printf("int 배열 1000개: %zu bytes\n", sizeof(int) * 1000);
    // END_HIGHLIGHT
    
    return 0;
}
```

## int

- 최소 16비트이며 `short`보다 크거나 같은 정수형
- int의 역사적 배경
    - CPU의 ALU가 사용하는 기본 데이터로, 흔히 'word'라고 하며 워드 크기는 CPU 레지스터 크기와 일치했음
    - CPU에 따라 `int`의 크기는 달라지나, 현대의 범용 컴퓨터에서는 보통 32비트로 구현됨
    - 현대의 범용 컴퓨터는 64비트인데, 왜 `int`는 여전히 32비트인가?
        - 역사적으로는 int가 CPU의 자연스러운 워드 크기와 일치하는 경우가 많았음
        - 예전에는 16비트 CPU가 흔해서 표준에선 최소 16비트로 정의함
        - 그 뒤에 32비트 컴퓨터가 나오면서 int의 크기는 32비트가 됨
        - 그러나 요즘엔 64비트 컴퓨터를 사용하는데, 그래도 int의 크기는 32비트에 머뭄
        - 사람들이 기대하던 전통적인 관습이 깨진 것
        - 너무 오랜 기간동안 int를 32비트로 사용해왔고, 다음 문제가 있었음
            - Java, C#, Swift 등 C 이후 언어들은 int를 32비트로 고정함.
            - int가 64라면 32, 16비트는 어떻게 표현하지? short와 int사이에 자료가 더 필요한가? 
            - 32비트에서 64비트로 바꾼다고 성능이 무조건 좋아지지 않음 (이유: 메모리 캐시, 메모리 낭비 등)
        - 요즘에는 기본적으로 int를 32비트로 쓰되, 더 큰수가 필요하면 더 큰 타입을 쓰는게 사실 상 표준
- 포팅에 안전한 최소 범위 (C89 표준 최소)
    - short와 같음
- 범용 컴퓨터에서 `int`의 사용
    - 크기: 32비트
    - 범위
        - `unsigned int`: 0 ~ 4294967295
        - `signed int`, `int`: -2147483648 ~ 2147483647
- 리터럴(literal) 
    - u 혹은 U: 부호 없는 수를 표현하는 접미사
        - 부호 있는 수의 최댓값보다 큰 값을 unsigned int에 대입할 경우 u 혹은 U를 붙여야 함
        - 필요한 상황에 안 붙이면 경고(warning) 발생

### 실습 코드: int 자료형

```c,runnable
#include <stdio.h>
#include <limits.h>

int main(void)
{
    // START_HIGHLIGHT
    printf("=== int 자료형 범위 ===\n");
    printf("INT_MIN: %d\n", INT_MIN);
    printf("INT_MAX: %d\n", INT_MAX);
    printf("UINT_MAX: %u\n", UINT_MAX);
    
    printf("\n=== int 사용 예제 ===\n");
    int i1 = 2147483647;
    unsigned int i2 = 4000000000U;  // U 접미사 사용
    
    printf("int i1 = 2147483647: %d\n", i1);
    printf("unsigned int i2 = 4000000000U: %u\n", i2);
    
    // 리터럴 접미사의 중요성
    unsigned int big_num = 3000000000;    // 경고 발생 가능
    unsigned int big_num2 = 3000000000U;  // 올바른 사용법
    printf("big_num (접미사 없음): %u\n", big_num);
    printf("big_num2 (U 접미사): %u\n", big_num2);
    // END_HIGHLIGHT
    
    return 0;
}
```

## long

- 최소 32비트이고 `int` 이상의 크기
- 포팅에 안전한 최소 범위 (C89 표준 최소)
    - `unsigned long`: 0 ~ 4294967295
    - `signed long`: -2147483647 ~ 2147483647
- 범용 컴퓨터에서 `long`의 사용
    - 대부분의 시스템에서 `long`은 32비트로 사용됨
        - 16비트 컴퓨터를 쓰던 시대의 잔재
    - 범위는 `int`와 같음
- 리터럴(literal)
    - l 혹은 L: long을 의미하는 접미사
    - u 혹은 U: 부호 없는 수를 표현하는 접미사
    - 둘 다 사용도 가능
    - 필요한 상황에 안 붙이면 경고(warning) 발생

### 실습 코드: long 자료형

```c,runnable
#include <stdio.h>
#include <limits.h>

int main(void)
{
    // START_HIGHLIGHT
    printf("=== long 자료형 범위 ===\n");
    printf("LONG_MIN: %ld\n", LONG_MIN);
    printf("LONG_MAX: %ld\n", LONG_MAX);
    printf("ULONG_MAX: %lu\n", ULONG_MAX);
    
    printf("\n=== int vs long 크기 비교 ===\n");
    printf("int 크기: %zu bytes\n", sizeof(int));
    printf("long 크기: %zu bytes\n", sizeof(long));
    
    if (sizeof(int) == sizeof(long)) {
        printf("이 시스템에서는 int와 long의 크기가 같습니다.\n");
    } else {
        printf("이 시스템에서는 int와 long의 크기가 다릅니다.\n");
    }
    
    printf("\n=== long 리터럴 사용 예제 ===\n");
    long l1 = 1000000000L;          // L 접미사
    unsigned long l2 = 3000000000UL; // UL 접미사
    
    printf("long l1 = 1000000000L: %ld\n", l1);
    printf("unsigned long l2 = 3000000000UL: %lu\n", l2);
    
    // 리터럴 접미사 비교
    printf("\n=== 리터럴 접미사의 중요성 ===\n");
    printf("2147483648 (접미사 없음): %ld\n", 2147483648);
    printf("2147483648L (L 접미사): %ld\n", 2147483648L);
    // END_HIGHLIGHT
    
    return 0;
}
```
    
## float

- `char` 이상의 부동소수점 표현 자료형
- `signed` / `unsigned` 구분 없음. 항상 부호를 가진다.
- 표준 상 IEEE 754를 따르지 않을 수 있으며 컴파일러 구현에 따라 다름
    - 이유 1: C는 IEEE 754를 지원하는 실수 계산 장치를 장착하기 전부터 쓰임
    - 이유 2:(현대 CPU와 달리) 실수 계산 장치가 없는 하드웨어에서도 돌아가야함
- 포팅에 안전한 최소 범위 (C89 표준 최소)
    - 유효 자릿수: 6 digits
    - 표현 지수 범위: 10^-37 ~ 10^38
- 범용 컴퓨터에서 `float`의 사용
    - 크기: 32비트
    - IEEE 754 Single과 동일
        - 유효 자릿수: 약 6~7 digits
        - 표현 지수 범위: 약 10^-38 ~ 10^38 
    - 자세한 IEEE 754는 별도 문서 참고 - 내가 정리해둔 노트 있음
- 리터럴
    - f 혹은 F: float를 의미하는 접미사

### 실습 코드: float 자료형

```c,runnable
#include <stdio.h>
#include <float.h>

int main(void)
{
    // START_HIGHLIGHT
    printf("=== float 자료형 특성 ===\n");
    printf("float 크기: %zu bytes\n", sizeof(float));
    printf("FLT_MIN: %e\n", FLT_MIN);
    printf("FLT_MAX: %e\n", FLT_MAX);
    printf("FLT_EPSILON: %e\n", FLT_EPSILON);
    printf("FLT_DIG (유효 자릿수): %d\n", FLT_DIG);
    
    printf("\n=== float 사용 예제 ===\n");
    float f1 = 3.14159f;      // f 접미사 사용
    float f2 = 1.23e-4f;      // 과학적 표기법
    float f3 = 123456.789f;   // 정밀도 한계 테스트
    
    printf("float f1 = 3.14159f: %f\n", f1);
    printf("float f2 = 1.23e-4f: %e\n", f2);
    printf("float f3 = 123456.789f: %.3f\n", f3);
    
    // float의 정밀도 한계 보여주기
    printf("\n=== float 정밀도 한계 ===\n");
    float precision_test = 0.1f + 0.2f;
    printf("0.1f + 0.2f = %.10f\n", precision_test);
    printf("정확히 0.3이 아님을 확인할 수 있습니다.\n");
    
    // 접미사 없이 사용했을 때와 비교
    printf("\n=== 접미사 사용의 중요성 ===\n");
    float no_suffix = 3.14159;   // double에서 float로 변환
    float with_suffix = 3.14159f; // 직접 float 리터럴
    printf("접미사 없음: %.10f\n", no_suffix);
    printf("f 접미사: %.10f\n", with_suffix);
    // END_HIGHLIGHT

    return 0;
}
```

## double

- `float`보다 정밀도가 높거나 같은 부동소수점 표현 자료형
    - C89 표준 최소 정밀도 10으로, `float`의 요구사항인 6보다 높다
    - 또한 문서에서도 `float` ≤ `double` ≤ `long double`으로, 부분집합 관계여야 한다고 명시되어있다. (크거나 같음)
- `signed` / `unsigned` 구분 없음. 항상 부호를 가진다.
- 표준 상 IEEE 754를 따르지 않을 수 있으며 컴파일러 구현에 따라 다름
- 포팅에 안전한 최소 범위 (C89 표준 최소)
    - 유효 자릿수: 15 digits
    - 표현 지수 범위: 10^-307 ~ 10^308
- 범용 컴퓨터에서 `long`의 사용
    - 크기: 64비트
    - IEEE 754 Double과 동일
        - 유효 자릿수: 약 15~17 digits
        - 표현 지수 범위: 약 10^-1022 ~ 10^1023
- 리터럴
    - 별도의 접미사가 필요 없음

### 실습 코드: double 자료형

```c,runnable
#include <stdio.h>
#include <float.h>

int main(void)
{
    // START_HIGHLIGHT
    printf("=== double 자료형 특성 ===\n");
    printf("double 크기: %zu bytes\n", sizeof(double));
    printf("DBL_MIN: %e\n", DBL_MIN);
    printf("DBL_MAX: %e\n", DBL_MAX);
    printf("DBL_EPSILON: %e\n", DBL_EPSILON);
    printf("DBL_DIG (유효 자릿수): %d\n", DBL_DIG);
    
    printf("\n=== float vs double 정밀도 비교 ===\n");
    float f_pi = 3.141592653589793f;
    double d_pi = 3.141592653589793;
    
    printf("float  π: %.15f\n", f_pi);
    printf("double π: %.15f\n", d_pi);
    
    // 정밀도 차이 비교
    printf("\n=== 정밀도 차이 비교 ===\n");
    float f_calc = 0.1f + 0.2f;
    double d_calc = 0.1 + 0.2;
    
    printf("float:  0.1f + 0.2f = %.17f\n", f_calc);
    printf("double: 0.1 + 0.2   = %.17f\n", d_calc);
    // END_HIGHLIGHT
    
    return 0;
}
```

### long double

- `double`보다 정밀도가 높거나 같은 부동소수점 표현 자료형
- `signed` / `unsigned` 구분 없음. 항상 부호를 가진다.
- 포팅에 안전한 최소 범위 (C89 표준 최소)
    - 유효 자릿수: 15 digits
    - 표현 지수 범위: 10^-307 ~ 10^308
- 범용 컴퓨터에서 `long double`의 사용
    - 최근 컴파일러마다도 달라서 IEEE 754 Double과 동일한 사이즈로 보는게 안전
    - 주로 3중 하나로 double과 동일하거나, Double Extended Precision, Quadruple Precision을 사용한다.
- 리터럴
    - L 또는 l

### 실습 코드: long double 자료형

```c,runnable
#include <stdio.h>
#include <float.h>

int main(void)
{
    // START_HIGHLIGHT
    printf("=== long double 자료형 특성 ===\n");
    printf("long double 크기: %zu bytes\n", sizeof(long double));
    printf("LDBL_DIG (유효 자릿수): %d\n", LDBL_DIG);
    
    printf("\n=== 실수 자료형 크기 비교 ===\n");
    printf("float 크기: %zu bytes\n", sizeof(float));
    printf("double 크기: %zu bytes\n", sizeof(double));
    printf("long double 크기: %zu bytes\n", sizeof(long double));
    
    if (sizeof(double) == sizeof(long double)) {
        printf("이 시스템에서는 double과 long double의 크기가 같습니다.\n");
    } else {
        printf("이 시스템에서는 double과 long double의 크기가 다릅니다.\n");
    }
    
    printf("\n=== long double 사용 예제 ===\n");
    long double ld_pi = 3.141592653589793238462643383279L;
    
    printf("long double π: %.20Lf\n", ld_pi);
    
    // 시스템마다 다른 long double 구현
    printf("\n=== 시스템별 long double 차이 ===\n");
    printf("long double의 실제 정밀도는 컴파일러와 시스템에 따라 다릅니다.\n");
    printf("일부 시스템에서는 double과 동일하고, 일부에서는 80비트 또는 128비트입니다.\n");
    // END_HIGHLIGHT
    
    return 0;
}
```

## 사용 시 주의사항: 이식성

- 범용 컴퓨터에서는 다른 언어와 비슷하게 사용 가능
    - 예외: long은 32비트
- 소형기기를 다룰 때는?
    - 매뉴얼에서 자료형 크기 확인 후 사용
- 여기저기 사용할 코드라면 - 코드 이식성 고려 필요
    - 포팅이 보장되는 범위의 값으로만 사용할 것
    - float/double은 플랫폼 사이에 값이 정확히 일치하지 않을 수 있음
        - IEEE 754의 비트패턴에 의존하는 것 같은 코드를 작성하는 등의 코드를 작성하면 안 됨
    - 정수형 자료들도 마찬가지, 구현에 의존적인 값을 사용하면 안됨

### 실습 코드: 자료형 이식성 확인

```c,runnable
#include <stdio.h>
#include <limits.h>
#include <float.h>

int main(void)
{
    // START_HIGHLIGHT
    printf("=== 자료형 이식성 검사 ===\n");
    
    // 정수형 최소 요구사항 확인
    printf("char는 최소 8비트여야 함: %s\n", 
           (sizeof(char) * 8 >= 8) ? "통과" : "실패");
    printf("short는 최소 16비트여야 함: %s\n", 
           (sizeof(short) * 8 >= 16) ? "통과" : "실패");
    printf("int는 최소 16비트여야 함: %s\n", 
           (sizeof(int) * 8 >= 16) ? "통과" : "실패");
    printf("long은 최소 32비트여야 함: %s\n", 
           (sizeof(long) * 8 >= 32) ? "통과" : "실패");
    
    // 크기 관계 확인
    printf("\n=== 자료형 크기 관계 확인 ===\n");
    printf("sizeof(char) <= sizeof(short): %s\n",
           (sizeof(char) <= sizeof(short)) ? "통과" : "실패");
    printf("sizeof(short) <= sizeof(int): %s\n",
           (sizeof(short) <= sizeof(int)) ? "통과" : "실패");
    printf("sizeof(int) <= sizeof(long): %s\n",
           (sizeof(int) <= sizeof(long)) ? "통과" : "실패");
    printf("sizeof(float) <= sizeof(double): %s\n",
           (sizeof(float) <= sizeof(double)) ? "통과" : "실패");
    printf("sizeof(double) <= sizeof(long double): %s\n",
           (sizeof(double) <= sizeof(long double)) ? "통과" : "실패");
    
    // 이식성을 위한 안전한 범위 사용 권장
    printf("\n=== 이식성을 위한 권장사항 ===\n");
    printf("char: -127 ~ 127 또는 0 ~ 255 범위 내에서 사용\n");
    printf("short: -32767 ~ 32767 범위 내에서 사용\n");
    printf("int: -32767 ~ 32767 범위 내에서 사용 (최소 보장)\n");
    printf("long: -2147483647 ~ 2147483647 범위 내에서 사용\n");
    // END_HIGHLIGHT
    
    return 0;
}
```

## bool과 enum

### bool

bool 자료형은 존재하지 않는다.
- C89에는 존재하지 않음.
- 대신 정수로 사용 가능. 0이면 false, 나머지는 true
- 하드웨어 친화적인 방식, 어셈블리어나 하드웨어에도 실제로 bool이 없고, 0이냐 아니냐를 확인하는 명령어만 있음. 
- C99에선 새로 들어옴. `<stdbool.h>`헤더 파일에서 가져올 수 있음.

- (POCU 강사 의견) 
    - 본인이 보기에는 좀 이상한 형태? - 정확히 이런 뉘양스는 아니였던거 같음.
    - 그러나 대부분의 C 프로그래머들은 bool을 사용하지 않음 
        - 이것도 임베디드 분야 아니면 요즘엔 많이 쓸 거같음, 근데 강사 실무 환경에선 안써서 이렇게 말 했겠지

### enum

열거형

- C에서 열거형은 그냥 정수에 별명 붙이는 수준
    - 고수준 언어에서 지원하는 타입형을 강제하는 기능이 없음
- 정의한 순서대로 `0,1,2...` 순으로 `int` 값이 할당됨
    - 할당 중간에 값을 바꿀수도 있고, 같은 `int` 값을 가지는 enum 요소를 만들 수도 있음.
    - (내 메모: https://modoocode.com/71 참고)
- 따라서 다음 연산이 가능: 
    - `int -> enum`, `enum -> int`, `enum -> enum`
    - 이로 인해서 실수할 가능성이 높음
    - int 값이 같은 enum 값이나, int와 비교하는 연산에서 의도하지 않게 동작할 가능성 있음.
- **POCU 코딩 표준**
    - enum의 이름을 값에 prefix로 붙여서 실수를 방지
    - e.g. `enum day { DAY_MONDAY, DAY_TUESDAY, ... }`

#### 실습 코드: 열거형

```c,runnable
enum dessert { 
    DESSERT_CAKE, /* 0 */
    DESSERT_BEER, /* 1 */
    DESSERT_CHOCOLATE, /* 2 */
    DESSERT_CANDY /* 3 */
};

int main(void)
{
    int lunch_dessert = DESSERT_CANDY;
    
    return 0;
}
```