# 설명

clone-shopping-mall 레포지토리에서 만들었던 shopping-mall을 강의 없이 새로 만들기.

# Trouble Shooting

## html 문서를 parsing 하지 못한다는 ESLint Error

Vite로 React + TypeScript 프로젝트를 생성하고 html 문서를 확인했을 때 발생하는 에러로, Vite에서 자동 설치해준 ESLint가 html 문서를 parsing하지 못한다는 에러를 띄우고 있다.

- 에러 메세지
  <img width="325" alt="스크린샷 2023-05-17 오후 2 47 44" src="https://github.com/parkseonup/react-router-tutorial/assets/76897813/eff0d8d6-dc64-443d-bd73-fa90275b3acd">

### 문제 원인 분석

ESLint는 기본적으로 JavaScript 코드를 분석하고 검사하기 위해 설계된 것으로 HTML 문서에서 발생하는 에러는 확인하지 못한다. HTML 문서의 인라인 스크립트 구문 분석을 위해서는 추가 설정이 필요하다.

### 문제 해결

참고: [eslint-plugin-html](https://www.npmjs.com/package/eslint-plugin-html#no-file-linted-when-running-eslint-on-a-directory)

1. package.json의 `devDependencies`에 `eslint-plugin-html` 설치
2. .eslintrc의 `plugins` 속성에 `"html"` 추가
