# 🧾 설명

clone-shopping-mall 레포지토리에서 만들었던 shopping-mall을 강의 없이 새로 만들면서 다양한 시도 해보기.

## 강의와 다른 점

- Styled Component를 사용하여 css 적용
- ItemData 컴포넌트를 product, cart, admin에 공통으로 사용할 수 있도록 변경.
- Infinite scroll
  - IntersectionObserver 사용하는 커스텀 훅 구조 변경: IntersectionObserver 생성자 호출하는 구조와 비슷하게 변경.
  - 강의에서는 관찰자의 isIntersecting을 상태로 등록하여 useEffect의 의존성 배열에 담고 isIntersecting 결과에 따라 fetch 함수를 호출하도록 함 -> observer에서 isIntersecting의 결과에 따라 직접 fetch 함수를 호출하도록 함.
- Products 페이지는 무한 스크롤이 아닌 페이지네이션으로 구현
- cart 페이지의 결제 항목 선택
  - formData를 사용하지 않고 구현
  - 강의에서는 결제 항목이 선택되면 선택된 내용으로 formData state를 업데이트 하고 useEffect 내부에서 checkbox ref를 확인하여 선택된 결제 항목을 Recoil 전역 상태로 업데이트함 -> 결제 항목이 선택되면 선택된 내용으로 결제 항목 recoil 전역 상태를 업데이트하고 useEffect로 결제 항목 전역 상태를 확인하여 checkbox ref에 checked를 값을 변경함
- ProductForm 컴포넌트: AddForm 컴포넌트를 admin 페이지의 edit form과 add form에 공통으로 사용할 수 있도록 변경
- fetch 함수 하나로 관리하던 것을 요청하는 용도에 따라 분리함.

# TODO

## 클라이언트

- [] admin에서 수정한 거 장바구니에도 반영되게 하기

## 클라이언트 - 씹고 뜯고 맛보고 즐기고~~~~

- [] 에러 핸들링 읽고 try/catch 추가
- [] tanstack query에서 async/await를 붙이는 상황과 안붙이는 상황 뭐가 다른지 알아보기

## 서버 - 구현

- [] monorepo: express + json
- [] firebase

## 서버 - 씹고 뜯고 맛보고 즐기고~~~~

- [] graphql을 REST API로 바꿔보기(with client) -> 뭐가 더 나은지 비교하고 기록하기
- [] vite에서 알려주는 "백엔드 프레임워크와 함께 사용하기" 적용해서 프로덕션 빌드 실행해보기

## 마무리

- [] 리팩토링
- [] 배포

# 🎛️ 구현 과정

## React에서 Intersection Observer API로 Infinity scroll 만들기

### isIntersecting을 state로 관리

IntersectionObserver에서 관찰한 entry의 isIntersecting를 React의 state로 관리하고, isIntersecting 결과에 따라 fetchNextPage를 호출하는 useEffect로 구현한다.

```tsx
function ProductList() {
  const observerRef = useRef<IntersectionObserver>();
  const [spinner, setSpinner] = useState<HTMLDivElement>();
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      Promise<unknown> | { products: ProductsType },
      Error,
      { products: ProductsType }
    >(
      [QueryKeys.PRODUCTS, "products"],
      ({ pageParam = "" }) => fetchData(GET_PRODUCTS, { cursor: pageParam }),
      {
        getNextPageParam: (lastPage) => {
          if ("products" in lastPage) {
            return lastPage.products.at(-1)?.id;
          }
        },
      }
    );

  const getObserver = useCallback(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      setIsIntersecting(entries.some((entry) => entry.isIntersecting));
    });

    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (spinner) getObserver().observe(spinner);
  }, [spinner]);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [isIntersecting]);

  if (!data) return null;

  return (
    <div>
      <ul>
        {data.pages
          .flatMap((page) => page.products)
          .map((product) => (
            <ProductItem {...product} key={product.id} />
          ))}
      </ul>

      <div
        ref={(node) => {
          if (node) setSpinner(node);
        }}
      >
        spinner
      </div>
    </div>
  );
}
```

### observer에서 entry의 isIntersecting 결과에 따라 fetchNextPage를 호출하는 executeFetchNextPage 함수 호출

isIntersecting 결과는 자주 변경될 수 있기 때문에 너무 잦은 컴포넌트 리렌더링을 일으킨다고 판단했다. 이를 대체하기 위해 isIntersecting을 state 값으로 등록하지 않고, observe에서 isIntersecting 결과에 따라 executeFetchNextPage 함수를 호출하면 함수 내부에서 useInfiniteQuery가 반환하는 hasNextPage, isFetchingNextPage의 값을 판단하여 fetchNextPage 함수를 호출하도록 만들고자 했다.

#### 실패 시도

- 첫번째 시도 -> 실패: 실행 결과, observer 콜백에서 hasNextPage나 isFetchingNextPage를 참조할 수 없었다.

  ```tsx
  function ProductList() {
    const observerRef = useRef<IntersectionObserver>();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useInfiniteQuery<
        Promise<unknown> | { products: ProductsType },
        Error,
        { products: ProductsType }
      >(
        [QueryKeys.PRODUCTS, "products"],
        ({ pageParam = "" }) => fetchData(GET_PRODUCTS, { cursor: pageParam }),
        {
          getNextPageParam: (lastPage) => {
            if ("products" in lastPage) {
              return lastPage.products.at(-1)?.id;
            }
          },
        }
      );

    const getObserver = useCallback(() => {
      observerRef.current = new IntersectionObserver((entries) => {
        const isIntersecting = entries.some((entry) => entry.isIntersecting);

        if (isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      });

      return observerRef.current;
    }, [observerRef.current]);

    useEffect(() => {
      if (spinner) getObserver().observe(spinner);
    }, [spinner]);

    return (
      // ...
    );
  }
  ```

- 두번째 시도 -> 실패: 실행 결과, React의 state로 선언한 hasNextPageState, isFetchingNextPageState도 참조할 수 없었다.

  ```tsx
  function ProductList() {
    const observerRef = useRef<IntersectionObserver>();
    const [hasNextPageState, setHasNextPageState] = useState<boolean>();
    const [isFetchingNextPageState, setIsFetchingNextPageState] =
      useState<boolean>();

    // ...

    const getObserver = useCallback(() => {
      observerRef.current = new IntersectionObserver((entries) => {
        const isIntersecting = entries.some((entry) => entry.isIntersecting);

        if (isIntersecting && hasNextPageState && !isFetchingNextPageState)
          fetchNextPage();
      });

      return observerRef.current;
    }, [observerRef.current]);

    useEffect(() => {
      if (spinner) getObserver().observe(spinner);
    }, [spinner]);

    useEffect(() => {
      setHasNextPageState(hasNextPage);
      setIsFetchingNextPageState(isFetchingNextPage);
    }, [hasNextPage, isFetchingNextPage]);

    return (
      // ...
    );
  }
  ```

#### 문제 원인 분석

Intersection Observer는 React가 아닌 Browser API, 즉 외부 시스템이기 때문에 React의 state나 query에는 접근할 수 없다. 때문에 IntersectionObserver는 useInfiniteQuery에서 반환한 hasNextPage나 isFetchingNextPage를 참조할 수 없고, React의 state로 선언한 hasNextPageState, isFetchingNextPageState도 참조할 수 없다.

#### 해결 방법

React에는 외부 API와 동기화 할 수 있도록 useRef hook이 제공된다. 따라서 useRef Hook을 이용하여 hasNextPage나 isFetchingNextPage의 결과를 ref로 등록하고, 값이 변경될 때마다 useEffect를 통해 동기화 시켜주면 IntersectionObserver에서 참조할 수 있게 된다.

```tsx
function ProductList() {
  const observerRef = useRef<IntersectionObserver>();
  const hasNextPageRef = useRef<boolean>();
  const isFetchingNextPageRef = useRef<boolean>();

  // ...

  const getObserver = useCallback(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      const isIntersecting = entries.some((entry) => entry.isIntersecting);

      if (isIntersecting && hasNextPageRef.current && !isFetchingNextPageRef.current)
        fetchNextPage();
    });

    return observerRef.current;
  }, [observerRef.current]);

  useEffect(() => {
    if (spinner) getObserver().observe(spinner);
  }, [spinner]);

  useEffect(() => {
    hasNextPageRef.current = hasNextPage;
    isFetchingNextPageRef.current = isFetchingNextPage;
  }, [hasNextPage, isFetchingNextPage]);

  return (
    // ...
  );
}
```

## Recoil V.S Context API

강의에서는 장바구니에서 결제 항목을 선택하고 결제창으로 이동할 때 선택한 결제 항목을 Recoil 전역상태로 관리한다.
새로 만들어보는 과정에서는 전역 상태로 관리하는 데이터가 비교적 간단해서 Recoil 라이브러리보다는 React에서 제공하는 Context API와 `useReducer`를 사용하는 것이 보다 가볍지 않을까 하는 생각에서 Context API를 사용해보았다.

### 구현 코드

#### Recoil을 사용한 기존 코드

- App.tsx

  ```tsx
  // App.tsx
  import { useRoutes } from "react-router-dom";
  import { routes } from "./route";
  import Gnb from "./components/gnb";
  import { QueryClientProvider } from "react-query";
  import { queryClient } from "./fetcher";
  import { RecoilRoot } from "recoil";

  function App() {
    const element = useRoutes(routes);

    return (
      <QueryClientProvider client={queryClient}>
        <RecoilRoot>
          <h1>Shopping Mall</h1>
          <Gnb />
          {element}
        </RecoilRoot>
      </QueryClientProvider>
    );
  }

  export default App;
  ```

- src/recoil/atoms.ts

  ```tsx
  // src/recoil/atoms.ts
  import { atom } from "recoil";
  import { CartType } from "../graphql/cart";

  export const productsToPay = atom<CartType>({
    key: "productsToPay",
    default: [],
  });
  ```

- src/components/cart/list.tsx

  ```tsx
  // src/components/cart/list.tsx
  import { SyntheticEvent, createRef, useEffect, useRef } from "react";
  import { CartType } from "../../graphql/cart";
  import CartItem from "./item";
  import { useRecoilState } from "recoil";
  import { productsToPay } from "../../recoil/atoms";

  function CartList({ cart }: { cart: CartType }) {
    const formRef = useRef<HTMLFormElement>(null);
    const cartCheckboxRef = useRef<HTMLInputElement>(null);
    const cartItemCheckboxRefs = cart.map(() => createRef<HTMLInputElement>());
    const [checkedItems, setCheckedItems] = useRecoilState(productsToPay);

    const changeCartCheckbox = (targetInput: HTMLInputElement) => {
      // 개별 선택시 전체 선택 change function
      const targetInputId = targetInput.name.replace("cart-item__checkbox", "");
      const cartItem = cart.find((cartItem) => cartItem.id === targetInputId);

      let newCheckedItems = [...checkedItems];

      if (!cartItem) return;

      if (targetInput.checked) {
        if (!checkedItems.includes(cartItem)) newCheckedItems.push(cartItem);
      } else {
        newCheckedItems = newCheckedItems.filter(
          (checkedItem) => checkedItem.id !== targetInputId
        );
      }

      setCheckedItems(newCheckedItems);
    };

    const changeCartItemsCheckbox = (targetInput: HTMLInputElement) => {
      // 전체 선택시 개별 선택 change function
      const newCheckedItems = targetInput.checked
        ? cart.filter((cartItem) => cartItem.product.createdAt)
        : [];

      setCheckedItems(newCheckedItems);
    };

    const onChangeCheckbox = (e: SyntheticEvent) => {
      // Form Change Event Handler
      if (!formRef.current) return;

      const targetInput = e.target as HTMLInputElement;

      if (targetInput.className === "cart__checkbox") {
        changeCartItemsCheckbox(targetInput);
      } else if (targetInput.className === "cart-item__checkbox") {
        changeCartCheckbox(targetInput);
      }
    };

    useEffect(() => {
      // cart가 변경되었을 경우
      const newCheckedItems = [...checkedItems];

      newCheckedItems.forEach((checkedItem, i) => {
        const cartItem = cart.find(
          (cartItem) =>
            cartItem.id === checkedItem.id && cartItem.product.createdAt
        );

        if (cartItem) newCheckedItems[i] = cartItem;
        else newCheckedItems.splice(i, 1);
      });

      setCheckedItems(newCheckedItems);
    }, [cart]);

    useEffect(() => {
      // 결제 항목이 변경되었을 경우
      if (!cartCheckboxRef.current) return;

      cartItemCheckboxRefs.forEach((ref) => {
        if (!ref.current || ref.current.disabled) return;

        const refId = ref.current.name.replace("cart-item__checkbox", "");

        ref.current.checked = !!checkedItems.find(
          (checkedItem) => checkedItem.id === refId
        );
      });

      const existentCartLength = cart.filter(
        (cartItem) => cartItem.product.createdAt
      ).length;

      cartCheckboxRef.current.checked =
        checkedItems.length === existentCartLength && existentCartLength > 0;
      cartCheckboxRef.current.disabled =
        cart.filter((cartItem) => cartItem.product.createdAt).length === 0;
    }, [checkedItems]);

    /* --------------------------------- return --------------------------------- */
    if (cart.length < 1) return null;

    return (
      <>
        <form ref={formRef} onChange={onChangeCheckbox}>
          <label>
            <input
              type="checkbox"
              name="cart__checkbox"
              className="cart__checkbox"
              ref={cartCheckboxRef}
            />
          </label>

          <ul>
            {cart.map((cartItem, i) => (
              <CartItem
                {...cartItem}
                key={cartItem.id}
                ref={cartItemCheckboxRefs[i]}
              />
            ))}
          </ul>
        </form>
      </>
    );
  }

  export default CartList;
  ```

- src/pages/payment.tsx

  ```tsx
  // src/pages/payment.tsx
  import PreviewPayment from "../components/previewPayment";
  import { useMutation } from "react-query";
  import { fetchData } from "../fetcher";
  import { EXECUTE_PAY } from "../graphql/payment";
  import { useNavigate } from "react-router-dom";
  import { useSetRecoilState } from "recoil";
  import { productsToPay } from "../recoil/atoms";

  function PaymentPage() {
    const navigate = useNavigate();
    const setPaymentList = useSetRecoilState(productsToPay);
    const { mutate: executePay } = useMutation(
      (ids: string[]) => fetchData(EXECUTE_PAY, { ids }),
      {
        onSuccess: () => {
          setPaymentList([]);
          alert("결제가 완료되었습니다.");
          navigate("/products", { replace: true });
        },
      }
    );

    const onExecutePay = (ids: string[] = []) => {
      executePay(ids);
    };

    return (
      <>
        <h2>결제 페이지</h2>

        <PreviewPayment
          onClick={(ids) => onExecutePay(ids)}
          buttonText="결제하기"
        />
      </>
    );
  }

  export default PaymentPage;
  ```

- src/components/previewPayment/index.tsx

  ```tsx
  // src/components/previewPayment/index.tsx
  import ItemData from "../itemData";
  import { styled } from "styled-components";
  import { useRecoilValue } from "recoil";
  import { productsToPay } from "../../recoil/atoms";

  const PreviewWrapper = styled.div`
    margin: 10px;
    padding: 10px;
    border: 1px solid #000;
  `;

  function PreviewPayment({
    onClick,
    buttonText,
  }: {
    onClick: (ids?: string[]) => void;
    buttonText: string;
  }) {
    const paymentList = useRecoilValue(productsToPay);

    if (paymentList.length < 1) return null;

    const ids = paymentList.map((paymentItem) => paymentItem.id);

    const totalAmount = paymentList.reduce(
      (result, { amount, product: { price, createdAt } }) => {
        if (createdAt) result += amount * price;
        return result;
      },
      0
    );

    return (
      <PreviewWrapper>
        <h3>결제 목록</h3>
        <ul>
          {paymentList.map(
            ({
              id,
              amount,
              product: { title, imageUrl, price, createdAt },
            }) => (
              <li key={id}>
                <ItemData title={title} imageUrl={imageUrl} price={price} />

                {createdAt ? (
                  <>
                    <p>개수: {amount}</p>
                    <p>금액: {amount * price}원</p>
                  </>
                ) : (
                  <strong>품절된 상품입니다.</strong>
                )}
              </li>
            )
          )}
        </ul>

        <p>총 금액: {totalAmount}원</p>

        <button type="button" onClick={() => onClick(ids)}>
          {buttonText}
        </button>
      </PreviewWrapper>
    );
  }

  export default PreviewPayment;
  ```

#### Context API를 이용한 코드

- App.tsx

  ```tsx
  // App.tsx
  import { useRoutes } from "react-router-dom";
  import { routes } from "./route";
  import Gnb from "./components/gnb";
  import { QueryClientProvider } from "react-query";
  import { queryClient } from "./fetcher";
  import { ProductsToPayProvider } from "./context/productsToPay";

  function App() {
    const element = useRoutes(routes);

    return (
      <QueryClientProvider client={queryClient}>
        <ProductsToPayProvider>
          <h1>Shopping Mall</h1>
          <Gnb />
          {element}
        </ProductsToPayProvider>
      </QueryClientProvider>
    );
  }

  export default App;
  ```

- src/context/productsToPay.tsx

  ```tsx
  // src/context/productsToPay.tsx
  import { Dispatch, createContext, useReducer } from "react";
  import { CartType } from "../graphql/cart";

  type Action = { type: "added" | "updated" | "deleted"; items: CartType };
  type DispatchType = Dispatch<Action>;

  export const ProductsToPayContext = createContext<CartType | null>(null);
  export const ProductsToPayDispatchContext =
    createContext<DispatchType | null>(null);

  export function ProductsToPayProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [productsToPay, dispatch] = useReducer(
      productsToPayReducer,
      initialProductsToPay
    );

    return (
      <ProductsToPayContext.Provider value={productsToPay}>
        <ProductsToPayDispatchContext.Provider value={dispatch}>
          {children}
        </ProductsToPayDispatchContext.Provider>
      </ProductsToPayContext.Provider>
    );
  }

  function productsToPayReducer(productsToPay: CartType, action: Action) {
    switch (action.type) {
      case "added": {
        let newProductsToPay = [...productsToPay];

        action.items.forEach((item) => {
          const targetIndex = newProductsToPay.findIndex(
            (product) => product.id === item.id
          );

          if (targetIndex < 0) newProductsToPay = [...newProductsToPay, item];
        });

        return newProductsToPay;
      }
      case "updated": {
        const newProductsToPay = [...productsToPay];

        action.items.forEach((item) => {
          const targetIndex = newProductsToPay.findIndex(
            (product) => product.id === item.id
          );

          if (targetIndex > -1) newProductsToPay.splice(targetIndex, 1, item);
        });

        return newProductsToPay;
      }
      case "deleted": {
        const newProductsToPay = [...productsToPay];

        action.items.forEach((item) => {
          const targetIndex = newProductsToPay.findIndex(
            (product) => product.id === item.id
          );

          if (targetIndex > -1) newProductsToPay.splice(targetIndex, 1);
        });

        return newProductsToPay;
      }
    }
  }

  const initialProductsToPay: CartType = [];
  ```

- src/components/cart/lists.tsx

  ```tsx
  // src/components/cart/lists.tsx
  import {
    SyntheticEvent,
    createRef,
    useContext,
    useEffect,
    useRef,
  } from "react";
  import { CartType } from "../../graphql/cart";
  import CartItem from "./item";
  import {
    ProductsToPayContext,
    ProductsToPayDispatchContext,
  } from "../../context/productsToPay";

  function CartList({ cart }: { cart: CartType }) {
    const formRef = useRef<HTMLFormElement>(null);
    const cartCheckboxRef = useRef<HTMLInputElement>(null);
    const cartItemCheckboxRefs = cart.map(() => createRef<HTMLInputElement>());
    const checkedItems = useContext(ProductsToPayContext);
    const setCheckedItems = useContext(ProductsToPayDispatchContext);

    if (!checkedItems) throw new Error("Cannot find ProductsToPayContext");
    if (!setCheckedItems)
      throw new Error("Cannot find ProductsToPayDispatchContext");

    const changeCartCheckbox = (targetInput: HTMLInputElement) => {
      // 개별 선택시 전체 선택 change function
      const targetInputId = targetInput.name.replace("cart-item__checkbox", "");
      const cartItem = cart.find((cartItem) => cartItem.id === targetInputId);

      if (!cartItem) return;

      if (targetInput.checked) {
        setCheckedItems({
          type: "added",
          items: [cartItem],
        });
      } else {
        setCheckedItems({
          type: "deleted",
          items: [cartItem],
        });
      }
    };

    const changeCartItemsCheckbox = (targetInput: HTMLInputElement) => {
      // 전체 선택시 개별 선택 change function
      setCheckedItems({
        type: targetInput.checked ? "added" : "deleted",
        items: cart.filter((cartItem) => cartItem.product.createdAt),
      });
    };

    const onChangeCheckbox = (e: SyntheticEvent) => {
      // Form Change Event Handler
      if (!formRef.current) return;

      const targetInput = e.target as HTMLInputElement;

      if (targetInput.className === "cart__checkbox") {
        changeCartItemsCheckbox(targetInput);
      } else if (targetInput.className === "cart-item__checkbox") {
        changeCartCheckbox(targetInput);
      }
    };

    useEffect(() => {
      // cart가 변경되었을 경우
      setCheckedItems({
        type: "updated",
        items: cart.filter((cartItem) => cartItem.product.createdAt),
      });
    }, [cart]);

    useEffect(() => {
      // 결제 항목이 변경되었을 경우
      if (!cartCheckboxRef.current) return;

      cartItemCheckboxRefs.forEach((ref) => {
        if (!ref.current || ref.current.disabled) return;

        const refId = ref.current.name.replace("cart-item__checkbox", "");

        ref.current.checked = !!checkedItems.find(
          (checkedItem) => checkedItem.id === refId
        );
      });

      const existentCartLength = cart.filter(
        (cartItem) => cartItem.product.createdAt
      ).length;

      cartCheckboxRef.current.checked =
        checkedItems.length === existentCartLength && existentCartLength > 0;
      cartCheckboxRef.current.disabled =
        cart.filter((cartItem) => cartItem.product.createdAt).length === 0;
    }, [checkedItems]);

    /* --------------------------------- return --------------------------------- */
    if (cart.length < 1) return null;

    return (
      <>
        <form ref={formRef} onChange={onChangeCheckbox}>
          <label>
            <input
              type="checkbox"
              name="cart__checkbox"
              className="cart__checkbox"
              ref={cartCheckboxRef}
            />
          </label>

          <ul>
            {cart.map((cartItem, i) => (
              <CartItem
                {...cartItem}
                key={cartItem.id}
                ref={cartItemCheckboxRefs[i]}
              />
            ))}
          </ul>
        </form>
      </>
    );
  }

  export default CartList;
  ```

- src/components/previewPament/index.tsx

  ```tsx
  // src/components/previewPament/index.tsx
  import { useContext } from "react";
  import { ProductsToPayContext } from "../../context/productsToPay";
  import ItemData from "../itemData";
  import { styled } from "styled-components";

  const PreviewWrapper = styled.div`
    margin: 10px;
    padding: 10px;
    border: 1px solid #000;
  `;

  function PreviewPayment({
    onClick,
    buttonText,
  }: {
    onClick: (ids?: string[]) => void;
    buttonText: string;
  }) {
    const paymentList = useContext(ProductsToPayContext);

    if (!paymentList) throw new Error("Cannot find ProductsToPayContext");
    if (paymentList.length < 1) return null;

    const ids = paymentList.map((paymentItem) => paymentItem.id);

    const totalAmount = paymentList.reduce(
      (result, { amount, product: { price, createdAt } }) => {
        if (createdAt) result += amount * price;
        return result;
      },
      0
    );

    return (
      <PreviewWrapper>
        <h3>결제 목록</h3>
        <ul>
          {paymentList.map(
            ({
              id,
              amount,
              product: { title, imageUrl, price, createdAt },
            }) => (
              <li key={id}>
                <ItemData title={title} imageUrl={imageUrl} price={price} />

                {createdAt ? (
                  <>
                    <p>개수: {amount}</p>
                    <p>금액: {amount * price}원</p>
                  </>
                ) : (
                  <strong>품절된 상품입니다.</strong>
                )}
              </li>
            )
          )}
        </ul>

        <p>총 금액: {totalAmount}원</p>

        <button type="button" onClick={() => onClick(ids)}>
          {buttonText}
        </button>
      </PreviewWrapper>
    );
  }

  export default PreviewPayment;
  ```

- src/pages/payment.tsx

  ```tsx
  // src/pages/payment.tsx
  import PreviewPayment from "../components/previewPayment";
  import { useMutation } from "react-query";
  import { fetchData } from "../fetcher";
  import { EXECUTE_PAY } from "../graphql/payment";
  import { useNavigate } from "react-router-dom";
  import { useContext } from "react";
  import { ProductsToPayDispatchContext } from "../context/productsToPay";

  function PaymentPage() {
    const navigate = useNavigate();
    const setPaymentList = useContext(ProductsToPayDispatchContext);

    if (!setPaymentList)
      throw new Error("Cannot find ProductsToPayDispatchContext");

    const { mutate: executePay } = useMutation(
      (ids: string[]) => fetchData(EXECUTE_PAY, { ids }),
      {
        onSuccess: () => {
          setPaymentList({ type: "deletedAll" });
          alert("결제가 완료되었습니다.");
          navigate("/products", { replace: true });
        },
      }
    );

    const onExecutePay = (ids: string[] = []) => {
      executePay(ids);
    };

    return (
      <>
        <h2>결제 페이지</h2>

        <PreviewPayment
          onClick={(ids) => onExecutePay(ids)}
          buttonText="결제하기"
        />
      </>
    );
  }

  export default PaymentPage;
  ```

### 결과

여러 포스팅을 읽어보았을 때 Context API는 context를 제공하고 있는 `Provider` 하위에서 `useContext`를 사용하고 있는 모든 consumer들의 리렌더링을 일으키는 것이 큰 단점이라고 설명하고 있다. context를 제공받고 있는 컴포넌트라면 지금 사용하고 있는 컴포넌트가 아니더라도 리렌더링하는 것이다. Recoil을 Context API로 변경해서 테스트 해본 결과, 이 애플리케이션에서 context를 제공받고 있는 컴포넌트 중에 context value가 변경될 때 의미없이 리렌더링이 되고 있는 것은 찾지 못했다. 때문에 이 애플리케이션에서는 Recoil이 아닌 Context API를 사용해도 될 것 같다는 결론을 내렸다.

#### 덧붙임

- 엄밀히 말하면 [리액트 Context는 상태 관리 도구가 아니다](https://velog.io/@jheeju/%EB%A6%AC%EC%95%A1%ED%8A%B8-Context-%EB%8A%94-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC-%EB%8F%84%EA%B5%AC%EA%B0%80-%EC%95%84%EB%8B%88%EB%8B%A4)라고 한다. Context API는 이미 만들어져 있는 상태를 아래로 내려보내는 역할을 할 뿐 상태 값을 저장하지 않고, 정확하게는 useReducer가 상태 값을 저장하고 변경하기 때문에 useReducer가 상태를 관리하는 것이다.
- 컴포넌트 간의 상태 관리는 Recoil의 atom을 사용하고, 애플리케이션 전반에는 Context API를 사용하라는 말이 있다. -> Q. 페이지를 넘나들면서 사용되는 전역 상태라면 애플리케이션 전반에 사용된다고 생각해도 되는 걸까? 아직 개념이 명확하게 받아들여지지 않는다.

# 🧨 Trouble Shooting

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
