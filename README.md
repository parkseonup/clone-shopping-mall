# 🧾 설명

clone-shopping-mall 레포지토리에서 만들었던 shopping-mall을 강의 없이 새로 만들면서 다양한 시도 해보기.

## 강의와 다른 점

- 강의에서는 QueryClient 인스턴스를 생성할 때 export 하여 인스턴스 참조가 필요한 곳에 import로 사용하는 방법이었으면, useQueryClient 메서드를 사용하는 방식으로 변경.
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
- fetch 함수 하나로 관리하던 것을 요청하는 용도에 따라 분리: fetch 데이터에 따라 용도를 분리하여 명확한 type 관리의 용이성을 높임
- 에러 처리 추가
  - Error Boundary를 이용한 fallback UI 출력 (react-error-boundary 사용)
  - toast를 이용한 에러 처리 (react-hot-toast 사용)

# 🎛️ 구현 과정

## React에서 Intersection Observer API로 Infinity scroll 만들기

### 강의: isIntersecting을 state로 관리

강의에서는 IntersectionObserver에서 관찰한 entry의 isIntersecting를 React의 state로 관리하고, isIntersecting 결과에 따라 fetchNextPage를 호출하는 useEffect로 구현한다.

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

### 변경: observer에서 entry의 isIntersecting 결과에 따라 fetchNextPage를 호출하는 executeFetchNextPage 함수 호출

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

~~Intersection Observer는 React가 아닌 Browser API, 즉 외부 시스템이기 때문에 React의 state나 query에는 접근할 수 없다. 때문에 IntersectionObserver는 useInfiniteQuery에서 반환한 hasNextPage나 isFetchingNextPage를 참조할 수 없고, React의 state로 선언한 hasNextPageState, isFetchingNextPageState도 참조할 수 없다.~~

위 해석 중 "외부 시스템이기때문에 접근할 수 없다"라는 내용은 해석의 혼동을 가져올 수 있어 아래와 같이 변경합니다.

먼저, 실행 순서를 살펴보면,

- useQuery는 렌더링 과정에서 실행된다.
- Intersection Observer API는 비동기로 동작한디. 따라서 렌더링 도중이 아닌 렌더링 이후에 실행된다.

즉, observer에 의해 호출되는 함수는 렌더링 프로세스 이후에 호출된다. 따라서 해당 함수 내부에서 참조하는 값은 렌더링 이후에 참조할 수 있는 값이어야 한다.

그렇다면 어떤 것을 사용해야 렌더링 이후에 값을 참조할 수 있을까?

1. ❌ query 요청이 반환한 isFetchingNextPage와 hasNextPage를 직접 참조: query 요청은 렌더링 과정에서 발생하기 때문에 렌더링이 끝나면 해당 실행 컨텍스트는 사라진다. 따라서 렌더링 이후에는 isFetchingNextPage와 hasNextPage 값을 참조할 수 없다.
2. ❌ isFetchingNextPage와 hasNextPage를 state로 관리: state는 렌더링 과정에서 참조할 때 사용하므로, 렌더링 이후에 참조하는 것은 옳바른 접근 방법이 아니다. (state는 queue를 이용하여 snapshot으로 관리되기 때문에 다음 렌더링까지 변경된 state를 참조하지 못할 수 있다.)
3. ⭕️ isFetchingNextPage와 hasNextPage를 ref로 관리: ref는 렌더링 프로세스 외부에서 값을 참조할 수 있다. 따라서 외부 API인 Intersection Observer API가 렌더링 이후에 어떠한 값을 참조하길 원한다면 ref를 사용할 수 있다.

위에서 배운 내용으로 코드를 작성해보자.

#### 해결 방법

React에는 외부 API와 동기화 할 수 있도록 useRef hook이 제공된다. 따라서 useRef Hook을 이용하여 hasNextPage나 isFetchingNextPage의 결과를 ref로 등록하고, hasNextPage, isFetchingNextPage 값이 변경될 때마다 useEffect를 통해 ref 값을 동기화 시켜주면 IntersectionObserver에서 참조할 수 있게 된다.

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

## query 요청에서 에러 발생시 onError 콜백에서 toast.error()가 동작하지 않음.

### 기존 코드

- src/pages/products/[id].tsx

  ```ts
  import { Toaster } from "react-hot-toast";
  // ...

  export default function ProductDetailPage() {
    const { id } = useParams();

    if (id === undefined) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useGetProduct(id);

    if (!data) return null;

    return (
      <>
        <h2>상품 상세 페이지</h2>

        <main>
          <ProductDetail {...data.product} />
          <Toaster />
        </main>
      </>
    );
  }
  ```

- src/servies/common.ts

  ```ts
  import { toast } from "react-hot-toast";
  // ...

  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 0,
        suspense: true,
        useErrorBoundary: true,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        console.log(
          "[에러]",
          (error as ResponseError).response.errors[0].message
        ); // 여기까지는 잘 찍힘

        toast.error((error as ResponseError).response.errors[0].message); // FIXME: 안됨!!!!!!
      },
      onSuccess: () => {
        toast.success("성공"); // 이 toast는 잘 동작함
      },
    }),
  });
  ```

- src/servies/queries/products.ts

  ```ts
  export const useGetProduct = (id: string) =>
    useQuery<{ product: ProductType }, ResponseError>({
      queryKey: QueryKeys.PRODUCTS.product(id),
      queryFn: () =>
        request({
          url: API_URL,
          document: GET_PRODUCT,
          variables: { id },
        }),
    });
  ```

### 문제 원인 분석

1. <Toaster /> 선언 위치의 오류

   - 문제: 기존에는 <Toaster /> 컴포넌트를 에러가 발생하는 컴포넌트에 선언해주었다.
   - 원인: react query는 query Function에서 에러가 캐치되면 컴포넌트의 렌더링을 멈추고 onError 콜백 함수를 실행한다. 즉, 에러가 발생하는 컴포넌트에서 <Toaster />를 선언해주면 에러 발생시 렌더링이 멈추기 때문에 <Toaster /> 컴포넌트가 렌더링되지 않는다.

2. 잘못된 `useErrorBoundary` 옵션값

   - 문제: 쿼리 캐시를 생성하는 전역에 `useErrorBoundary` 옵션을 `true`로 지정했다.
   - 원인: useErrorBoundary는 에러가 발생할 경우 가장 가까운 상위의 에러 바운더리에 에러가 전파되도록 하겠다 라는 의미의 옵션인데, 본 페이지는 에러 바운더리를 사용하지 않았다. 즉, 에러 처리를 할 에러 경계(Error Boundary)를 찾지 못해 애플리케이션이 동작을 멈췄다.

### 문제 해결

<Toaster /> 컴포넌트를 에러가 발생하는 컴포넌트의 상위에 선언하고 query 요청시 useErrorBoundary 옵션을 false로 변경한다.

- src/App.ts

  ```ts
  import { ToastContainer } from "react-toastify";
  // ...

  export default function App() {
    const element = useRoutes(routes);

    return (
      <QueryClientProvider client={queryClient}>
        <ProductsToPayProvider>
          <h1>Shopping Mall</h1>
          <Gnb />
          {element}
          <ToastContainer />
        </ProductsToPayProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  }
  ```

- src/pages/products/[id].tsx

  ```ts
  export default function ProductDetailPage() {
    const { id } = useParams();

    if (id === undefined) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data } = useGetProduct(id);

    if (!data) return null;

    return (
      <>
        <h2>상품 상세 페이지</h2>

        <main>
          <ProductDetail {...data.product} />
        </main>
      </>
    );
  }
  ```

- src/servies/common.ts

  ```ts
  import { toast } from "react-toastify";
  // ...

  export const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 0,
        suspense: true,
        useErrorBoundary: true,
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        toast.error((error as ResponseError).response.errors[0].message);
      },
      onSuccess: () => {
        toast.success("성공");
      },
    }),
  });
  ```

- src/servies/queries/products.ts

  ```ts
  export const useGetProduct = (id: string) =>
    useQuery<{ product: ProductType }, ResponseError>({
      queryKey: QueryKeys.PRODUCTS.product(id),
      queryFn: () =>
        request({
          url: API_URL,
          document: GET_PRODUCT,
          variables: { id },
        }),
      useErrorBoundary: false,
    });
  ```

# 배운 내용

## react query의 queryFn은 언제 async 함수로 호출되어야 할까?

기존 강의 코드에서는 react query로 쿼리 요청을 할 때 queryFn를 async 함수로 만들지 않았다. 게다가 공식 문서나 다른 여러 포스팅을 살펴보면 queryFn이 async 함수로 만들어진 것도 있고 아닌 것도 있어 어떤 경우에 async 키워드를 사용해야 하는지 궁금해져 알아보았다.

### React Query의 queryFn은 Promise를 반환해야 한다.

> _"A query function can be literally any function that returns a promise. The promise that is returned should either resolve the data or throw an error." - TanStack
> Query_

Tastack Query 공식문서에서 Query Functions에 게시된 글을 읽어보면, 제일 첫 줄에 query function은 promise를 반환해야 한다고 작성되어 있다. query function는 resolve되어 데이터 정보를 담고 있거나 reject되어 에러 정보를 가지고 있는 Promise만을 반환할 수 있는 것이다.

### async 함수는 늘 Promise 객체를 반환한다.

> _"async 함수는 이벤트 루프를 통해 비동기적으로 작동하는 함수로, 암시적으로 Promise를 사용하여 결과를 반환합니다." - MDN_

mdn 문서에 따르면 async 함수는 늘 Promise를 반환한다. 앞서 설명했던 Query Function의 조건과 결합해서 생각해보면, query function으로 작성한 api 요청 함수가 Promise를 반환하지 않을 경우에만 async 함수로 만들어주면 된다는 것을 알 수 있다. (await 키워드를 사용하여 Promise 객체를 해석한 다음 후처리가 필요하다면 이 또한 async 함수로 만들어줘야 한다.)

그럼 이제 어떤 요청이 Promise를 반환하고, Promise를 반환하지 않는지만 파악을 하면 되지 않을까?

### Promise를 반환하는 요청

- Fetch API
  - Promise 기반으로 만들어져있으며, 반환값은 Promise 객체이다.
  - 서버 응답이 HTTP 오류 상태인 경우(응답코드: 5xx)나 클라이언트 에러 응답(응답 코드: 4xx)일 경우에도 에러를 발생시키지 않고 해당 요청에 대한 응답으로 확인되는 Promise를 반환한다.
- axios: node.js와 브라우저를 위한 Promise 기반 HTTP 클라이언트 라이브러리로, HTTP 요청이 실패하면 자동으로 에러를 발생시킨다.
- graphql-request: Promise 기반 api로 동작하며, HTTP 요청이 실패하면 자동으로 에러를 발생시킨다.

### 정말 query function은 Promise를 반환하기만 하면 되는걸까? ❌

query function에 대해 작성된 공식문서를 읽어보면 쿼리 요청의 에러 처리를 위해 필요한 조건이 있다. 쿼리 요청의 에러 처리를 위해서는 query function이 반드시 rejected된 Promise를 반환해야 한다는 것이다. rejected된 Promise는 Promise 함수 내부에서 에러가 발생했을 경우 Promise가 거부된 상태를 말한다.

> _For TanStack Query to determine a query has errored, the query function must throw or return a rejected Promise. - Tanstack Query_

Fetch API는 HTTP 요청 오류가 발생했을 때에도 에러를 발생시키지 않고 resolve된 Promise에 ok 프로퍼티 값을 false로 표시하여 반환한다. 이렇게 에러가 발생했을 때 rejected된 Promise를 반환하지 않는 api들이 있다. 이럴 경우에는 async/await 키워드를 사용하여 Promise를 해석하도록 하고 ok 프로퍼티를 검증하도록 하는 등 추가 작업이 필요하다.

### 결론

- async 함수는 내가 사용하는 api가 Promise를 반환하는 지 체크하고 사용하자.
- api 요청이 반환한 정보를 해석하여 추가적인 작업을 처리해야 하는 경우, 즉 await 키워드가 필요한 경우 async 함수로 만든다. (Fetch API의 에러 핸들링 등)

### 참고

- [async function](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/async_function)
- [Tanstack Query](https://tanstack.com/)
- [Why are async api calls necessary with react-query? - Stack Overflow](https://stackoverflow.com/questions/70388520/why-are-async-api-calls-necessary-with-react-query)
- [About async functions - TKDodo's blog](https://tkdodo.eu/blog/about-async-functions#syntactic-sugar)
- [React Query Error Handling](https://tkdodo.eu/blog/react-query-error-handling)
- [Query Cancellation](https://tanstack.com/query/v4/docs/react/guides/query-cancellation)
