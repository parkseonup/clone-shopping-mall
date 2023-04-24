## (미작성) 모노레포(monorepo)

### 참고 문서

- [모던 프론트엔드 프로젝트 구성 기법 - 모노레포 도구 편 - Naver D2](https://d2.naver.com/helloworld/7553804)
- [모던 프론트엔드 프로젝트 구성 기법 - 모노레포 개념 편 - Naver D2](https://d2.naver.com/helloworld/0923884)

### 모노레포란?

- 모노레포란 모노레포란 버전 관리 시스템에서 두 개 이상의 프로젝트 코드가 동일한 저장소에 저장되는 소프트웨어 개발 전략
- `yarn`이나 `npm`의 `workspace`를 이용하면 간단하게 모노레포를 만들 수 있다. (이하 내용은 npm을 기준으로 작성)

### workspace

- [workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces)란 단일 root 패키지 내에서 로컬 파일 시스템의 여러 패키지를 관리를 지원하는 npm cli 기능의 집합이다.
- root의 package.json에 작성된 `workspace` 속성에 작성된 패키지 name으로 중첩된 패키지임을 파악하고 관리할 수 있다.

### setting

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
