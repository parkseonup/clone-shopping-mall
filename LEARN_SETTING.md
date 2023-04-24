# (미작성) 환경 변수

## dotenv란?

[dotenv](https://github.com/motdotla/dotenv)

## process.env.NODE_ENV는 어떤 의미인가?

MSW의 application root에 browser integration을 적용할 때 예제에 작성된 `process.env.NODE_ENV`는 어떤 의미일까?

## vite에서 환경 변수 사용하기

vite에는 [env 환경변수](https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes)를 노출할 때 사용되는 문법이 따로 있다.

- vite는 dotenv를 활용하여 환경 디렉토리의 파일에 추가 환경 변수를 로드한다.

# 모노레포(monorepo)

- 참고 문서: [모던 프론트엔드 프로젝트 구성 기법 - 모노레포 개념 편 - Naver D2](https://d2.naver.com/helloworld/0923884)

## 모노레포의 등장 배경

1. 모놀리식 애플리케이션(Monolithic Application)의 한계

   - [모놀리식 애플리케이션](https://en.wikipedia.org/wiki/Monolithic_application)은 단일 서비스, 즉 모듈화 없이 하나의 서비스로 설계된 소프트웨어 애플리케이션을 말한다.
   - 고전적인 소프트웨어 개발 방식인 모놀리식 애플리케이션은 코드가 서로 직접적으로 의존하고 단 하나의 버전으로 관리되어 관심사의 분리가 어려워진다. 또한 설계, 리팩토링, 배포 등의 작업을 매번 거대한 단위로 처리해야 하기 때문에 비효율적이라는 한계가 있다.

2. 모듈식 프로그래밍(Modular Programing)의 한계

   - [모듈식 프로그래밍](https://en.wikipedia.org/wiki/Modular_programming)은 프로그램의 기능을 독립적이고 상호교환 가능한 모듈로 분리하는 것을 강조하는 소프트웨어 설계 기술이다.
   - 모놀리식 구조의 한계를 해결하는 하나의 방법으로, 애플리케이션 로직의 일부를 재사용할 수 있도록 지원하고 전체 교체 없이 애플리케이션의 일부를 수정 또는 교체할 수 있도록 하여 유지 보수에 용이하다.

3. 폴리레포(Polyrepo) 구조의 한계

   - 폴리레포(Polyrepo)는 각 프로젝트가 독립적인 하나의 레포지토리를 가져 소스 코드 버전 관리를 위해 다양한 레포지토리를 관리하는 시스템으로, 멀티레포(multirepo)라고도 불린다.
   - 모듈을 독자적으로 저장하기 위해 용이한 구조로, 작업의 자율성을 보장한다.
   - 한계
     - 번거로운 코드 공유: 레포지토리 간의 코드 공유를 하려면 공유를 위한 레포지토리를 생성하고 패키지 등 추가 설정이 필요하다.
     - 관리 포인트의 증가: 늘어나는 프로젝트 저장소의 수만큼 관리 포인트가 늘어난다.
     - 일관성 없는 개발자 경험: 각 프로젝트는 빌드, 테스트 등 각각의 고유한 명령 집합이 필요하다. 이는 여러 프로젝트에서 사용할 명령을 기억해야 하는 번거로움이 있다.

위와 같은 과정을 거쳐 모노레포 구조가 등장하게 되었다.

## 모노레포란?

- 모노레포란 버전 관리 시스템에서 두 개 이상의 프로젝트 코드가 동일한 저장소에 저장되는 소프트웨어 개발 전략

- `yarn`이나 `npm`의 `workspace`를 이용하면 간단하게 모노레포를 만들 수 있다. (이하 내용은 npm을 기준으로 작성)

## 모노레포 구현하기

### workspace

- [workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces)란 단일 root 패키지 내에서 로컬 파일 시스템의 여러 패키지를 관리를 지원하는 npm cli 기능의 집합으로, worktree를 지정할 수 있다.
- 즉, 두 개 이상의 프로젝트가 동일한 저장소에 저장되는 소프트웨어 개발 전략이다.
- root의 package.json에 작성된 `workspace` 속성에 작성된 패키지 name으로 중첩된 패키지임을 파악하고 관리할 수 있다.

#### 코드 예시

```json
// ./package.json
{
  "name": "my-workspaces-powered-project",
  "workspaces": ["workspace-a", "workspace-b"]
}
```

```json
// ./workspace-a/package.json
{
  "name": "workspace-a"
}
```

```json
// ./workspace-b/package.json
{
  "name": "workspace-b"
}
```
