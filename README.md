# 🧑🏻‍🏫 About clone-shopping-mall

## 강의 원본 코드

https://github.com/roy-jung/livecode-study_mall

## stack

react, react-query, react-router

## third-party api

vite-plugin-next-react-router

## fetch mock api

https://fakeapi.platzi.com/

# 🚀 React Router

## 현 프로젝트의 router

- 하위 경로에 있는 페이지들을 router로 제공하기 위해서는 react-router에서 제공하는 [`<Outlet>`](https://reactrouter.com/en/6.9.0/components/outlet) 컴포넌트를 사용해야 한다. 때문에 \_layout.tsx에서 `<Outlet />` 컴포넌트를 사용하는 Layout 함수 컴포넌트를 만든다.
- routes.tsx에서 `GlobalLayout`(=Layout)을 불러와 routes의 element로 전달하여 routes 구조를 만든다.
- 이를 프로젝트의 진입점 파일인 app.tsx의 `App` 함수 컴포넌트에서 [`useRoutes(routes)`](https://reactrouter.com/en/6.9.0/hooks/use-routes)를 호출하여 route 경로를 지정한다.

### routes.tsx는 어디서 나타난걸까?

- [vite-plugin-next-react-router](https://www.npmjs.com/package/vite-plugin-next-react-router)는 라우트 폴더 구조를 next와 동일하게 가져갈 수 있도록 도와주는 third-party library이다.
- vite.config.ts 파일에서 `defineConfig` 인수로 객체를 전달할 때 plugins 프로퍼티의 배열 내부에 `reactRouterPlugin()`을 전달하면 프로젝트 root 폴더에 routes.tsx 파일을 자동 생성해주며, route 경로에 해당하는 페이지들 또한 자동으로 routes.tsx 파일에 추가해준다.

# 🍴 JavaScript + React

### `React.lazy()`란?

routes.tsx에서 route 경로에 해당하는 페이지들을 import 받아올 때 `React.lazy()`를 이용하여 컴포넌트로 불러오는데, 그렇다면 [`React.lazy()`](https://react.dev/reference/react/lazy)는 뭘까?

- `lazy()`는 React에서 컴포넌트를 동적으로 로드하기 위해 사용하는 함수로, 코드 분할에 주로 사용된다.
  - 코드 분할(Code Splitting): 웹 애플리케이션의 초기 로딩 속도를 향상시키기 위해 번들 파일을 작은 조각으로 분할하고 필요한 코드 조각만 필요한 시점에 동적으로 로딩하는 기술.
  - ⚠️ ESModule에서는 코드 분할을 지원하고 있기 때문에 코드 분할을 위해서라면 lazy 함수를 사용할 필요가 없다. (때문에 추후 본 강의에서 vite-plugin-next-react-router를 사용하지 않고 route를 직접 구현할 때는 lazy 함수를 지웠다.)
- 작성 방법: `lazy(loadFunction)`
  - `loadFunction`: Promise 또는 thenable(Promise와 비슷한 역할을 하는 객체)를 반환하며, 매개변수는 작성할 수 없다.
    ```js
    // 예시
    const ProductPage = lazy(() => import("./src/product/index"));
    ```
- 컴포넌트 내부에서 lazy 함수를 호출하면 안된다. 리액트는 lazy 함수를 해당 컴포넌트가 필요한 순간 초기에 한번만 렌더링을 하도록 되어 있는데, 컴포넌트 내부에서 lazy 함수를 호출하면 state가 변경될 때마다 컴포넌트가 리렌더링되므로 좋지 않은 성능을 가져온다.
- lazy 함수를 [`<Suspense>`](https://react.dev/reference/react/Suspense)와 함께 작성하면 lazy 함수에 의해 지연 로드되는 컴포넌트가 로드되는 동안 Suspense 함수의 fallback 프로퍼티에 작성된 값을 출력해준다.
- 네트워크 상태에 따라 지연 로드는 에러를 발생시킬 수도 있다. 이럴 경우 [Error Boundaries(에러 경계)](https://ko.reactjs.org/docs/error-boundaries.html) 컴포넌트를 작성하여 에러가 예측되는 컴포넌트를 wrapping하면 에러가 애플리케이션의 동작을 멈추게 하는 것을 방지할 수 있다.

### `<Suspense>` 컴포넌트란?

- [`<Suspense>`](https://react.dev/reference/react/Suspense)는 `children` 컴포넌트가 로드를 완료할 때까지 `fallback` 프로퍼티에 작성된 대체 ui를 출력한다.
  ```js
  <Suspense fallback={<Loading />}>/* children */</Suspense>
  ```
  - `children`: 하위 컴포넌트 등 지연 로드를 포함하고 있는 실제 ui.
  - `fallback`: 로드되는 동안 대체 출력될 ui.
- children에서 보다 빠르게 로드되는 컴포넌트가 있더라도 chilren이 모두 로드될 때까지 ui는 변경되지 않는다.
  - 보다 빨리 로드되는 콘텐츠를 미리 공개하고, 모두 로드되어도 미리 공개되었던 콘텐츠를 숨기고 싶지 않다면 [startTransition](https://react.dev/reference/react/startTransition) 함수를 사용할 수 있다.
- `<Suspense>`가 중첩된 구조로 작성되었다면 지연 로드되는 컴포넌트의 가장 가까운 `<Suspense>`만 동작한다.
- fallback으로 전혀 다른 컴포넌트를 출력하는 것은 페이지가 로딩되는 중에 UI의 변경이 일어나기 때문에 사용자 경험을 떨어뜨리므로 사용을 지양해야 한다.
- 기능
  - 콘텐츠가 로드되는 동안 대체 표시 (스피너, 스켈레톤 등 손쉬운 구현)
  - 콘텐츠를 한 번에 공개
  - 로드될 때 중첩된 콘텐츠 표시
  - 새로운 콘텐츠가 로드되는 동안 오래된 콘텐츠 표시
  - 이미 공개된 콘텐츠가 숨겨지는 것을 방지
  - 전환이 일어나고 있음을 나타냅니다.
  - 내비게이션에서 서스펜스 경계 재설정
  - 서버 오류 및 서버 전용 콘텐츠에 대한 대체 제공

## URLSearchParams 란?

[URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) 인스턴스는 `new URLSearchParams()`의 반환값으로 URLSearchParams 호출시 인수로 전달한 key/value 쌍을 반복하여 쿼리 문자열을 쉽게 다룰 수 있도록 돕는다.

```ts
interface URLSearchParams {
  /** Appends a specified key/value pair as a new search parameter. */
  append(name: string, value: string): void;
  /** Deletes the given search parameter, and its associated value, from the list of all search parameters. */
  delete(name: string): void;
  /** Returns the first value associated to the given search parameter. */
  get(name: string): string | null;
  /** Returns all the values association with a given search parameter. */
  getAll(name: string): string[];
  /** Returns a Boolean indicating if such a search parameter exists. */
  has(name: string): boolean;
  /** Sets the value associated to a given search parameter to the given value. If there were several values, delete the others. */
  set(name: string, value: string): void;
  sort(): void;
  /** Returns a string containing a query string suitable for use in a URL. Does not include the question mark. */
  toString(): string;
  forEach(
    callbackfn: (value: string, key: string, parent: URLSearchParams) => void,
    thisArg?: any
  ): void;
}
```

# 📥 React Query

## 변경된 환경 설정

[Breaking change - React Query v4](https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4) 참고

- npm 설치 방법 변경

  - react-query package 이름이 변경되어 설치시 명령어와 import시 경로가 변경됨
  - devtools 사용을 원하면 package 설치를 해야 할 수 있게 변경됨

  ```shell
  #기존
  npm i react-query

  #현재
  npm i @tanstack/react-query
  npm i @tanstack/react-query-devtools
  ```

  ```ts
  // 기존
  import { useQuery } from "react-query";
  import { ReactQueryDevtools } from "react-query/devtools";

  // 현재
  import { useQuery } from "@tanstack/react-query";
  import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
  ```

## QueryClient란?

- react-query에서 제공하는 api로 캐시와 상호 작용하는 데 사용할 수 있다.
- query를 fetch 받거나 캐시하고 업데이트 하는 등 다양한 메서드를 가진 인스턴스를 반환하는 클래스로 만들어져 있어 new 연산자와 함께 호출할 수 있다.
- QueryClient를 호출할 때 인수에 객체를 전달하여 옵션값을 설정할 수 있다. (`queryCache`, `mutationCache`, `defaultOptions`)
  - `queryCache`
    - `queries`
      - `staleTime` (기본값: 0): 데이터가 캐시에 저장된 이후 다음 요청을 보낼 때까지 기다리는 시간(밀리초).
      - `cacheTime` (기본값: Infinity): 캐시에 저장된 데이터의 유효 시간(밀리초).
      - `refetchInterval` (기본값: false): 주기적으로 데이터를 다시 가져오는 시간(밀리초).
      - `refetchIntervalInBackground` (기본값: false): 창이 비활성화되었을 때에도 refetchInterval을 계속 실행할지 여부.
      - `refetchOnWindowFocus` (기본값: true): 창이 활성화되었을 때에도 refetchInterval을 계속 실행할지 여부.
      - `refetchOnMount` (기본값: true): 컴포넌트가 처음 마운트될 때마다 데이터를 다시 가져올지 여부.
      - `refetchOnReconnect` (기본값: true): 인터넷 연결이 다시 활성화될 때마다 데이터를 다시 가져올지 여부.
      - `retry` (기본값: 3): 요청이 실패할 경우 최대 재시도 횟수.
      - `retryDelay` (기본값: (attempt) => Math.min(1000 \* 2 \*\* attempt, 30000)): 재시도 간격을 계산하는 함수.
      - `retryOnMount` (기본값: true): 컴포넌트가 처음 마운트될 때마다 요청을 다시 시도할지 여부.
      - `retryOnWindowFocus` (기본값: true): 창이 활성화되었을 때에도 요청을 다시 시도할지 여부.
      - `suspense` (기본값: false): 컴포넌트가 데이터를 가져올 때까지 대기하는 대신, Suspense를 사용하여 로딩 상태를 처리할지 여부.
      - `useErrorBoundary` (기본값: false): ErrorBoundary를 사용하여 요청이 실패했을 때 에러를 처리할지 여부.
      - `queryFnParamsFilter` (기본값: undefined): 쿼리 함수에 전달되는 인수를 필터링하는 함수.
  - `mutationCache`
    - `mutations`
      - `mutateOptions` (기본값: {}): mutate() 함수에 전달되는 옵션.
      - `throwOnError` (기본값: false): 서버 오류 발생 시 예외를 던질지 여부.
      - `useErrorBoundary` (기본값: false): ErrorBoundary를 사용하여 요청이 실패했을 때 에러를 처리할지 여부.
  - `defaultOptions`
    - `queries`: queryKey에 대한 기본 옵션이다.
      - `staleTime` (기본값: 0): 데이터를 갱신하기 전에 만료되어야 하는 시간 (밀리초 단위)을 지정한다.
      - `cacheTime` (기본값: 0): 데이터를 캐시에 저장할 시간 (밀리초 단위)을 지정한다.
      - `retry` (기본값: true): 서버에서 오류가 발생하면 자동으로 재시도 여부를 지정한다.
      - `retryDelay` (기본값: attempt => Math.min(attempt _ 1000, 30 _ 1000)): 서버에서 오류가 발생한 후 재시도 간격을 지정한다.
      - `refetchOnWindowFocus` (기본값: true): 윈도우 포커스가 되면 새로고침 여부를 지정한다.
      - `refetchInterval` (기본값: false): 주기적으로 새로고침 할지 여부를 지정한다. 값이 false이면 주기적으로 새로고침하지 않는다. number 타입의 값이면 해당 값(밀리초)마다 주기적으로 새로고침 한다.
      - `queryFnParamsFilter` (기본값: params => params): queryFn에 전달될 매개 변수를 필터링하는 함수를 지정한다. 이를 사용하면 쿼리 함수에 필요한 매개 변수만 전달할 수 있다.
    - `mutations`: mutation에 대한 기본 옵션이다.
      - `retry` (기본값: true): 서버에서 오류가 발생하면 자동으로 재시도 여부를 지정한다.
      - `retryDelay` (기본값: attempt => Math.min(attempt _ 1000, 30 _ 1000)): 서버에서 오류가 발생한 후 재시도 간격을 지정한다.
      - `onError` (기본값: error => console.error(error)): 오류가 발생했을 때 호출할 함수를 지정한다.
- 각종 내장 메서드는 [`<QueryClient>`](https://tanstack.com/query/v4/docs/react/reference/QueryClient)에서 확인할 수 있다.

## QueryClientProvider란?

- [`<QueryClientProvider>`](https://tanstack.com/query/v4/docs/react/reference/QueryClientProvider)는 QueryClient 컴포넌트 provider로, 하위 클라이언트에게 QueryClient 컴포넌트를 JSX로 제공할 수 있다.
  - `client` (필수): 제공할 QueryClient의 인스턴스
  - `contextSharing` (기본값: false): context를 공유할 것인지를 선택하는 옵션

## useQuery란?

- [useQuery](https://tanstack.com/query/v4/docs/react/reference/useQuery)는 react-query에서 제공하는 api로, query를 서버로부터 GET 받을 때 사용한다.
- 작성 방법: `useQuery(queryKey, queryFunction)`
  - `queryKey`: query를 관리하는데 사용되는 unique key
    - `queryKey`의 type
      - ~~string: 하나의 string만을 작성할 수 있으며, useQuery 호출문을 해석할 때 내부적으로 인수가 하나만 담긴 배열로 해석한다. (`queryKey === ['PRODUCTS']`)~~ (v3까지는 제공했으나 쿼리 문자열은 필터 적용이 때때로 어렵기 때문에 v4에서는 배열로만 관리한다.)
      - (string, number, object)[]: query 데이터에 유니크한 정보가 더 필요한 경우 배열로 전달한다. 배열은 index를 가지므로, 이 경우 index가 중요하다.
      - ~~object: query 데이터에 유니크한 정보가 더 필요한 경우 배열로 전달한다. 배열과 달리 index가 없으므로, 프로퍼티의 순서는 중요하지 않다.~~
  - `queryFunction`: api 호출을 하는 promise 함수
- useQuery는 비동기로 동작한다.
- 반환값: `{ data, dataUpdatedAt, error, errorUpdateCount, errorUpdatedAt, failureCount, isError, isFetched, isFetchedAfterMount, isFetching, isIdle, isInitialLoading, isLoadingError, isPlaceholderData, isPreviousData, isRefetchError, isRefetching, isStale, isSuccess, refetch, remove, status }`

# 📐 TypeScript

## TypeScript 환경에서 ESLint 적용하기

- [JavaScript ESLint](https://eslint.org/)와 [TypeScript ESLint](https://typescript-eslint.io/)는 적용 방식이 다르다.
  - 삭제 코드
    ```json
    // pakage.json devdependencies
    "eslint-config-airbnb-base": "^15.0.0",
    "eslint-config-prettier": "^8.7.0",
    "eslint-plugin-html": "^7.1.0",
    "eslint-plugin-import": "^2.27.5",
    ```
  - 추가 코드
    ```json
    // pakage.json devdependencies
    "@typescript-eslint/eslint-plugin": "^5.56.0",
    "@typescript-eslint/parser": "^5.56.0",
    "typescript": "^4.9.5",
    ```
- eslint의 format을 지정할 수 있는 파일이 있는데, 형식은 상황에 따라 다양하다.
  - .eslintrc.json: JSON 형식으로 작성한다.
  - .eslintrc.js: JavaScript 형식으로 작성하며, ESM를 지원하지 않지 때문에 ESM 사용시 .eslintrc.cjs로 작성해야 한다.
  - .eslintrc.cjs: JavaScript 형식으로 작성하며, ESM를 지원한다. package.json에서 `type: module`을 설정해줬다면 .cjs로 작성하자.

## RequestInt 타입

RequestInit 인터페이스는 fetch() 함수를 호출할 때 전달할 수 있는 객체의 타입을 정의한다.
이 객체는 HTTP 요청을 구성하는 여러가지 속성을 가지고 있다.

- body (BodyInit | null): HTTP 요청 바디의 내용을 담는 BodyInt 타입의 객체이다. 이 속성은 생략 가능하며 생략할 경우 HTTP 요청에는 바디가 없음을 나타낸다.
- cache (RequestCache): HTTP 요청에 대한 캐시 처리 방법을 나타낸다. RequestCache 열거형 값 중 하나를 사용할 수 있다.
- credentials (RequestCredentials): HTTP 요청 시 함께 보낼 인증 정보를 나타내는 문자열이다. RequestCredentials 열거형 값 중 하나를 사용할 수 있다.
- headers (HeadersInit): HTTP 요청 헤더를 나타내는 HeadersInit 타입의 객체이다. 객체 리터럴, Headers 객체, 또는 두 항목 배열의 배열로 전달할 수 있다.
- integrity (string): 요청 리소스의 무결성을 나타내는 문자열이다. 대개 SHA-256 해시 값으로 표현된다
- keepalive (boolean): HTTP keep-alive 기능 사용 여부를 나타내는 불리언 값이다.
- method (string): HTTP 요청 메서드를 나타내는 문자열이다. 기본값은 "GET"이다.
- mode (RequestMode): HTTP 요청의 CORS 처리 여부를 나타내는 문자열이다. RequestMode 열거형 값 중 하나를 사용할 수 있다.
- redirect (RequestRedirect): HTTP 요청 중 리디렉션 처리 방법을 나타내는 문자열이다. RequestRedirect 열거형 값 중 하나를 사용할 수 있다.
- referrer (string): HTTP 요청에서 Referrer 정보를 나타내는 문자열이다. 보통 이전 페이지 URL을 전달한다.
- referrerPolicy (ReferrerPolicy): HTTP 요청에서 Referrer 정보의 전달 방법을 나타내는 문자열이다. ReferrerPolicy 열거형 값 중 하나를 사용할 수 있다.
- signal (AbortSignal | null): 요청을 취소할 수 있는 AbortSignal 객체를 나타낸다.
- window (null): HTTP 요청을 실행할 Window 객체이다. 일반적으로 null 값을 가집니다.

```ts
interface RequestInit {
  /** A BodyInit object or null to set request's body. */
  body?: BodyInit | null;
  /** A string indicating how the request will interact with the browser's cache to set request's cache. */
  cache?: RequestCache;
  /** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
  credentials?: RequestCredentials;
  /** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
  headers?: HeadersInit;
  /** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
  integrity?: string;
  /** A boolean to set request's keepalive. */
  keepalive?: boolean;
  /** A string to set request's method. */
  method?: string;
  /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
  mode?: RequestMode;
  /** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. */
  redirect?: RequestRedirect;
  /** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
  referrer?: string;
  /** A referrer policy to set request's referrerPolicy. */
  referrerPolicy?: ReferrerPolicy;
  /** An AbortSignal to set request's signal. */
  signal?: AbortSignal | null;
  /** Can only be null. Used to disassociate request from any Window. */
  window?: null;
}
```

# 📫 HTTP 통신

## `Access-Control-Allow-Origin`란?

src/queryClient.tsx에서 restfetcher 함수를 만들 때 fetchOptions의 body에 `Access-Control-Allow-Origin` 프로퍼티를 작성했다. `Access-Control-Allow-Origin`가 뭘까?

- HTTP 통신으로 웹사이트의 리소스에 접근할 때 도메인이 다를 경우 보안상의 이유로 서버 접근을 제한하는데, `Access-Control-Allow-Origin`는 이 권한을 다루는 HTTP 헤더이다.
- 이 헤더는 서버 응답에 포함되어 해당 리소스에 접근할 수 있는 도메인을 표시한다.
- 즉, `Access-Control-Allow-Origin` 헤더에 명시된 도메인과 웹 페이지의 호스트가 일치해야 리소스 접근이 가능하다.
- 프로퍼티 값 해석 방법
  - \*: 모든 도메인에서 접근 허용한다는 뜻으로, 서버는 모든 도메인에서의 요청에 대해 리소스에 대한 응답을 반환하다.
  - 특정 도메인명: Access-Control-Allow-Origin 헤더에 해당 도메인명이 포함되어 있으면, 해당 도메인에서만 접근이 허용된다.
  - null: 브라우저가 CORS 프로토콜을 지원하지 않는 경우, 해당 리소스에 접근할 수 있다. 이 경우, 서버는 Access-Control-Allow-Origin 헤더를 응답하지 않으며, 브라우저는 자동으로 null을 지정한다.

# 🤦🏻‍♀️ 잊어버린 개념 되새기기!

## HTTP 통신 메서드에 따른 요청 몸체(body) 유무

- GET, DELETE: body를 작성해서 서버에 요청을 넣어도 body값은 무시된다.
- POST, PUT, PATCH: body를 작성해야 하며, 값은 JSON 형태로 전달한다. (`JSON.stringify()` 사용)

# 👀 함께 읽으면 좋을 문서

- [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)
