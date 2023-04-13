# 🧨 트러블 슈팅

## useQuery 메서드 타입 할당

### 문제 원인 분석

현 애플리케이션의 경우 msw가 연결되기 전에 컴포넌트가 한번 마운트되고, msw가 연결되고 난 뒤 리마운트가 일어난다.

- msw가 연결되기 전 컴포넌트가 마운트되었을 경우, 서버에 HTTP 요청을 보내도 구축된 서버가 없기 때문에 요청이 failed되어 useQuery의 queryFunction이 반환하는 값은 Promise의 status가 rejected인 상태의 Promise 객체이다.
- msw가 연결되고 난 뒤 컴포넌트가 리마운트되었을 때는, 모의 서버 요청이 가능하기 때문에 정상적인 data를 응답 받아올 수 있다. 이때 useQuery의 queryFunction이 반환하는 GraphQL 쿼리 실행 결과의 값은 미리 선언해두었던 ProductsType 타입이다.

useQuery에 타입을 할당할 때는 두 가지 케이스를 모두 생각해서 작성해줘야 하는데, 처음에는 useQuery에 ProductsType만을 할당했기 때문에 Promise<unknown>과 충돌이 일어나 아래와 같은 에러 메세지를 띄운다.

- 기존 코드
  ```ts
  const { data } = useQuery<ProductsType>([QueryKeys.PRODUCTS], () =>
    graphqlFetcher(GET_PRODUCTS)
  );
  ```
- 에러 메세지
  ```
  No overload matches this call.
  The last overload gave the following error.
    Type 'Promise<unknown>' is not assignable to type 'ProductsType | Promise<ProductsType>'.
      Type 'Promise<unknown>' is not assignable to type 'Promise<ProductsType>'.
        Type 'unknown' is not assignable to type 'ProductsType'.ts(2769)
  types.d.ts(9, 89): The expected type comes from the return type of this signature.
  useQuery.d.ts(23, 25): The last overload is declared here.
  ```
    <img width="743" alt="스크린샷 2023-03-24 오후 4 31 55" src="https://user-images.githubusercontent.com/76897813/227454258-abc16ec6-ceb7-4bc4-b079-a93a96e8aff8.png">

### 문제 해결 방법

그렇다면 useQuery는 타입 할당을 어떻게 해줘야 할까?
알아보니 useQuery은 제너릭 타입 매개변수를 제공하기 때문에, 이를 이용하여 반환되는 데이터의 타입을 설정할 수 있다.

```ts
// https://github.com/TanStack/query/blob/main/packages/react-query/src/useQuery.ts
export function useQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
>(
  options: Omit<
    UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
    "initialData"
  > & { initialData?: () => undefined }
): UseQueryResult<TData, TError>;
```

- `TQueryFnData`: useQuery의 첫 번째 제너릭 타입 매개변수에 작성하는 값으로, useQuery 메서드의 두 번째 인수인 queryFunction이 반환하는 GraphQL 쿼리 실행 결과의 타입을 지정한다.
- `TError`: useQuery의 두 번째 제너릭 타입 매개변수에 작성하는 값으로, queryFunction의 error 형식을 지정한다.
- `TData`: useQuery의 세 번째 제너릭 타입 매개변수에 작성하는 값으로, queryFunction가 반환하는 값의 실질적인 data의 타입을 지정한다.
- `TQueryKey`: useQuery의 세 번째 제너릭 타입 매개변수에 작성하는 값으로, useQuery 메서드의 첫 번째 인수인 queryKey의 타입을 지정한다.

위 제너릭 타입을 사용하여 useQuery를 다시 설정해보면, 아래와 같다.

### 해결된 코드

```ts
const { data } = useQuery<Promise<unknown>, Error, ProductsType>(
  [QueryKeys.PRODUCTS],
  () => graphqlFetcher(GET_PRODUCTS)
);
```

이렇게 수정하면 useQuery의 첫번째 제너릭 타입 매개변수로 Promise<unknown>을 설정해 두었기 때문에 queryFunction이 Promise 객체를 반환하더라도 타입이 추론되고,
queryFunction이 반환한 값의 data가 정상적으로 들어올 때도 ProductsType으로 타입 추론이 가능하다.

## (미작성) MSW 래핑을 먼저 해줬는데 왜 MSW가 연결되기 전에 컴포넌트 마운트가 발생될까?

## selectorFamily와 useRecoilState에 대한 이해!

이번에는 selectorFamily와 useRecoilState에 대한 이해가 부족해서 코드 로직을 잘못 생각하고 있었던 것에 대해 작성하려 한다.

### 예시 코드

```ts
import { atom, selectorFamily, useRecoilState } from "recoil";

/** 장바구니 목록: [[ id, 개수 ]] */
export const cartState = atom<Map<string, number>>({
  key: "cartState",
  default: new Map(),
});

/**
 * get: 제품 id를 인수로 전달하면 장바구니 목록에서 해당 제품 뽑아오기
 * set: 제품 id를 인수로 전달하고 newValue로 장바구니에 담긴 개수 업데이트
 */
export const cartItemSelector = selectorFamily<number | undefined, string>({
  key: "cartItem",
  get:
    (id: string) =>
    ({ get }) => {
      const carts = get(cartState);
      return carts.get(id);
    },
  set:
    (id: string) =>
    ({ get, set }, newValue) => {
      if (typeof newValue === "number") {
        const newCart = new Map([...get(cartState)]);
        newCart.set(id, newValue);
        set(cartState, newCart);
      }
    },
});

const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector(id));
const addToCart = () => setCartAmount((prev) => (prev || 0) + 1);
```

### 문제 상황

위 코드에서 useRecoilState가 useState와 비슷한 동작을 한다는 것에 매몰되어 useRecoilState가 recoil state에 접근하고 관리하는 방식에 대해 이해하지 못했다.
처음 이해한, 즉 잘못 이해한 useRecoilState 메서드에 대한 해석은 아래와 같다.

1. cartItemSelector(id)는 cartItemSelector의 get 프로퍼티에 접근하여 cartState에서 id에 해당하는 상품 정보를 가져온다.
   - cartItemSelector(id)의 결과값: id에 해당하는 개수
2. useRecoilState는 state와 mutator를 가진 배열을 반환하는데, 이를 [cartAmount, setCartAmount] 이렇게 명명 짓는다.
   - cartItemSelector(id)의 결과값 대입: const [cartAmount, setCartAmount] = useRecoilState(개수)
3. useRecoilState를 호출할 때 defaultValue를 상품 id에 해당하는 개수를 넘겨줬기 때문에 cartAmount === 개수
4. addToCart를 호출하면 state인 cartAmount값을 변경하는 setCartAmount가 호출되어 cartAmout = cartAmount + 1이 된다.
5. Error... cartItemSelector의 set 프로퍼티는 언제 호출되는거지?

위와 같은 해석은 cartItemSelector의 set의 프로퍼티에 접근하는 로직이 존재하지 않는다. 처음에는 set 프로퍼티에 접근하지 않으면 cartState의 변경도 일어나지 않기 때문에 추가적인 코드를 작성해야 하는가 고민했다.
그러나 그저 해석에 오류가 있다는 것을 발견했다..

### 문제 원인 분석 및 해결

잘못 이해한 부분을 바로 잡아보자.

- cartItemSelector(id)는 cartItemSelector.get(id)가 아니다.
  -> selector의 get 프로퍼티의 반환값을 반환하는 것이 아니라 그 반환값을 get 프로퍼티로 가진 RecoilState을 반환한다.
- useRecoilState가 반환한 배열의 첫 번째 값인 cartAmount에는 cartState의 value에 작성된 값(원시값)이 할당되는 것이 아니라 RecoilState의 참조값을 할당한다.
  -> 즉, cartAmount를 변경하면 cartItemSelector의 set 프로퍼티에 접근하게 된다.

다시 해석해보면

1. cartItemSelector(id)는 cartItemSelector의 get 프로퍼티에 접근하여 cartState에서 id에 해당하는 상품 정보를 담은 RecoilState를 반환한다.
   - cartItemSelector(id)의 결과값: get 프로퍼티의 값이 id에 해당하는 값으로 변경된 cartItemSelector
2. useRecoilState는 state와 mutator를 가진 배열을 반환하는데, 이를 [cartAmount, setCartAmount] 이렇게 명명 짓는다.
   - cartItemSelector(id)의 결과값 대입: const [cartAmount, setCartAmount] = useRecoilState(cartItemSelector)
3. addToCart를 호출하면 setCartAmount가 state인 cartAmount값을 cartAmout = cartAmount + 1로 변경한다. 이는 cartItemSelector의 set 프로퍼티에 접근하게 된다.
   - cartAmount의 재할당된 cartAmount + 1은 set 프로퍼티의 newValue 매개변수에 할당되어 최종적으로 cartState의 값을 변경하게 된다.

## express server에서 `.ts`가 안읽힘

### 문제 상황

#### 에러 메세지

> TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for /Users/seonupark/Documents/dev/all-practice/clone-shopping-mall/shopping-mall/server/src/index.ts

### 문제 원인 분석

- 서버의 package.json을 세팅할 때 `.ts` 파일에서 `import/export` 구문(ESModule)을 사용하기 위해 package.json에서 `"type": "module"`을 설정해주었다.
  - nodejs는 CommonJS(CJS)와 ESModule(ESM) 시스템을 모두 지원하는데, 기본 지원은 CJS이기 때문에 ESM을 사용하기 위해서는 package.json `type`을 `module`로 설정해주어야 한다.
- Node는 typescript를 해석할 수 없기 때문에 `.ts` 확장자를 읽을 수 없다. 따라서 ts-node와 같은 Node 환경에서 사용하는 typescript 컴파일러가 필요하다.
  - ts-node는 node환경에서 typescript 파일을 CommonJS로 변환해준다.
  - [node가 일반적으로 제공하는 모듈 시스템이 CommonJS이기 때문에 ts-node 또한 별도의 설정이 없으면 CommonJS로 변환하는 것이다.](https://typestrong.org/ts-node/docs/imports#commonjs)
- 즉, node 환결 설정을 할 때 ESModule을 사용한다고 했는데 ts-node가 변환하는 파일 형태는 CommonJS이므로, node는 ts-node가 변경해준 CommonJS 파일을 무시하고 `.ts` 파일을 직접적으로 읽으려 시도하기 때문에 위와 같은 에러가 발생하는 것이다.
- 또한 TypeScript는 CommonJS와 ESModule 문법 모두 제공하기 때문에 ts-node가 ESModule의 문법인 `import/export` 구문으로 작성된 TypeScript 파일 또한 해석할 수 있다. 따라서 `"type"`을 `"module"`로 설정할 필요가 없다.

### 문제 해결

server 폴더의 package.json에서 `"type": "module"` 삭제하고, tsconfig.json에서 `compilerOptions`에 `"module": "CommonJS"`룰 추가한다.

```json
{
  "compilerOptions": {
    "module": "CommonJS"
  }
}
```

## commonjs에서는 Top-level `await`를 사용할 수 없음

### 문제 상황

#### 에러 메세지

> /Users/seonupark/Documents/dev/all-practice/clone-shopping-mall/shopping-mall/node_modules/ts-node/src/index.ts:859
>
> return new TSError(diagnosticText, diagnosticCodes, diagnostics);
>
> TSError: ⨯ Unable to compile TypeScript:
> src/index.ts:17:1 - error TS1378: Top-level 'await' expressions are only allowed when the 'module' option is set to 'es2022', 'esnext', 'system', 'node16', or 'nodenext', and the 'target' option is set to 'es2017' or higher.
>
> 17 <u>await</u> server.start;

- CommonJS 시스템을 사용하고 있는 node 환경에서 Top-level await를 사용했더니 위와 같은 에러 메시지가 떴다.

### 문제 원인 분석

- [Top-level `await`](https://github.com/tc39/proposal-top-level-await)는 모듈 환경, 즉 CommonJS가 아닌 ESModule 시스템에서만 지원된다.
  - Top-level `await`: 비동기 함수 외부에서 `await` 키워드를 사용할 수 있도록 하는 개념으로 top-level code에서 비동기 함수(`async`) 없이 `await`를 사용할 수 있다.
  - top-level code: 최상위 레벨의 코드, 즉 전역 스코프의 코드를 의미한다.

### 문제 해결

- `await` 키워드가 필요한 곳에 `async` 함수로 감싸준다.

### 그렇다면 CommonJS에서 Top-level `await`를 지원하지 않는 이유가 뭘까?

- CommonJS는 모듈 로딩을 동기적으로 수행하여, 모듈 로딩이 완료된 이후에만 해당 모듈의 코드를 실행할 수 있다. 이런 시스템에서 Top-level await를 사용하면 모듈이 로딩되기 전에 await 키워드가 실행되어 버리기 때문에 모듈 코드 실행 시점에서 해당 모듈이 완전히 로딩되지 않은 상태가 되는 문제가 발생된다.
- ESModule은 모듈을 비동기적으로 로딩하고, 모듈이 완전히 로딩되기 전가지 해당 모듈의 코드를 실행하지 않는다. 때문에 Top-level await를 지원할 수 있다.
