# ESlint 설치

## package.json

```json
// package.json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.56.0",
    "@typescript-eslint/parser": "^5.56.0",
    "@vitejs/plugin-react": "^3.1.0",
    "eslint": "^8.36.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "2.8.5",
    "vite-tsconfig-paths": "^4.2.0"
  }
}
```

## .eslintrc

### eslint의 format을 지정할 수 있는 파일이 있는데, 형식은 상황에 따라 다양하다.

- .eslintrc.json: JSON 형식으로 작성한다.
- .eslintrc.js: JavaScript 형식으로 작성하며, ESM를 지원하지 않지 때문에 ESM 사용시 .eslintrc.cjs로 작성해야 한다.
- .eslintrc.cjs: JavaScript 형식으로 작성하며, ESM를 지원한다. package.json에서 `type: module`을 설정해줬다면 .cjs로 작성하자.

```js
// .eslintrc.cjs
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  root: true,
  plugins: ["react", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es2022: true,
  },
  rules: {
    "@typescript-eslint/interface-name-prefix": "on",
    "@typescript-eslint/explicit-function-return-type": "on",
    "@typescript-eslint/explicit-module-boundary-types": "on",
    "@typescript-eslint/no-explicit-any": "on",
  },
};
```

## TypeScript 환경에서 ESLint 적용하기

[JavaScript ESLint](https://eslint.org/)와 [TypeScript ESLint](https://typescript-eslint.io/)는 적용 방식이 다르다.

- 수정 전 코드
  ```json
  // pakage.json
  {
    "devDependencies": {
      "eslint-config-airbnb-base": "^15.0.0",
      "eslint-config-prettier": "^8.7.0",
      "eslint-plugin-html": "^7.1.0",
      "eslint-plugin-import": "^2.27.5"
    }
  }
  ```
- 수정 코드
  ```json
  // pakage.json
  {
    "devDependencies": {
      "@typescript-eslint/eslint-plugin": "^5.56.0",
      "@typescript-eslint/parser": "^5.56.0",
      "typescript": "^4.9.5"
    }
  }
  ```

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "types": ["vite/client"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- `target`: ECMAScript의 버전을 결정함
- `module`: CommonJS와 ESModule 중 어떤 모듈 시스템을 지원할 건지 결정함

## vite.config.ts

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
  },
});
```

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
