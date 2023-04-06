# 💁🏻‍♀️ 이 페이지는?

강의를 들으면서 처음 접하거나 이해가 되지 않는 부분들이 있었기 때문에 추가 공부가 필요했다. 아래에 따로 공부한 것들을 간단하게 정리해보았다.

# 🔨 vite

## (미작성) vite에서 사용하는 환경 변수

vite에는 [env 환경변수](https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes)를 노출할 때 사용되는 문법이 따로 있다.

- vite는 dotenv를 활용하여 환경 디렉토리의 파일에 추가 환경 변수를 로드한다.

### (미작성) 환경 변수란?

### (미작성) dotenv란?

[dotenv](https://github.com/motdotla/dotenv)

### (미작성) process.env.NODE_ENV는 어떤 의미인가?

MSW의 application root에 browser integration을 적용할 때 예제에 작성된 `process.env.NODE_ENV`는 어떤 의미일까?

# 🍴 JavaScript + React

## `React.lazy()`란?

routes.tsx에서 route 경로에 해당하는 페이지들을 import 받아올 때 `React.lazy()`를 이용하여 컴포넌트로 불러오는데, 그렇다면 [`React.lazy()`](https://react.dev/reference/react/lazy)는 뭘까?

- `lazy()`는 React에서 컴포넌트를 동적으로 로드하기 위해 사용하는 함수로, 코드 분할에 주로 사용된다.
  - 코드 분할(Code Splitting): 웹 애플리케이션의 초기 로딩 속도를 향상시키기 위해 번들 파일을 작은 조각으로 분할하고 필요한 코드 조각만 필요한 시점에 동적으로 로딩하는 기술.
  - ⚠️ ESModule에서는 코드 분할을 지원하고 있기 때문에 코드 분할을 위해서라면 lazy 함수를 사용할 필요가 없다. (때문에 추후 본 강의에서 vite-plugin-next-react-router를 사용하지 않고 route를 직접 구현할 때는 lazy 함수를 지웠다.)
- 컴포넌트 내부에서 lazy 함수를 호출하면 안된다. 리액트는 lazy 함수를 해당 컴포넌트가 필요한 순간 초기에 한번만 렌더링을 하도록 되어 있는데, 컴포넌트 내부에서 lazy 함수를 호출하면 state가 변경될 때마다 컴포넌트가 리렌더링되므로 좋지 않은 성능을 가져온다.
- lazy 함수를 [`<Suspense>`](https://react.dev/reference/react/Suspense)와 함께 작성하면 lazy 함수에 의해 지연 로드되는 컴포넌트가 로드되는 동안 Suspense 함수의 fallback 프로퍼티에 작성된 값을 출력해준다.
- 네트워크 상태에 따라 지연 로드는 에러를 발생시킬 수도 있다. 이럴 경우 [Error Boundaries(에러 경계)](https://ko.reactjs.org/docs/error-boundaries.html) 컴포넌트를 작성하여 에러가 예측되는 컴포넌트를 wrapping하면 에러가 애플리케이션의 동작을 멈추게 하는 것을 방지할 수 있다.

### 작성 방법

```js
lazy(loadFunction);
```

- `loadFunction`: Promise 또는 thenable(Promise와 비슷한 역할을 하는 객체)를 반환하며, 매개변수는 작성할 수 없다.
- 예시
  ```js
  const ProductPage = lazy(() => import("./src/product/index"));
  ```

## `<Suspense>` 컴포넌트란?

- [`<Suspense>`](https://react.dev/reference/react/Suspense)는 `children` 컴포넌트가 로드를 완료할 때까지 `fallback` 프로퍼티에 작성된 대체 ui를 출력한다.
  ```js
  <Suspense fallback={<Loading />}>children */</Suspense>
  ```
  - `children`: 하위 컴포넌트 등 지연 로드를 포함하고 있는 실제 ui.
  - `fallback`: 로드되는 동안 대체 출력될 ui.
- children에서 보다 빠르게 로드되는 컴포넌트가 있더라도 chilren이 모두 로드될 때까지 ui는 변경되지 않는다.
  - 보다 빨리 로드되는 콘텐츠를 미리 공개하고, 모두 로드되어도 미리 공개되었던 콘텐츠를 숨기고 싶지 않다면 [startTransition](https://react.dev/reference/react/startTransition) 함수를 사용할 수 있다.
- `<Suspense>`가 중첩된 구조로 작성되었다면 지연 로드되는 컴포넌트의 가장 가까운 `<Suspense>`만 동작한다.
- fallback으로 전혀 다른 컴포넌트를 출력하는 것은 페이지가 로딩되는 중에 UI의 변경이 일어나기 때문에 사용자 경험을 떨어뜨리므로 사용을 지양해야 한다.

### 기능

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

## `createPotal`

```ts
export function createPortal(
  children: ReactNode,
  container: Element | DocumentFragment,
  key?: null | string
): ReactPortal;

createPortal(children, domNode);
```

- [`createPotal`](https://react.dev/reference/react-dom/createPortal)는 부모 컴포넌트의 DOM 계층 구조 밖에 있는 DOM 노드(`domNode`)로 `children`을 렌더링하는 [Potal](https://ko.reactjs.org/docs/portals.html)을 가능하게 하는 메서드이다. 즉, 부모 컴포넌트가 아닌 다른 곳에 `children`을 출력할 필요가 있을 때 사용하는 메서드이다. (예: modal)
- `children`에는 element, string, fragment 등 react가 렌더링할 수 있는 모든 요소를 전달할 수 있다.
- `domNode`는 `children`이 렌더링되는 DOM Element를 말하며, potal이 호출되기 전 `domNode`가 반드시 존재해야 한다.
- potal은 출력될 DOM(`children`)의 물리적 위치만 변경해주기 때문에 이벤트 전파 등은 React Tree 상의 위치를 따른다.
  - 즉, `children`은 출력되는 위치가 아닌 선언된 위치(부모 트리)에서 제공하는 컨텍스트를 공유한다.
  - 이는 부모 컴포넌트에서 `children`의 이벤트 전파를 감지하는 등의 관여가 가능함을 말하며, portal에 의존하지 않는 유연한 개발을 가능하게 한다.

## (미작성) `ref`의 매개변수

# 🚀 React Router

## 현 프로젝트의 router

- 하위 경로에 있는 페이지들을 router로 제공하기 위해서는 react-router에서 제공하는 [`<Outlet>`](https://reactrouter.com/en/6.9.0/components/outlet) 컴포넌트를 사용해야 한다. 때문에 \_layout.tsx에서 `<Outlet />` 컴포넌트를 사용하는 Layout 함수 컴포넌트를 만든다.
- routes.tsx에서 `GlobalLayout`(=Layout)을 불러와 routes의 element로 전달하여 routes 구조를 만든다.
- 이를 프로젝트의 진입점 파일인 app.tsx의 `App` 함수 컴포넌트에서 [`useRoutes(routes)`](https://reactrouter.com/en/6.9.0/hooks/use-routes)를 호출하여 route 경로를 지정한다.

### routes.tsx는 어디서 나타난걸까?

- [vite-plugin-next-react-router](https://www.npmjs.com/package/vite-plugin-next-react-router)는 라우트 폴더 구조를 next와 동일하게 가져갈 수 있도록 도와주는 third-party library이다.
- vite.config.ts 파일에서 `defineConfig` 인수로 객체를 전달할 때 plugins 프로퍼티의 배열 내부에 `reactRouterPlugin()`을 전달하면 프로젝트 root 폴더에 routes.tsx 파일을 자동 생성해주며, route 경로에 해당하는 페이지들 또한 자동으로 routes.tsx 파일에 추가해준다.

### (미작성) vite-plugin-next-react-router에서 제공하는 소스 분석해보기

## `<Link>` vs. `useNavigate` vs. `redirect`

### `<Link>`

- [`<Link>`](https://reactrouter.com/en/main/components/link)는 react-router에서 제공하는 컴포넌트로, 사용자의 액션으로 인한 페이지 이동을 위해 사용되며 브라우저에 출력시 `<a>` 태그로 변환되어 출력된다.
- 클릭시 바로 페이지 이동이 일어나는, 즉 `<a>` 태그와 동일한 역할을 하는 경우에 사용한다.
- `<a>`태그와 달리 상태값을 저장하고 이동할 페이지로 전달할 수 있다.

### `useNavigate`

```ts
declare function useNavigate(): NavigateFunction;

interface NavigateFunction {
  (
    to: To,
    options?: {
      replace?: boolean;
      state?: any;
      relative?: RelativeRoutingType;
    }
  ): void;
  (delta: number): void;
}
```

- [`useNavigate`](https://reactrouter.com/en/main/hooks/use-navigate)는 일반적인 페이지 이동이 아닌, 특정 이벤트가 발생했을 때 페이지 이동이 필요하거나 추가 로직이 필요할 경우 사용하는 hook이다.
- 반환값은 함수로, 전달하는 인수에 따라 동작하는 형태가 다르다.

  - 첫번째 인수에 페이지 이동 경로를 작성하면, 작성한 경로로 페이지 이동을 해주는 `<Link to={path}>`와 동일한 동작을 하며, 두 번째 인수에는 `replace`, `state` 등 부가 옵션을 전달할 수 있다.
    - [`replace`](https://stackoverflow.com/questions/72794430/what-does-usenavigate-replace-option-do)의 기본값은 `false`로, `true`를 전달하면 react-router는 이동할 url을 history에 새롭게 push 하는 대신 현재 history를 이동할 url로 replace한다. 때문에 `NavigateFunction`을 이용하여 페이지가 이동할 때 `replace: true`일 경우 뒤로 가기 버튼을 이용하여 기존의 페이지로 접근할 수 없다.
  - 첫번째 인수에 숫자를 전달하면 브라우저 history 이동이 가능하다. 예를 들어, 아래와 같이 useNavigate가 반환한 함수에 숫자 -1을 전달하면 브라우저의 뒤로 가기 버튼을 클릭한 것과 동일한 동작을 한다.

    ```js
    const navigate = useNavigate();

    navigate(-1);
    ```

### `redirect`

```ts
type RedirectFunction = (url: string, init?: number | ResponseInit) => Response;
```

- [`redirect`](https://reactrouter.com/en/main/fetch/redirect)은 loaders나 actions에서 서버의 응답을 반환 받아서 페이지 이동을 수행할 때 사용하는 함수이다.
- 따라서 리디렉션이 데이터에 대한 응답인 경우 `useNavigate` 대신 [loader](https://reactrouter.com/en/main/route/loader) 및 action 함수에서 `redirect`을 사용하는 것이 좋다.


# 📥 React Query

참고 문서: [[번역] #10: 리액트 쿼리는 상태 관리자다](https://parang.gatsbyjs.io/react/2022-react-11/)

- 캐시를 이용하여 서버 상태를 쉽게 관리할 수 있도록 도와주는 React 라이브러리
- 비동기 상태 관리자로, 어떤 형태의 비동기 상태도 관리할 수 있다. 대부분 data fetching을 통해 `Promise`를 반환 받고 있다.
- React Query는 데이터를 refetch 해오는 전략 지표를 제공한다. (`refetchOnMount`, `refetchOnWindowFocus`, `refetchOnReconnect` 등)
  - 자동으로 refetch 시점을 지정하는 것 외에 `queryClient.invalidateQueries`를 사용하면 수동으로 데이터를 무효화하는 할 수 있다.
- fetching 받은 데이터를

## React Query를 사용하기 전 서버 데이터는 아래와 같이 관리되었다.

1. 애플리케이션의 마운트 시점에 data를 fetch하고 전역 상태로 저장하여 모든 컴포넌트가 data를 참조할 수 있도록 한다.
   - 이 방법은 fetch된 데이터를 자주 업데이트 하기 어렵다.
   - 전역 상태가 너무 많은 것을 관리하고 있다는 단점이 있다.
2. data가 필요한 컴포넌트의 마운트 시점에 data를 fetch하고 지역 상태로 관리한다.
   - 컴포넌트가 자주 마운트될 경우 잦은 통신이 발생된다는 단점이 있다.

## React Query의 내부 동작

참고 문서: [Inside React Query 한글 번역](https://velog.io/@hyunjine/Inside-React-Query)

- 애플리케이션 시작시 `QueryClient`의 인스턴스를 생성하여 `QueryClientProvider`로 컴포넌트에 배부하면 React Query 라이브러리를 사용할 수 있다.
- `QueryClient`로 생성된 인스턴스는 `QueryCache`, `MutationCache`의 컨테이너로, `query`와 `mutation`을 조작하는 메서드와 캐시 작업이 가능하다.
  - 캐시(cache): 데이터를 미리 복사해놓는 임시 장소로, 캐시에 접근하는 시간에 비해 원본 데이터에 접근하는 시간이 오래 걸릴 경우 시간을 절약하기 위해 자주 사용하는 방법이다.
- `QueryCache`는 안정적이고 직렬화된 queryKeys(queryKeyHash) 버전의 key와 `Query` 클래스의 인스턴스이자 메모리 내 객체(in-memory object)인 value로 이뤄져있다.
  - React Query는 기본적으로 메모리에만 데이터를 저장하고 다른 곳에는 저장하지 않기 때문에 브라우저를 새로고침하면 캐시가 사라진다. 이를 원치 않으면 다른 외부 저장소에 저장하는 [`persistQueryClient`](https://tanstack.com/query/v4/docs/react/plugins/persistQueryClient)를 이용할 수 있다.
  - 캐시에는 쿼리들이 있는데 이 쿼리에서 대부분의 로직들이 실행된다. 여기에는 쿼리에 대한 모든 정보(데이터, 상태 필드, 마지막 fetching이 발생되었을 때 등의 메타 정보)와 쿼리 함수를 실행하고 재시도, 취소, 중복 제거를 하는 로직도 포함된다.
- `Query`는 `Observer`를 통해 누가 쿼리 데이터를 구독하고 있는지 알고, 해당 관찰자에게 모든 변경사항을 알릴 수 있다.
  - `Observer`는 `useQuery`를 호출할 때 생성되며 `useQuery`에 `queryKey`로 전달된 단 하나의 쿼리만을 구독한다. 즉, `Observer`는 `QueryCache`에 있는 `query`를 구독한다.
    - `Observer`는 `Query` 업데이트를 컴포넌트에게 알려야 하는지 결정한다.
    - `Observer`는 컴포넌트가 사용 중인 query의 속성들을 알고 있기 때문에 관련 없는 변경 사항을 알릴 필요가 없다. 예를 들어, 데이터 필드만 사용하는 경우 백그라운드 refetch에서 isFetching이 변경될 때 컴포넌트를 다시 렌더링할 필요가 없다. 이렇듯 `Observer`는 많은 작업을 수행하며, 대부분의 최적화가 이뤄지는 곳이기도 하다.
  - `Observer`가 없는 쿼리를 비활성 쿼리라고 한다. 이 쿼리는 여전히 캐시에 있지만 컴포넌트에서 사용되고 있지 않는 것을 말한다. React Query 개발 도구에서는 쿼리를 구독하고 있는 `Observer`의 개수를 표기하고, 비활성 쿼리의 경우 회색으로 표시해두었다.

![image](https://user-images.githubusercontent.com/76897813/229715185-1a5e3042-dbf9-43a2-add1-52eb5711956e.png)

## 환경 설정 (v4)

참고 문서: [Breaking change - React Query v4](https://tanstack.com/query/v4/docs/react/guides/migrating-to-react-query-4)

- react-query package 이름이 변경되어 설치시 명령어와 import시 경로가 변경됨

  ```shell
  #기존
  npm i react-query

  #현재
  npm i @tanstack/react-query
  ```

  ```ts
  // 기존
  import { useQuery } from "react-query";

  // 현재
  import { useQuery } from "@tanstack/react-query";
  ```

- devtools 사용을 원하면 package 설치를 해야 할 수 있게 변경됨

  ```shell
  npm i @tanstack/react-query-devtools
  ```

  ```ts
  // 기존
  import { ReactQueryDevtools } from "react-query/devtools";

  // 현재
  import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
  ```

## `QueryClient`란?

- react-query에서 제공하는 api로 캐시와 상호 작용하는 데 사용할 수 있으며, react query 라이브러리를 사용할 수 있는 진입점으로 볼 수 있다.
- `QueryCache`와 `MutationCache`의 컨테이너로, 모든 `query` 및 `mutation`에 대해 설정할 수 있는 몇 가지 기본값을 소유하고 있으며 캐시 작업을 위한 편리한 방법을 제공한다. (대부분의 경우 cache에 직접 접근하지 않고 `QueryClient`를 통해 접근한다.)
- query를 fetch 받거나 캐시하고 업데이트 하는 등 다양한 메서드를 가진 인스턴스를 반환하는 클래스로 만들어져 있어 new 연산자와 함께 호출할 수 있다.
- `QueryClientProvider`를 이용하면 React `Context`를 이용하여 애플리케이션에 `QueryClient`를 배부할 수 있다.

### options

QueryClient를 호출할 때 인수에 객체를 전달하여 옵션값을 설정할 수 있다. (`queryCache`, `mutationCache`, `defaultOptions`)

- `queryCache`
  - `queries`
    - `staleTime` (기본값: 0)
      - 데이터가 캐시에 저장된 이후 다음 요청을 보낼 때까지 기다리는 시간(밀리초).
      - 얼마나 지나야 데이터를 stale하다고 판단할 지 결정하는 옵션으로, 지정한 시간 전까지는 stale한 데이터가 아니다.
      - stale data: 신선하지 않은, 즉 업데이트가 필요한 데이터를 말한다. === 캐시가 만료된 데이터
      - `query`가 최신 상태인 데이터는 항상 캐시에서만 읽히며 네트워크 요청이 발생하지 않는다.
      - stale 데이터 또한 캐시에서 가지오지만, 특정조건에서 refetch가 일어날 수 있다.
    - `cacheTime` (기본값: Infinity)
      - 캐시에 저장된 데이터의 유효 시간(밀리초). 즉, 비활성 쿼리가 캐시에서 제거될 때까지의 시간이다.
      - `query`는 등록된 관찰자(`Observer`)가 없을 경우 데이터는 즉시 비활성 상태로 전환된다. 이때 해당 쿼리를 사용하는 모든 구성 요소는 언마운트(unmounted)된다.
      - `cacheTime`이 지나면 `query`는 가비지 컬렉터에 의해 삭제된다.
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

### method

#### `getQueryData()`

```js
const data = queryClient.getQueryData(queryKey);
```

- 기존 쿼리 데이터를 가져오는 데 사용할 수 있는 동기 함수로, 쿼리가 존재하지 않으면 `undefined`를 반환한다.
- 한번에 여러 쿼리 데이터를 가져오려면 `getQueriesData()`를 사용해야 한다.
- 옵션
  - `filters?: QueryFilters`: [Query filter](https://tanstack.com/query/v4/docs/react/guides/filters#query-filters)를 허용하는 프로퍼티
- 반환값: `data: TQueryFnData | undefined`

#### `setQueryData()`

```js
queryClient.setQueryData(queryKey, updater);
```

- `setQueryData()`는 비동기로 동작하는 `fetchQuery()`와 달리 쿼리의 캐시된 데이터를 즉시 업데이트하는데 사용할 수 있는 동기 함수로, 쿼리가 없으면 생성된다.
- 기본 `cacheTime` 5분 동안 Query Hook에서 쿼리를 사용하지 않으면 쿼리가 가비지 수집된다.
- 한번에 여러 쿼리를 업데이트하고 Query key를 부분적으로 일치시키려면 `setQueriesData()`를 사용해야 한다.
- `updater`가 `undefined`일 경우 쿼리 데이터는 업데이트되지 않는다.
- `setQueryData()` 내에서 `onSuccess`는 무한루프가 발생할 수 있기 때문에 호출할 수 없다. (v4 마이그레이션)
- `setQueryData()`는 순수해야 한다. 즉, 내부에서 `getQueryData()`를 호출하여 즉각적으로 값을 변경시키면 안된다.
- 옵션
  - `queryKey: QueryKey`: Query key
  - `updater: TQueryFnData | undefined | ((oldData: TQueryFnData | undefined) => TQueryFnData | undefined)`: updater로 함수가 아닌 값이 전달되면 해당 값으로 데이터가 업데이트되고, 함수가 전달되면 이전 데이터 값을 수신하고 새로운 값을 반환한다.

#### `cancelQueries()`

- 특정 querykey에 해당하는 다른 요청을 무시할 수 있도록 하는 api
- Optimistic Update에서 데이터 refetch를 취소하는데 유용하게 사용된다.

## QueryClientProvider란?

- [`<QueryClientProvider>`](https://tanstack.com/query/v4/docs/react/reference/QueryClientProvider)는 QueryClient 컴포넌트 provider로, 하위 클라이언트에게 QueryClient 컴포넌트를 JSX로 제공할 수 있다.
  - `client` (필수): 제공할 QueryClient의 인스턴스
  - `contextSharing` (기본값: false): context를 공유할 것인지를 선택하는 옵션

## useQuery란?

- [useQuery](https://tanstack.com/query/v4/docs/react/reference/useQuery)는 react-query에서 제공하는 api로, query를 서버로부터 GET 받을 때 사용한다.
- useQuery는 비동기로 동작한다.
- 쿼리는 자동으로 수행된다.
  - 종속성을 정의하지만, React Query는 즉각적인 쿼리 실행이나 업데이트가 필요하다고 판단되는 경우 자동으로 background update를 수행한다.
  - 백엔드의 실제 데이터와 화면에 표시되는 내용을 동기화 하는 것에 적합하다.
- React Query는 동시에 발생하는 `useQuery` 요청의 중복을 제거한다. 따라서 동일한 `QueryClientProvider` 내부에서 동일한 렌더 주기에 호출되는 동일한 data fetching은 무시되어 한번의 네트워크 요청만 일어난다.
- `queryKey`를 고유하게 식별하기 때문에 동일한 `QueryClientProvider` 내부에서 `useQuery()`를 사용하면 어떤 컴포넌트라도 동일한 data를 fetch 받을 수 있다.
  - 즉, 컴포넌트간의 상태를 공유할 수 있다.
  - 매번 `useQuery()` 하는 data fetch 함수에 접근하는 것보다 custom hooks를 만들어서 사용하는 것이 효율적이다.

### 작성 방법

```js
useQuery(queryKey, queryFunction);
```

- `queryKey: (string, number, object)[]`: `query`를 관리하는데 사용되는 unique key
- `queryFunction`: api 호출을 하는 promise 함수

## `useMutation`이란?

- [`useMutation`](https://tkdodo.eu/blog/mastering-mutations-in-react-query)은 `mutation` 상태를 추적하는 API로, 비동기로 동작한다.
- loading, error, status field를 제공하여 사용자에게 무슨 일이 일어나고 있는지 제공한다.
- `useQuery`의 콜백과 동일하게 `onSuccess`, `onError`, `onSettled`를 사용할 수 있다.
- `useQuery`와 달리 컴포넌트간의 상태를 공유하지 않으며, mutation(변형)이 자동으로 수행되지 않는다.
  - refetch되는 시점마다 mutation 데이터의 변경이 일어나면 안되기 때문 (ex, 브라우저 창에 초점을 맞출 때마다 새로운 todo가 생성됨)
  - mutation을 자동으로 수행하는 대신, 변형을 하고 싶을 때마다 호출할 수 있는 함수(`mutate`)를 제공한다.
- `useMutation`가 반환하는 `mutate`와 `mutateAsync`는 비슷하지만 `mutate`는 반환값이 없고, `mutateAsync`는 Promise를 반환한다는 차이가 있다.
  - 대부분의 경우 `mutate`를 사용하고 mutation의 응답에 접근해야 하는 경우에만 `mutateAsync`를 사용하는 것이 좋다.
  - `mutateAsync`는 promise 객체를 반환하기 때문에 `try/catch`나 `then/catch` 체이닝을 이용한 에러 핸들링이 가능하다.
- `useMutation`의 콜백은 `mutate`의 콜백 함수보다 먼저 실행되기 때문에 `useMutation`의 콜백에 UI와 관련된 로직을 실행한다면 `mutate`의 콜백이 실행되기 전에 컴포넌트가 언마운트 될 수 있다. 따라서 `useMutation`의 콜백에는 쿼리 무효화 등 필수적이고 논리적인 작업을 수행하고, `mutate`의 콜백에는 리다이렉트나 토스트 알림 같은 UI 관련 작업을 수행하는 것이 좋다.
  - custom hook을 사용할 때에도 콜백의 역할 분리가 잘 되어있으면 custom hook의 재사용성을 높일 수 있다.

#### options

- `onMutate?: (variables: unknown, mutation: Mutation) => Promise<unknown> | unknown`
  - mutation이 시작되기 전에 동기적으로 호출되는 함수로, 서버와의 통신 없이 이뤄진다.
  - `onMutate`에서 반환하는 값은 `onSuccess`, `onError`, `onSettled`의 매개변수 `context`로 전달된다.
- `onSuccess?: (data: unknown, variables: unknown, context: unknown, mutation: Mutation) => Promise<unknown> | unknown`: 일부 mutate가 성공하면 호출되는 함수로, mutate 이후 서버에서 반환하는 값이 첫번째 매개변수인 data로 들어온다.
- `onError?: (error: unknown, variables: unknown, context: unknown, mutation: Mutation) => Promise<unknown> | unknown`
  - 일부 mutate가 실패하면 호출되는 함수
  - Optimistic Update 구현시 `onMutate`에서 반환한 `context`를 이용하여 이전값으로 돌리는 롤백 로직을 구현할 수 있다.
- `onSettled?: (data: unknown | undefined, error: unknown | null, variables: unknown, context: unknown, mutation: Mutation) => Promise<unknown> | unknown`: 일부 mutate가 settled, 즉 성공이든 실패든 결과를 반환하면 호출되는 함수

### `useMutation`이 `query`에 대해 변경한 내용을 반영하는 방법

mutation은 query와 직접적으로 연결되지 않는다. 따라서 mutation이 query에 대해 변경한 내용을 반영하기 위해서는 2가지 방법이 필요하다.

#### [무효화(Invalidation)](https://tanstack.com/query/v4/docs/react/guides/query-invalidation)

- `invalidateQueries()`을 사용하여 기존의 데이터를 stale data로 변경하고 refetch 받는다.
- invalidateQueries 호출 결과
  1. 기존의 쿼리를 stale data로 변경한다.
  2. 해당 쿼리가 `useQuery`를 통해 렌더링되거나 비슷한 Hooks를 사용하고 있다면 데이터를 refetching한다.
- 클라이언트에서 사용자의 액션에 의해 어떤 데이터가 변경되면 서버 데이터를 동기화할 필요가 있는데, 이런 경우에 많이 사용한다.

#### 직접 업데이트

- `setQueryData()`를 사용하면 쿼리 캐시를 직접 업데이트 할 수 있다.
- `setQueryData()`를 통해 데이터를 직접 캐시에 넣으면 데이터가 서버에서 반환된 것처럼 동작하므로 해당 쿼리를 사용하는 모든 컴포넌트가 리렌더링된다.
- 서버에서 데이터를 fetch 받아오고 싶지 않을 때 사용하는 방법으로, mutation이 서버가 필요한 데이터를 모두 반환할 때 사용한다.
- 직접 업데이트는 서버의 데이터 구조가 변경되었을 위험이 있기 때문에 비교적 안전하지 않은 접근 방식일 수 있다.

#### 낙관적 업데이트(Optimistic Update)

- [Optimistic Update](https://tanstack.com/query/v4/docs/react/guides/optimistic-updates)는 사용자의 액션에 의해 특정 서버 데이터의 변경이 발생되었을 때, 실제 서버로부터 성공 응답을 받기 전에 성공할 것이라는 낙관적인 마인드로 성공했을 때의 데이터를 미리 화면에 구현한다.
  - 비관적 업데이트(Pessimistic Update): 일반적으로 사용되는 서버 통신으로, 사용자의 액션으로 서버 요청이 발생되고 응답을 받으면 UI가 업데이트 되는 로직이다.
- Optimistic Update는 보다 빠른 UI 업데이트로 사용자의 경험을 개선하고, 빠른 피드백을 제공할 수 있다는 장점이 있다.
- 서버의 응답이 성공적이지 않을 경우 이전 상태로 돌아가기 때문에 업데이트 롤백 로직을 함께 구현해야 한다는 번거로움이 있다.
- 서버에 데이터가 반영되기 전에 애플리케이션이 종료되거나 네트워크에 문제가 생긴다면 데이터 소실의 위험이 있으므로, 과도한 사용은 지양해야 한다.
- 주로, 좋아요 버튼 같은 가벼운 서버 통신에 사용된다.

##### 작성 방법

- `useMutation`의 `onMutate` 콜백을 이용하여 Optimistic Update를 제공하고, `onError`, `onSettled` 콜백을 이용하여 롤백 로직을 구현할 수 있다.
- [Optimistic Update 구현 시 데이터 꼬임 방지](https://velog.io/@mskwon/react-query-cancel-queries): `cancelQueries() 사용`
  - React Query가 제공하는 `refetchOnMount` 옵션의 기본값은 `true`이기 때문에, React Query는 컴포넌트가 마운트될 때 데이터를 최신으로 업데이트 해주기 위해 refetch를 한다. 이때 refetch 시점은 정확하게 알 수 없기 때문에 타이밍이 꼬이면 optimistic update 데이터가 먼저 보이고, 나중에 응답된 refetch 데이터(예전 데이터)가 이를 override 되어 화면에는 예전 데이터가 그대로 뿌려지는 현상이 일어날 수 있다. 이를 막기 위해서는 `cancelQueries()`를 이용하여 refetch를 취소해야 한다.
- Optimistic Update 구현 후 안정화 처리를 하는 방법
  - `onMutate` 내부에 구현한 로직은 변경 전 데이터를 기준으로 업데이트를 하고 UI에 출력한다. 이 작업은 서버와의 통신 없이 이뤄지기 때문에 서버의 최종 응답과 다른 결과를 보여줄 수 있어 안정화 처리가 필요하다.
  - 서버 데이터와의 동기화에 안정성을 주기 위해서는 `onMutate` 이후 `onSuccess` 콜백에 새로운 데이터로 캐시를 업데이트하는 작업이 필요하다.
  - `onSuccess` 콜백은 서버로부터 실제 응답을 받았을 때, 즉 Optimistic Update를 수행하고 난 뒤 서버와 동기화된 데이터를 사용하여 UI를 업데이트할 때 사용한다.
  - `onSuccess` 콜백을 사용하지 않고 `onMutate`만 작성했을 경우, 서버 응답이 실패한다면 UI와 실제 데이터가 동기화되지 않을 수 있다. 따라서 `onSuccess` 내부에 `setQueryData()`를 이용하여 새로운 데이터로 캐시를 업데이트 해주는 것이 좋다.

# 🧶 Recoil

참고 문서: [Recoil - 또 다른 React 상태 관리 라이브러리? - Toast UI](https://ui.toast.com/weekly-pick/ko_20200616)

- [Recoil](https://recoiljs.org/ko/)은 Facebook에서 만든 React를 위한 상태 관리 라이브러리로, npm을 이용하여 설치할 수 있다.

## (미작성) Recoil vs Context API vs Redux

### 참고 문서

- [recoil 공식문서](https://recoiljs.org/ko/docs/introduction/motivation/)
- [Recoil, 리액트의 상태관리 라이브러리](https://tech.osci.kr/2022/06/16/recoil-state-management-of-react/)
- [Recoil은 Context API를 어떻게 사용하길래 상태 변경이 일어나도 RecoilRoot의 자식 컴포넌트들에 대한 불필요한 리렌더링을 유발하지 않을까?](https://woomin.netlify.app/recoil-context-api-no-rerender/)
- [Redux, Context, or Recoil: Which One Is Best for Your Modern Web App?](https://betterprogramming.pub/redux-context-or-recoil-which-one-is-best-for-your-modern-web-app-db41be99b448)
- [Redux, Recoil, and React Context API: Choosing Your State Management Adventure!](https://medium.com/@davidkelley87/redux-recoil-and-react-context-api-choosing-your-state-management-adventure-67fb2355daa2)
- [React에서 상태관리하기 (feat. Context API, Redux, React Query)](https://mingule.tistory.com/74)

## API

### `<RecoilRoot>`

- [`<RecoilRoot>`](https://recoiljs.org/ko/docs/api-reference/core/RecoilRoot/)는 하위 컴포넌트에게 recoil 상태를 사용할 수 있도록 제공하는 컴포넌트이다.
- `<RecoilRoot>`는 recoil 상태를 공유하는 모든 컴포넌트들의 조상 컴포넌트여야 한다. -> 프로젝트의 root 컴포넌트에 제공하는 것이 효율적일 수 있다.
- 여러 개의 root가 같이 존재할 수 있으며 각각의 root는 별개의 상태를 가지지만, `<RecoilRoot>`가 여러 개 존재할 경우 상태 변경 사항이 다른 root와 공유되는 등 예기치 않은 동작이 발생할 수 있기 때문에 하나의 root만 사용할 것을 권장한다.
  - `selector` 캐시같은 캐시들은 root 사이에서 공유될 수 있다. 이는 `selector` 함수를 사용하는 다른 컴포넌트에서 이미 생성된 캐시를 사용할 수 있다는 성능 향상의 장점이 있지만, root를 공유할 수 있다는 예측 불가능성이 있다.
  - root들이 중첩된 구조로 작성되어 있다면 최하위의 root가 최상위의 root를 override 할 수 있다.

#### `<RecoilRoot>`의 `override` 속성

- 기본값은 `true`로, `override` 속성이 `true`일 경우 해당 root는 새로운 recoil scope를 생성한다.
- `override` 속성이 `false`일 경우
  - 일반적으로 `override` 속성을 `false`로 하는 것은 recoil에서 제공하는 디버깅 및 개발 도구가 비활성화되므로 권장되지 않는다.
  - 장점
    - Recoil 개발 도구는 Recoil의 상태 및 액션 로그를 브라우저 콘솔에 표시하는데, 베포 시 보안 이슈가 발생될 수 있다. 이럴 경우 `override` 속성을 `false`로 해서 recoil 개발 도구를 비활성화 할 수 있다.
  - 단점
    - 상태 변경 알림 없음: `atom` 또는 `selector`의 값이 변경될 때 개발자 도구에서 상태 변경 알림이 표시되지 않는다.
    - 디버깅 모드 제한: 개발자 도구에서 제공하는 상태 디버깅, 스냅샷 등의 기능이 제한된다.
    - 액션 로깅 제한: 개발자 도구에서 제공하는 액션 로깅 기능이 제한된다. (액션 로깅 기능을 사용하면 애플리케이션에서 발생하는 모든 상태 변경 작업이 로깅되므로 문제 해결에 도움이 된다.)
    - 성능 저하: 개발자 도구와 관련된 부가적인 작업이 수행되지 않기 때문에 일부 성능 저하가 발생될 수 있다.

#### `<RecoilRoot>`의 구조

```ts
export type RecoilRootProps =
  | {
      initializeState?: (mutableSnapshot: MutableSnapshot) => void;
      override?: true;
      children: React.ReactNode;
    }
  | {
      override: false;
      children: React.ReactNode;
    };

/**
 * Root component for managing Recoil state.  Most Recoil hooks should be
 * called from a component nested in a <RecoilRoot>
 */
export const RecoilRoot: React.FC<RecoilRootProps>;
```

### `atom`

- [`atom`](https://recoiljs.org/ko/docs/api-reference/core/atom)은 전역 상태로, 어떤 컴포넌트에서든 참조하고 사용할 수 있다.
- 컴포넌트가 `atom`을 참조하는 순간부터 컴포넌트는 `atom`을 구독하고 있는 것으로, `atom` 값이 변경되면 `atom`을 구독하고 있는 모든 컴포넌트는 리렌더링 된다.
- `atom`의 반환값 `RecoilState`이기 때문에 컴포넌트가 `atom`을 참조할 때는 `useRecoilState` 메서드를 사용하여 인수에 `atom`으로 선언된 state를 전달해야 한다.

#### `atom`의 구조

```ts
interface AtomOptionsWithoutDefault<T> {
  key: NodeKey;
  effects?: ReadonlyArray<AtomEffect<T>>;
  effects_UNSTABLE?: ReadonlyArray<AtomEffect<T>>;
  dangerouslyAllowMutability?: boolean;
}
interface AtomOptionsWithDefault<T> extends AtomOptionsWithoutDefault<T> {
  default: RecoilValue<T> | Promise<T> | Loadable<T> | WrappedValue<T> | T;
}
export type AtomOptions<T> =
  | AtomOptionsWithoutDefault<T>
  | AtomOptionsWithDefault<T>;

/** 기본 atom: RecoilState */
export function atom<T>(options: AtomOptions<T>): RecoilState<T>;

/** 단순히 값을 감싸는데 사용되는 atom: WrappedValue */
export namespace atom {
  function value<T>(value: T): WrappedValue<T>;
}
```

#### 작성 방법

```ts
import { atom, useRecoilState } from "recoil";

const atomState = atom<defaultValueType>({
  key: "uniqueKey",
  default: "initValue",
});

const [state, setState] = useRecoilState(atomState);
```

### `Selector`

- [`selector`](https://recoiljs.org/ko/docs/api-reference/core/selector)는 Derived state를 계산하는 데 사용되는 메서드로, 다른 `atom`이나 `selector`를 읽어들여 새로운 값을 계산하고 이 값을 다른 컴포넌트에서 사용할 수 있도록 해준다.
  - [Derived state](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html): 다른 상태(state)들로 계산해서 얻어내는 새로운 상태값으로, props와 의존성이 있는 state이다.
  - 주어진 종속성 값 집합에 대해 항상 동일한 값을 반환하는 순수함수라고 생각하면 된다.
- `selector`는 일반적인 상태값이 아닌, 읽기 전용(read-only)로 사용된다.
- `selector` 함수가 실행될 때 마다 `selector` 캐시가 생성되며 이 캐시는 메모리에 보관되어 재사용된다. 이는 `selector` 함수를 실행할 때마다 새로운 인스턴스를 만들 필요가 없어져 성능 향상에 도움이 된다.
- return 값이 `RecoilValueReadOnly`일 때 `selector` 값을 참조하기 위해서는 `useRecoilValue` 메서드를 사용해야 한다.

#### `selector`의 구조

```ts
export interface ReadOnlySelectorOptions<T> {
  key: string;
  get: (opts: {
    get: GetRecoilValue;
    getCallback: GetCallback;
  }) => Promise<T> | RecoilValue<T> | Loadable<T> | WrappedValue<T> | T;
  dangerouslyAllowMutability?: boolean;
  cachePolicy_UNSTABLE?: CachePolicyWithoutEquality;
}

/** 읽기 전용(get)으로 작성되었을 때의 반환값: RecoilValueReadOnly */
export function selector<T>(
  options: ReadOnlySelectorOptions<T>
): RecoilValueReadOnly<T>;

/** 읽기와 쓰기(get, set)가 모두 허용되었을 때의 반환값: RecoilState */
export function selector<T>(
  options: ReadWriteSelectorOptions<T>
): RecoilState<T>;

/** 단순히 값을 감싸는데 사용되는 반환값: WrappedValue */
export namespace selector {
  function value<T>(value: T): WrappedValue<T>;
}
```

#### 작성 방법

- `selector`의 인수로 `key` 프로퍼티와 `get` 메세드를 가진 객체를 전달한다.
- recoil의 `get` 메서드는 메서드 축약표현을 사용하지 않고 화살표 함수로 작성한다.
- `selector` 값을 참조하기 위해서는 `useRecoilValue` 메서드를 사용한다.

```js
import { selctor, useRecoilValue } from "recoil";

const mySelector = selector({
  key: "mySelector",
  get: ({ get }) => {
    const value1 = get(myAtom1);
    const value2 = get(myAtom2);

    return value1 + value2;
  },
});

export function Component() {
  const derivedValue = useRecoilValue(mySelector);
  return <div>derivedValue</div>;
}
```

### `selectorFamily` 메서드

- `selectorFamily` 메서드는 `key` 프로퍼티와 `get`, `set` 메서드를 가진 객체를 인수로 전달하면 `selector`를 반환하는 메서드이다.
- `selectorFamily`는 결과값이 `RecoilState`이기 때문에 `useRecoilState` 메서드를 이용하여 `selector`의 값을 참조해야 한다.
- `selectorFamily`는 인수 작성 타입이 `ReadWriteSelectorFamilyOptions`으로 `get`, `set` 프로퍼티를 작성할 때 `(param) => (options) => returnValue` 방식으로 작성한다.

#### `selectorFamily`의 구조

```ts
export interface ReadWriteSelectorFamilyOptions<
  T,
  P extends SerializableParam
> {
  key: string;
  get: (
    param: P
  ) => (opts: {
    get: GetRecoilValue;
    getCallback: GetCallback;
  }) => Promise<T> | Loadable<T> | WrappedValue<T> | RecoilValue<T> | T;
  set: (param: P) => (
    opts: {
      set: SetRecoilState;
      get: GetRecoilValue;
      reset: ResetRecoilState;
    },
    newValue: T | DefaultValue
  ) => void;
  cachePolicy_UNSTABLE?: CachePolicyWithoutEquality;
  dangerouslyAllowMutability?: boolean;
}

export function selectorFamily<T, P extends SerializableParam>(
  options: ReadWriteSelectorFamilyOptions<T, P>
): (param: P) => RecoilState<T>;
```

#### 작성 방법

```js
import { selectorFamily } from "recoil";

const mySelector = selectorFamily({
  key: "mySelector",
  get: ({ get }) => {
    // ...
  },
  set: ({ get, set }, newValue) => {
    // ...
  },
});
```

### (미작성) `useRecoilState()`

- 전역 상태인 `atom`에 접근하고 관리하기 위한 메서드 (읽고 쓰기가 가능)
- `atom`의 값을 구독하여 업데이트할 수 있는 hook으로, useState와 동일한 방식으로 사용할 수 있다.
- `atom`에 컴포넌트를 등록하는 hook이다.

### (미작성) `useRecoilValue()`

- setter 함수 없이 atom의 값을 반환한다. 즉, `atom`을 읽기만 할 때 사용한다.
- `atom`에 컴포넌트를 등록하는 hook이다.

### (미작성) `useSetRecoilState()`

- setter 함수만 반환한다. 즉, `atom`을 쓰기만 할 때 사용한다.

### (미작성) `useResetRecoilState()`

- atom을 초깃값으로 초기화할 때 사용한다.

### (미작성) `useRecoilCallback()`

- 컴포넌트를 atom에 등록하지 않고 값을 읽어야 하는 경우에 사용한다.

# 🌌 Mocking

## 참고 문서

- [Mocking으로 생산성까지 챙기는 FE 개발 - Kakao Tech](https://tech.kakao.com/2021/09/29/mocking-fe/)
- [Mocking으로 프론트엔드 DX를 높여보자 - 화해팀](https://yozm.wishket.com/magazine/detail/1711/)
- [MSW로 API 모킹하기 - 콴다 팀블로그](https://blog.mathpresso.com/msw%EB%A1%9C-api-%EB%AA%A8%ED%82%B9%ED%95%98%EA%B8%B0-2d8a803c3d5c)

## Mocking 이란?

애플리케이션을 만들 때 프론트엔드는 백엔드의 API를 활용이 필수적이었다.
때문에 백엔드의 구현이 끝나고 프론트의 개발이 시작되면 가장 이상적이겠지만, 생산성 측면에서 시간이 너무 많이 소요되는 단점이 있다.
따라서 생산하는 데 소요되는 시간을 줄이기 위해 백엔드와 프론트의 개발이 동시에 진행되는 경우가 즐비한데, 이때 사용할 수 있는 방법이 Mocking이다.

위키 백과에서는 Mock의 의미를 아래와 같이 정의했다.

> "**[모의 객체(Mock Object)](<(https://ko.wikipedia.org/wiki/%EB%AA%A8%EC%9D%98_%EA%B0%9D%EC%B2%B4)>)** 란 주로 객체 지향 프로그래밍으로 개발한 프로그램을 테스트 할 경우 테스트를 수행할 모듈과 연결되는 외부의 다른 서비스나 모듈들을 실제 사용하는 모듈을 사용하지 않고 실제의 모듈을 "흉내"내는 "가짜" 모듈을 작성하여 테스트의 효용성을 높이는데 사용하는 객체이다. 사용자 인터페이스(UI)나 데이터베이스 테스트 등과 같이 자동화된 테스트를 수행하기 어려운 때 널리 사용된다."
>
> - 데이터베이스 테스트 : 자료의 변경을 수반하는 데이터베이스에 대한 작업을 테스트 하는 경우 테스트 수행 후 매번 데이터베이스의 자료를 원래대로 돌려놔야 하는데 이럴 경우 모의 객체를 이용해 데이터베이스의 응답을 흉내내어 데이터의 변경 없이 테스트가 가능하다.

즉, 프론트엔드의 Mocking이란 백엔드 API에 대한 의존성을 낮추고자 **API가 필요한 시점에 실제 API가 아닌 모의 API를 구성하는 것**이다.

## Mocking하는 방법

1. 화면에 필요한 데이터 상태를 내부 로직에 직접 Mocking 작성

   - 장점: 구현이 쉬워 빠르게 적용할 수 있음
   - 단점: 실제 API가 들어올 때 애플리케이션의 서비스 로직을 다시 수정해야 하고, 실제 API의 흐름과 다를 경우가 있기 때문에 HTTP 메소드와 네트워크 응답 상태에 대응하기 어려움

2. Mock 서버를 별도로 구현

   - 장점: 애플리케이션의 서비스 로직을 수정하지 않아도 되고, HTTP 메소드와 네트워크 응답 상태에 대응할 수 있음
   - 단점: 서버를 구현해야 하고, 로컬이 아닌 다른 곳에 공유를 해야 한다면 추가 환경 구성 작업 등 비용과 공수가 많이 들어감.

3. Mocking 라이브러리 사용

강의에서는 3번을 방법을 채택하여, MSW(Mock Service Worker)와 GraphQl을 사용해서 Mocking을 구현했다.

# 💾 MSW(Mock Service Worker)란?

- [MSW](https://mswjs.io/)는 Service Worker를 통해 서버의 실제 네트워크 요청을 가로채서 모의 응답(Mocked response)을 보내주는 API Mocking library로, Mock 서버를 구축하지 않아도 API를 네트워크 수준에서 Mocking 할 수 있다.

## Service Worker API란?

- [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)는 웹 애플리케이션, 브라우저 및 네트워크(사용 가능한 경우) 사이에 있는 프록시 서버 역할로, 네트워크 요청을 가로채고, 네트워크 사용 가능 여부에 따라 적절한 조치를 취하고, 서버에 상주하는 자산을 업데이트하기 위한 API이다.
- 웹 애플리케이션의 메인 스레드와 분리된 별도의 백그라운드 스레드(worker context)에서 실행시킬 수 있는 기술로, DOM에 접근 권한이 없고 JavaScript와 다른 스레드에서 실행되어 UI Blocking 없이 연산을 처리할 수 있다. (MSW가 다른 라이브러리, 프레임워크에 종속적이지 않고 호환성 높게 작동하는 이유)
- 이벤트 기반의 작업자이며, 비동기식으로 설계되어 있음
- 주로 사용되는 곳
  - 백그라운드 동기화 기능
  - 푸시 메세지에 반응
  - 네트워크 요청을 가로채는 행위: Service Worker가 애플리케이션과 서버 사이에서 Request를 가로채 직접 Fetch에 대한 컨트롤을 할 수 있음 (HTTP Request, Response를 보고 캐싱 처리, 로깅 등)
- 사용이 제한되는 경우
  - IE와 같은 일부 브라우저
  - 중간에 네트워크 연결을 가로채고 조작할 수 있는 기능을 가졌기 때문에 보안상의 이유로 localhost가 아닌 환경이라면 HTTPS 보안 프로토콜 환경에서만 동작함 (FireFox 제외)

## MSW 동작 방식

1. App에서 Service Worker API 설치
2. Service Worker 설치 완료
3. App에서 Service Worker에 실제 요청을 전달
4. Service Worker가 실제 요청을 복사해서 MSW에 전달
5. MSW는 요청에 대한 모의 응답을 생성하여 Service Worker에 응답 제공
6. Service Worker가 최종적으로 App에 모의 응답 전달

## integrate를 browser로 설정할 때와 node 환경일 때의 차이

- Service Worker는 browser 환경에서만 동작한다. 따라서 browser 환경에서 사용하면 개발과 디버깅을 하기에 편리하다.
- node 환경에서서 사용하는 경우는 일반적으로 테스트 환경에서 사용할 때이며, Jest로 테스트가 가능하다.

## GraphQL을 이용한 MSW

### origin graphq 패키지가 아닌 `graphql-tag`, `graphql-request` 패키지를 사용하는 이유?

- `graphql-tag`: Apollo GraphQL 라이브러리에서 제공하는 패키지로, GraphQL 쿼리를 작성하는 데 사용된다. GraphQL 쿼리를 문자열로 작성하는 대신 태그된 템플릿 리터럴(`gql`)을 사용하여 쿼리를 작성할 수 있다. -> 코드 가독성을 높임
- `graphql-request`: 클라이언트에서 서버로 GraphQL 요청을 보내는 데 사용되는 패키지로, fetch API를 기반으로 작성되어 있으며 쿼리를 보내고 결과를 처리하는 데 사용되는 함수를 제공한다.
- 두 패키지의 위와 같은 특징으로 `graphql-tag`와 `graphql-request`를 함께 사용하면 GraphQL 쿼리를 작성하고 서버에 요청을 보내는 데 필요한 모든 기능을 사용할 수 있다.
- 다른 패키지를 사용하면 추가적인 설정과 구성이 필요할 수 있으며 MSW와 호환성이 보장되지 않을 수 있다.

### GraphQL로 API 작성하는 방법

MSW는 GraphQL API에 대한 요청을 캡쳐하기 위한 Request handlers(`query`, `mutation`)와 utilities(`operation`, `link`)를 제공한다. 이를 이용하여 클라이언트에서 서버 API를 호출할 때 가짜 응답을 반환할 수 있다.

#### Method

- 종류
  - `query()`: GraphQL query에 대한 가짜 응답을 반환하는 응답 핸들러로, `graphql.query(queryName, callbackFunction)`으로 작성한다.
  - `mutation()`: GraphQL mutation에 대한 가짜 응답을 반환하는 응답 핸들러로, `graphql.mutation(queryName, callbackFunction)`으로 작성한다.
- 인수 설명 (두 메서드 모두 공통됨)
  - `queryName`: 메서드를 호출할 때 첫 번째 인수로, 서버에서 정의한 GraphQL query name 또는 mutation name과 일치해야 한다.
  - `callbackFunction`: 메서드를 호출할 때 두 번째 인수로 전달되는 콜백 함수이다. 이 함수는 `req`, `res`, `ctx` 객체를 인자로 받아 `(req, res, ctx) => { return res( /* 내용 */ ) }`로 작성한다.
    - `req`: 요청 객체로, GraphQL query 또는 mutation, 변수 및 기타 메타데이터를 포함한다.
    - `res`: 응답 객체로, 클라이언트에 반환할 데이터를 설정하는 메서드를 포함한다.
    - `ctx`: 컨텍스트 객체로, 응답 객체 및 요청 객체를 조작하는 데 사용한다.

#### Utility

- `operation()`
  - GraphQL query를 파싱하고 해당 operation 타입을 식별하여 MSW 요청 핸들러를 등록하는 역할을 한다. 즉, `query()`, `mutation()` 등 모든 operation 타입을 처리할 수 있어 유연하다.
  - `graphql.operation(operationType, queryName, callbackFunction)`: 첫 번째 인수로 `operationType`을 추가 전달하는 것 외에는 다른 요청 핸들러와 작성 방법이 동일하다.
- `link()`

# 📜 GraphQL 이란?

참고 문서: [GraphQL 개념잡기 - 카카오 Tech](https://tech.kakao.com/2019/08/01/graphql-basic/)

- [GraphQL](https://graphql.org/)은 API를 쉽게 설계하고 호출하는 데 사용되는 쿼리 언어로, REST API를 대체하기 위한 목적으로 만들어졌다.
- 데이터베이스에 저장된 데이터를 효율적으로 가져오기 위한 언어인 sql과 달리 gql은 웹 클라이언트가 데이터를 서버로 부터 효율적으로 가져오는 것이 목적이다. 때문에 sql 문장은 백엔드에서 작성하고 호출하는 반변, gql 문장은 주로 클라이언트 시스템에서 작성하고 호출한다.
- 요청하는 쿼리문의 구조와 응답 내용의 구조가 거의 동일하다.

## GraphQL vs REST API

참고 문서: [GraphQL vs REST API - Apollo Blog](https://www.apollographql.com/blog/graphql/basics/graphql-vs-rest/)

- REST API는 url, method 등을 조합하기 때문에 다양한 EndPoint가 존재하지만, gql은 하나의 EndPoint만 존재한다. 또한 gql API는 불러오는 데이터의 종류를 쿼리 조합을 통해 결정한다.
  - EndPoint: 서버 요청을 구분해주는 url
  - 예시: REST API에서는 각 Endpoint마다 데이터베이스 SQL 쿼리가 달라지는 반면, gql API는 gql 스키마의 타입마다 데이터베이스 SQL 쿼리가 달라진다.
- REST API와 달리 클라이언트가 필요한 데이터만 요청할 수 있다.
  - 이는 데이터 전송 양을 줄이고, 클라이언트 측에서 필요한 처리를 수행할 수 있도록 도와준다.
  - 또한, 클라이언트가 여러 리소스를 병렬로 요청할 수 있어 서버에서 병목 현상이 발생하는 것을 방지할 수 있다.

## GraphQL을 사용하면 클라이언트가 여러 리소스를 병렬로 요청할 수 있는 이유?

GraphQL은 여러 필드를 가지는 단일 쿼리를 사용하면 클라이언트가 여러 리소스를 한번에 요청할 수 있다. 예시를 통해 살펴보자.

```graphql
// GraphQL 스키마

type User {
  id: ID!
  name: String!
  email: String!
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
}

type Query {
  posts: [Post!]!
  user(id: ID!): User!
}
```

위 예제와 같은 스키마에서 클라이언트는 `posts` 필드를 선택하여 모든 게시물과 해당 게시물의 작성자를 한 번에 요청할 수 있으며, `user` 필드를 선택하여 특정 사용자의 이름, 이메일, 사용자가 올린 모든 게시물을 요청 할 수 있다.

```graphql
// 여러 리소스를 요청할 수 있는 단일 쿼리

query {
  posts {
    id
    title
    author {
      name
    }
  }
  user(id: "123") {
    name
    email
    posts {
      title
    }
  }
}
```

위 쿼리는 여러 필드를 포함하고 있기 때문에 한번에 다양한 리소스를 요청할 수 있다. 더불어 위 쿼리에서 필요한 필드만 선택할 수도 있어 데이터를 효율적으로 가져올 수 있다.

## 스키마란?

- [스키마](<(https://graphql-kr.github.io/learn/schema/)>)는 GraphQL API가 제공하는 데이터 타입을 정의하는 구조체(structure)로, gql 쿼리의 진입점(EndPoint)이다.
- GraphQL은 스키마로 타입 시스템을 사용하여 데이터 모델을 정의한다.
  - GraphQL 쿼리에서 허용되는 모든 데이터 유형과 연결되어 있으며, 데이터를 읽기 위한 쿼리나 데이터를 수정하기 위한 뮤테이션 등을 정의한다.
  - 이는 클라이언트에게 API의 구조와 사용 가능한 쿼리에 대한 정보를 제공한다.
  - 클라이언트는 이 정보를 기반으로 요청을 작성할 수 있다.
  - GraphQL은 런타임에서 쿼리의 유효성을 검사하고, 표준화된 JSON 형식으로 결과를 반환한다.

## operation과 종류

- 클라이언트에서 서버로 전송되는 GraphQL 요청의 유형을 말하며, `query`, `mutation`, `subscription`이 있다.
  - [query](https://graphql.org/learn/schema/#the-query-and-mutation-types)란 서버에 데이터를 요청하는 데 사용하는 작업으로, REST API에서의 GET 메서드에 해당한다. (CRUD의 R)
  - [mutation](https://graphql.org/learn/queries/#mutations)이란 서버의 데이터를 수정하거나 생성하는 데 사용하는 작업으로, REST API에서의 POST, PATCH, DELETE 메서드에 해당한다. (CRUD의 CUD)
  - `subscription`: 데이터의 변경 사항을 구독하는 작업으로, 실시간 데이터를 가져올 수 있다.
- [operation](https://graphql.org/learn/queries/#operation-name)은 서버에서 요청하는 작업의 유형을 명확하게 나타내므로, 클라이언트와 서버 간의 통신을 효율적으로 만든다.

## graphql-request 패키지의 request 메서드란?

- request 메서드: GraphQL의 query나 mutation을 지정한 HTTP EndPoint(url)로 POST 요청(변경 가능)을 보내는 메서드이다.
- request 메서드는 Promise 객체를 반환하기 때문에 `then` 체이닝이나 `async/await`의 사용이 가능하다.
- request 메서드가 호출될 때 GraphQL에서는 query와 variables를 모두 JSON 형태로 변환하여 전달한다.

### 작성 방법

```js
request(url, query, variables);
```

- `url`: GraphQL의 EndPoint === 요청이 전송될 서버
- `query`: 서버에서 응답할 query 형태
- `variables`

  - 객체 형태로, `method`, `headers`, `body`를 포함할 수 있다.
  - `method`: 작성하지 않았을 경우 기본값은 POST이며, GET, PUT, PATCH, DELETE을 작성할 수 있다.
  - `body`: method, headers와 달리 body라는 이름의 프로퍼티를 작성하지 않고, body로 전달할 프로퍼티 key/value 쌍의 객체로 작성한다. -> GraphQL이 서버에 요청할 때 암묵적으로 객체 내용을 HTTP 요청 바디에 담는 과정을 거친다.
  - `variables`에 작성한 프로퍼티는 query문에서 `$`를 붙여 변수명으로 참조할 수 있다.

#### 예시

```ts
import { gql } from 'graphql-tag';
import { request } from 'graphql-request';

const query = gql`
  query GET_VALUE($id: string) {
    key1: value1,
    key2: value2,
  }
`;

const variables = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer MY_TOKEN',
  },
  { id: 'ID' },
};

request('/graphql', query, variables);
```

# 🪪 UUID

- [UUID(Universally Unique IDentifier, 범용 고유 식별자)](https://en.wikipedia.org/wiki/Universally_unique_identifier)는 네트워크 상에서 고유성을 보장하는 ID를 만들기 위한 표준 규약으로, GUID(Globally Unique IDentifier)라고도 불린다.
- UUID는 32개의 16진수 숫자가 하이픈(`-`)으로 구분된 5개의 그룹으로 표시되며, 총 36자에 대해 `8-4-4-4-12` 형식으로 표현된다.
  - 예시: `123e4567-e89b-12d3-a456-426614174000`
- 노드 환경에서는 UUID를 쉽게 생성할 수 있는 라이브러리를 제공하여, 손쉽게 설치하고 사용할 수 있다.

## uuid 라이브러리란?

UUID를 쉽게 생성할 수 있는 라이브러리이다.

### uuid 라이브러리 설치

- [uuid](https://www.npmjs.com/package/uuid) 설치
  ```shell
  npm i uuid
  ```
- TypeScript에서 uuid 라이브러리를 사용하려면 [uuid에 대한 타입 정의가 된 패키지](https://www.npmjs.com/package/@types/uuid)를 추가로 설치해야 한다.
  ```shell
  npm i --save @types/uuid
  ```

### 제공되는 API

```ts
export const NIL: NIL;
export const parse: parse;
export const stringify: stringify;
export const v1: v1;
export const v3: v3;
export const v4: v4;
export const v5: v5;
export const validate: validate;
export const version: version;
```

- `uuid.v1()`: 현재 시각을 기준으로 UUID를 생성하며, 이는 uuid가 생성된 시각과 MAC주소로 uuid를 유추할 수 있기 때문에 안전성이 떨어진다는 단점이 있다.
- `uuid.v3()`: MD5 해시 기준으로 UUID를 생성한다.
- `uuid.v4()`: 랜덤값을 기반으로 UUID를 생성하며, 많은 사람들이 주로 사용하는 버전이다.
- `uuid.v5()`: SHA-1 해시 기준으로 UUID를 생성한다.

### 사용 방법 예시

```js
import { v4 as uuidv4 } from "uuid"; // as는 import 받은 요소의 별칭을 정하는 것으로 다른 네이밍을 작성해도 된다. -> ex: { v4 as uuid }

const productItem = {
  id: uuidv4(), // import 받은 uuidv4 메서드를 호출하면 import 받은 버전에 맞는 UUID를 생성해준다.
};
```

### 한계

- 컴포넌트가 마운트될 때마다 uuid가 호출되어 uuid는 늘 새로운 id값을 반환하기 때문에 기존의 id값을 유지하기 어렵다. (예시: 상품 id를 이용하여 서버에 상품 정보를 GET 요청하는 로직이라면, 해당 페이지에서 새로고침을 했을 경우 uuid가 생성한 상품 id값이 변경되기 때문에 동일한 상품 id를 서버에서 찾지 못한다.)

# 📐 TypeScript

## TypeScript 환경에서 ESLint 적용하기

[JavaScript ESLint](https://eslint.org/)와 [TypeScript ESLint](https://typescript-eslint.io/)는 적용 방식이 다르다.

- 수정 전 코드
  ```json
  // pakage.json devdependencies
  "eslint-config-airbnb-base": "^15.0.0",
  "eslint-config-prettier": "^8.7.0",
  "eslint-plugin-html": "^7.1.0",
  "eslint-plugin-import": "^2.27.5",
  ```
- 수정 코드
  ```json
  // pakage.json devdependencies
  "@typescript-eslint/eslint-plugin": "^5.56.0",
  "@typescript-eslint/parser": "^5.56.0",
  "typescript": "^4.9.5",
  ```

### eslint의 format을 지정할 수 있는 파일이 있는데, 형식은 상황에 따라 다양하다.

- .eslintrc.json: JSON 형식으로 작성한다.
- .eslintrc.js: JavaScript 형식으로 작성하며, ESM를 지원하지 않지 때문에 ESM 사용시 .eslintrc.cjs로 작성해야 한다.
- .eslintrc.cjs: JavaScript 형식으로 작성하며, ESM를 지원한다. package.json에서 `type: module`을 설정해줬다면 .cjs로 작성하자.

## 문법

### (미작성) `as`란?

### (미작성) interface와 type의 차이

### `Pick<type, keys>`

- `type`에서 프로퍼티들을 뽑은 집합 `keys`를 선택하여 type 유형을 구성할 수 있다.
- `keys`는 `type`에 작성된 프로퍼티 키를 문자열로 작성하고 `|`를 이용하여 나열한다.

#### 예시

```ts
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

## 타입 유형

### RequestInt Type

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

### SyntheticEvent Type

[CartItem 컴포넌트](./shopping-mall/src/components/cart/item.tsx)에서 `input`의 `onChange` 이벤트가 발생했을 때, `input`에 작성된 amount 값을 읽기 위해 이벤트 핸들러 내부에서 이벤트를 일으킨 대상(`e.target`)을 참조해야 했다. 이때, 매개변수로 작성된 `e`의 타입을 `React.SyntheticEvent`으로 작성했는데 `SyntheticEvent`가 어떤 타입인지 내부를 살펴보자.

- `SyntheticEvent` 타입은 `BaseSyntheticEvent` 타입을 확장한 것으로, `BaseSyntheticEvent`에는 `currentTarget`, `target`, `preventDefault()` 등 이벤트 핸들러의 매개변수 `event`가 제공하는 프로퍼티와 메서드에 대한 타입이 정의되어 있다.

```ts
interface BaseSyntheticEvent<E = object, C = any, T = any> {
  nativeEvent: E;
  currentTarget: C;
  target: T;
  bubbles: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
  eventPhase: number;
  isTrusted: boolean;
  preventDefault(): void;
  isDefaultPrevented(): boolean;
  stopPropagation(): void;
  isPropagationStopped(): boolean;
  persist(): void;
  timeStamp: number;
  type: string;
}

/**
 * currentTarget - a reference to the element on which the event listener is registered.
 *
 * target - a reference to the element from which the event was originally dispatched.
 * This might be a child element to the element on which the event listener is registered.
 * If you thought this should be `EventTarget & T`, see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/11508#issuecomment-256045682
 */
interface SyntheticEvent<T = Element, E = Event>
  extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {}
```

# 📫 HTTP 통신

## `Access-Control-Allow-Origin`란?

src/queryClient.tsx에서 restfetcher 함수를 만들 때 fetchOptions의 body에 `Access-Control-Allow-Origin` 프로퍼티를 작성했다. `Access-Control-Allow-Origin`가 뭘까?

- HTTP 통신으로 웹사이트의 리소스에 접근할 때 도메인이 다를 경우 보안상의 이유로 서버 접근을 제한하는데, `Access-Control-Allow-Origin`는 이 권한을 다루는 HTTP 헤더이다.
- 이 헤더는 서버 응답에 포함되어 해당 리소스에 접근할 수 있는 도메인을 표시한다.
- 즉, `Access-Control-Allow-Origin` 헤더에 명시된 도메인과 웹 페이지의 호스트가 일치해야 리소스 접근이 가능하다.

### 프로퍼티 값 해석 방법

- \*: 모든 도메인에서 접근 허용한다는 뜻으로, 서버는 모든 도메인에서의 요청에 대해 리소스에 대한 응답을 반환하다.
- 특정 도메인명: Access-Control-Allow-Origin 헤더에 해당 도메인명이 포함되어 있으면, 해당 도메인에서만 접근이 허용된다.
- null: 브라우저가 CORS 프로토콜을 지원하지 않는 경우, 해당 리소스에 접근할 수 있다. 이 경우, 서버는 Access-Control-Allow-Origin 헤더를 응답하지 않으며, 브라우저는 자동으로 null을 지정한다.

# 🤦🏻‍♀️ 잊어버린 개념 되새기기!

## HTTP 통신 메서드에 따른 요청 몸체(body) 유무

- GET, DELETE: body를 작성해서 서버에 요청을 넣어도 body값은 무시된다.
- POST, PUT, PATCH: body를 작성해야 하며, 값은 JSON 형태로 전달한다. (`JSON.stringify()` 사용)

# 👀 함께 읽으면 좋을 문서

- [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)
- [모던 프론트엔드 테스트 전략 - 1편(Testing Overview) - 콴다 팀블로그](https://blog.mathpresso.com/%EB%AA%A8%EB%8D%98-%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%A0%84%EB%9E%B5-1%ED%8E%B8-841e87a613b2)
- [Inside React Query](https://tkdodo.eu/blog/inside-react-query)
- [My구독의 React Query 전환기 - Kakao Tech](https://tech.kakao.com/2022/06/13/react-query/)
- [카카오페이 프론트엔드 개발자들이 React Query를 선택한 이유 - Kakao Tech](https://tech.kakaopay.com/post/react-query-1/)
- [[React Query] useQuery 동작원리(1)](https://www.timegambit.com/blog/digging/react-query/01)
