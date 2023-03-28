import { QueryClient } from "@tanstack/react-query";
import { request, RequestDocument } from "graphql-request";

/**
 * NOTE: queryClient를 따로 관리하면 여기저기서 불러오기 쉽고, 수정이 간편하다.
 *
 * 클로저로 만들어진 getClient는 최초 실행 때만 변수 client를 선언하고,
 * 이후 getClient가 호출되면 new QueryClient의 인스턴스가 된 client를 return 한다.
 *
 * THINK: 클로저를 위해 client을 null로 미리 선언해두었는데, 클로저가 아닌 매 호출마다 new QueryClient()를 호출하는 client 변수를 선언하면 안되는가? 뭐가 더 좋을까?
 */
export const getClient = (() => {
  let client: QueryClient | null = null;

  return () => {
    if (!client)
      client = new QueryClient({
        defaultOptions: {
          queries: {
            cacheTime: 1000 * 60 * 60 * 24, // 데이터를 캐시에 저장하는 시간: 24시간
            staleTime: 1000 * 60, // 데이터 갱신 전 만료 시간: 1분
            refetchOnMount: false, // 컴포넌트가 처음 마운트될 때마다 새로고침 여부: x
            refetchOnReconnect: false, // 인터넷 연결이 다시 활성화될 때마다 새로고침 여부: x
            refetchOnWindowFocus: false, // 브라우저 창에 포커스될 때마다 새로고침 여부: x
          },
        },
      });
    return client;
  };
})();

const BASE_URL = "/";

type AnyOBJ = { [key: string]: any };

/** fetch를 간편하게 하도록 하는 함수 */
export const resfetcher = async ({
  method,
  path,
  body,
  params,
}: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  body?: AnyOBJ;
  params?: AnyOBJ;
}) => {
  try {
    let url = `${BASE_URL}${path}`;
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": BASE_URL,
      },
    };

    if (params) {
      const searchParams = new URLSearchParams(params);
      console.log(params, searchParams, searchParams.toString());
      url += `?${searchParams.toString()}`;
    }

    if (body) fetchOptions.body = JSON.stringify(body);

    const res = await fetch(url, fetchOptions);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(err);
  }
};

export const graphqlFetcher = async (query: RequestDocument, variables = {}) =>
  request(BASE_URL, query, variables);

/** react-query에서 unique key로 사용되는 값 */
export const QueryKeys = {
  PRODUCTS: "PRODUCTS",
  CART: "CART",
};
