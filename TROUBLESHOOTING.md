# 🧨 트러블 슈팅

## useQuery의 type 지정

useQuery를 사용하여 서버의 data를 받아올 때 type이 overload될 수 없다는 tslint 에러를 만났다.

- 기존 코드
  ```ts
  const { data } = useQuery<ProductsType>([QueryKeys.PRODUCTS], () =>
    graphqlFetcher(GET_PRODUCTS)
  );
  ```
- 에러 메세지
  <img width="494" alt="스크린샷 2023-04-21 오후 3 26 04" src="https://user-images.githubusercontent.com/76897813/233557400-38b489a5-4b36-4800-9027-444fe1ddc369.png">
  <img width="743" alt="스크린샷 2023-03-24 오후 4 31 55" src="https://user-images.githubusercontent.com/76897813/227454258-abc16ec6-ceb7-4bc4-b079-a93a96e8aff8.png">
  ```
  No overload matches this call.
  The last overload gave the following error.
    Type 'Promise<unknown>' is not assignable to type 'ProductsType | Promise<ProductsType>'.
      Type 'Promise<unknown>' is not assignable to type 'Promise<ProductsType>'.
        Type 'unknown' is not assignable to type 'ProductsType'.ts(2769)
  types.d.ts(9, 89): The expected type comes from the return type of this signature.
  useQuery.d.ts(23, 25): The last overload is declared here.
  ```

### 문제 원인 분석

현재 useQuery에 정의한 data의 타입은 queryFunction가 실행되었을 때 fetch API가 반환하는 Promise 객체의 status가 fulfiled 되어 기대한 데이터를 정상적으로 가져올 경우만을 고려하여 ProductsType으로 지정해주었다. 하지만, tslint에서는 fetch가 성공했을 때 뿐만 아니라 pending이나 rejected 상태 또한 발생되고 있으므로 Promise<unknown> 타입을 반환할 수 있다는 것을 알려준다. 따라서 ProductsType 뿐만 아니라 Promise<unknown>일 경우를 고려하여 타입을 지정해줘야 한다.

### 문제 해결 방법

에러를 일으키는 queryFunction의 타입을 지정해주는 방법은 두가지이다.

#### 1. useQuery 제너릭 타입 매개변수를 이용한다.

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

##### 해결된 코드

```ts
const { data } = useQuery<Promise<unknown>, Error, ProductsType>(
  [QueryKeys.PRODUCTS],
  () => graphqlFetcher(GET_PRODUCTS)
);
```

이렇게 수정하면 useQuery의 첫번째 제너릭 타입 매개변수로 Promise<unknown>을 설정해 두었기 때문에 queryFunction이 Promise 객체를 반환하더라도 타입이 추론되고,
queryFunction이 반환한 값의 data가 정상적으로 들어올 때도 ProductsType으로 타입 추론이 가능하다.

#### 2. queryFunction 선언부에 type을 지정해준다.

useQuery의 queryFunction이 호출하는 것은 data를 쉽게 fetch 할 수 있도록 작성된 custom Hook(이하 graphqlFetcher)이다. 이 방법은 graphqlFetcher를 호출하는 useQuery에 타입을 지정해주는 1번 방법과 달리 graphqlFetcher가 선언된 곳에 직접 타입을 지정해주어 해결할 수 있다.

##### 해결된 코드

```ts
const graphqlFetcher = async (
  query: RequestDocument,
  variables = {}
): Promise<any> => request(BASE_URL, query, variables);

const { data } = useQuery<ProductsType>([QueryKeys.PRODUCTS], () =>
  graphqlFetcher(GET_PRODUCTS)
);
```

이렇게 지정해주면 grapqlFetcher는 Promise를 반환한다는 것을 명확히 할 수 있고, useQuery는 queryFunction이 평가되어 반환하는 data의 값이 ProductsType이라는 추론이 가능하다.

#### 1번에서는 `Promise<unknown>`을 사용하고 2번에서는 `Promise<any>`를 사용한 이유

먼저, 두 타입의 특징은 아래와 같다.

- `Promise<unknown>`과 `Promise<any>`는 작성 당시 Promise 객체가 반환하는 값이 무엇인지 알 지 못한다는 것은 동일하다.
- `Promise<unknown>`는 `unknown`, 즉 "알 수 없는 값"을 반환하기 때문에 해당 값을 사용하려면 타입 캐스팅이나 타입 가드를 통한 타입 체크가 필요하다. 이는 타입 검사를 강제할 수 있으며, 런타임시 타입이 결정되기 때문에 안전하다.
- `Promise<any>`는 `any`, 즉 "어떤 값"을 반환하기 때문에 어떠한 값이 들어와도 된다. 이는 유연한 사용이 가능하다는 장점이 있지만, 타입 검사를 할 수 없어 예측 불가능한 결과를 초래할 수 있는 위험이 있다.

이러한 특징을 고려하고 보았을 때 내 생각의 흐름은 다음과 같았다.

1. 1번 방법은 가져올 데이터의 타입이 어떤 것인지 알 수 없지만, 1번 방법에 `Promise<any>`를 사용한다면 가져올 데이터에 대한 타입 체크가 되지 않기 때문에 위험할 수 있어 `Promise<unknown>`의 사용이 필요했고, TData 제너릭 매개변수에 ProductsType으로 명시적인 캐스팅 해주었기 때문에 `Promise<unknown>`의 사용이 가능하다.

2. 2번 방법은 graphqlFetcher가 custom hook이기 때문에 어떠한 데이터를 받아올 지 모르므로 `Promise<any>`나 `Promise<unknown>`의 지정이 필요한데, `Promise<unknown>`를 사용하면 타입을 강제하기 때문에 추후 graphqlFetcher 함수의 타입을 지정해줘야 하는 번거로움이 있다. 또한 useQuery의 queryFunction이 반환하는 값, 즉 data에 들어올 값이 ProductsType이라고 명시해두었기 때문에, fetch 함수에 직접적인 타입 명시가 필요없다고 생각되었다.

결과적으로 두 가지 방법 중 나는 두 번째 방법을 선택하여 코드를 구현했다. 모든 useQuery 문에 data의 타입을 지정했음에도 불구하고 `Promise<unknown>, Error`라는 코드를 추가로 작성하는 것은 번거로운 일이라고 판단했기 때문이다. TypeScript를 입문하는 단계이기 때문에 내 생각이 틀렸을 수 있다는 생각을 가지고 추후 더 많은 지식을 익히면 수정해나가야 겠다.

## selectorFamily와 useRecoilState에 대한 이해

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

## `path.resolve()`를 `__dirname`로 변경했을 때 올바른 경로를 읽어오지 못하는 에러 발생

`shopping-mall/server/src/dbController.ts`에서 db 위치를 읽어오기 위해 `basePath`를 뽑아올 때 `path.resolve()`를 사용했다가, `resolve()` 함수를 호출하지 않고 node에서 제공하는 전역변수 `__dirname`을 사용하는게 적은 비용을 사용한다고 생각해서 `__dirname`으로 로직을 변경했는데 경로를 올바르게 인지하지 못하는 문제가 발생했다.

```ts
import fs from "fs";
import { resolve } from "path";

enum DBField {
  PRODUCTS = "products",
}

const basePath = resolve(); // __dirname으로 바꾸기 전;

const filenames = {
  [DBField.PRODUCTS]: resolve(basePath, "src/db/products.json"),
};

const readDB = (target: DBField) => {
  try {
    return JSON.parse(fs.readFileSync(filenames[target], "utf-8"));
  } catch (err) {
    console.error(err);
  }
};

console.log(readDB(DBField.PRODUCTS));
```

`path.resolve()`를 사용한 코드는 위와 같으며, `readDB(DBField.PRODUCTS)`를 호출했을 때 `shopping-mall/server/src/db/products.json`에 작성된 데이터를 정상적으로 읽어왔다.
하지만, `const basePath = resolve()`를 `const basePath = __dirname`으로 변경하자 아래와 같은 에러 메세지를 띄웠다.

> Error: ENOENT: no such file or directory, open 'shopping-mall/server/src/src/db/products.json'

`__dirname`은 `path.resolve()`에서 읽어왔던 디렉토리 경로와 달리 `shopping-mall/server/src/src/db/products.json`를 출력한 것이다.

### 문제 원인 분석

그렇다면, 왜 `__dirname`와 `path.resolve()`는 서로 다른 경로를 제공하는걸까?

[Node API 문서](https://nodejs.org/api/)를 읽어보면

> `path.resolve()`: the current working directory is used.

인수를 전달하지 않은 `path.resolve`는 현재 작업 중인 디렉토리, 즉 명령어를 실행하거나 스크립트 파일이 위치하는 디렉토리를 반환하고,

> `__dirname`: The directory name of the current module.

`__dirname`은 현재 실행하고 있는(runnding) 디렉토리를 제공한다.

즉, 문제가 발생된 원인은는 애초부터 `__dirname`와 `path.resolve()`는 제공하는 디렉토리의 기준이 명확하게 달랐기 때문이다.

### 문제 해결

따라서, `__dirname`을 사용하기 위해서는 아래의 코드처럼 기존의 코드에서 참조할 정적파일 위치 또한 변경해줘야 문제를 해결할 수 있다.
(`__dirname`은 전역 변수 참조의 개념으로 `path.resolve()`는 변수에 저장하지 않으면 매 참조마다 메소드를 호출하는 코드 중복의 개념이 아니기 때문에 `basePath`라는 변수 선언을 생략했다.)

```ts
const filenames = {
  [DBField.PRODUCTS]: resolve(__dirname, "db/products.json"),
};
```

## delete mutation 요청시 query에 작성한 subField에 에러 발생

장바구니 상품 삭제 로직에서 GraphQL 에러가 발생했다. 에러를 일으킨 코드와 에러 메세지를 살펴보자.

- 기존 코드

  ```ts
  // server
  const cartSchema = gql`
    extend type Mutation {
      deleteCart(id: ID!): ID!
    }
  `;

  const cartResolver: Resolvers = {
    Mutation: {
      deleteCart: (parent, { id }, { db }) => {
        const newCart = db.cart.filter((cartItem) => cartItem.id !== id);
        db.cart = newCart;
        setJSON(db.cart);
        return id;
      },
    },
  };
  ```

  ```ts
  // client
  export const DELETE_CART = gql`
    mutation DELETE_CART($id: ID!) {
      deleteCart(id: $id) {
        id
      }
    }
  `;
  ```

- 에러 메세지

  > Error: Field "deleteCart" must not have a selection since type "ID!" has no subfields.: {"response":{"errors":[{"message":"Field \"deleteCart\" must not have a selection since type \"ID!\" has no subfields.","locations":[{"line":2,"column":23}],"extensions":{"code":"GRAPHQL_VALIDATION_FAILED","stacktrace":["GraphQLError: Field \"deleteCart\" must not have a selection since type \"ID!\" has no subfields.

  <img width="1442" alt="스크린샷 2023-04-21 오후 1 54 33" src="https://user-images.githubusercontent.com/76897813/233544054-49648cf9-d1a1-4498-b024-609fa0336583.png">

에러 메세지를 읽어보면 deleteCart는 ID! 타입을 반환하기 때문에 하위 필드를 가지면 안된다고 작성되어 있다.

### 문제 원인 분석

에러 메세지를 보고 찾아본 결과, 이 에러는 graphql의 field에 대해 잘못 이해하고 있었기 때문에 생긴 문제였다.

- ❌ 나는 graphql의 field에 작성하는 중괄호(`{}`)가 반환하는 값에 대해 열거하는 코드블럭이라고 생각했다.
- ⭕️ graphql의 field에 작성하는 중괄호(`{}`)는 코드블럭이 아닌 객체이며, 반환 받는 객체 내부에 포함된 field를 열거할 수 있다.

정리하면, 서버의 resolver에 작성한 deleteCart 필드가 반환하는 값은 객체가 아닌 ID(string) 타입의 id이며, 다른 field를 전달하지 않는다. 따라서 deleteCart 필드는 subField가 없어야 한다.

### 문제 해결

```ts
// client
export const DELETE_CART = gql`
  mutation DELETE_CART($id: ID!) {
    deleteCart(id: $id)
  }
`;
```

## `IntersectionObserver`의 isIntersecting이 true로 변하지 않는 문제

### 문제 원인 분석

무한스크롤은 `observe(targetElement)` 메서드의 `targetElement`로 전달한 `<div ref={fetchMoreRef} />`(이하 `targetElement`)와 root의 viewport가 교차했을 때 서버에 데이터를 요청하도록 구현했는데, 현재 `targetElement`의 `height`는 `0`이고 root viewport의 가장자리 끝점에 위치하고 있기 때문에 root의 viewport는 `targetElement`와 교차하는 임계점을 지나지 못한다.

### 문제 해결

viewport가 `targetElement`와 교차하는 지점을 지날 수 있도록 트릭을 사용하면 해결할 수 있다. 아래에 3가지 방법을 작성해두었다.

1. `IntersectionObserver`의 `rootMargin`을 확장한다.
2. `targetElement`의 `heigth`를 확장한다.
3. `targetElement`에 텍스트를 추가한다.

세 가지 방법 중 나는 1번 방법으로 해결하였다. 2, 3번은 `targetElement`의 layout을 직접적으로 변경하기 때문에 원하는 디자인으로의 구현이 어려울 수 있을 것이라 판단했다. 하지만, 1번은 root viewport의 교차 영역만 확장할 뿐 실제 layout에는 영향을 미치지 않고 무한 스크롤을 구현할 수 있다. 때문에 아래와 같은 코드로 `rootMargin` 값을 지정하여 임계점 문제를 해결했다.

```js
const ProductListPage = () => {
  // (생략...)

  observerRef.current = new IntersectionObserver(
    (entries) => {
      setIntersecting(entries.some((entry) => entry.isIntersecting));
    },
    { rootMargin: "1px" }
  );

  // (생략...)

  return (
    <div>
      // (생략...)
      <div ref={fetchMoreRef} />;
    </div>
  );
};
```
