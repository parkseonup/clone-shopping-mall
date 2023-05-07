import { QueryClient } from "@tanstack/react-query";
import { request, RequestDocument } from "graphql-request";

export const getClient = (() => {
  let client: QueryClient | null = null;

  return () => {
    if (!client)
      client = new QueryClient({
        defaultOptions: {
          queries: {
            // cacheTime: 1000 * 60 * 60 * 24, // 데이터를 캐시에 저장하는 시간: 24시간
            // staleTime: 1000 * 60, // 데이터 갱신 전 만료 시간: 1분
            cacheTime: Infinity,
            staleTime: Infinity,
            refetchOnMount: false, // 컴포넌트가 처음 마운트될 때마다 새로고침 여부: x
            refetchOnReconnect: false, // 인터넷 연결이 다시 활성화될 때마다 새로고침 여부: x
            refetchOnWindowFocus: false, // 브라우저 창에 포커스될 때마다 새로고침 여부: x
          },
        },
      });
    return client;
  };
})();

const BASE_URL = "https://inflearn-shop.herokuapp.com/graphql";
// const BASE_URL = "/";

type AnyOBJ = { [key: string]: any };

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

export const graphqlFetcher = async (
  query: RequestDocument,
  variables = {}
): Promise<any> => request(BASE_URL, query, variables);

/** react-query에서 unique key로 사용되는 값 */
export const QueryKeys = {
  PRODUCTS: "PRODUCTS",
  CART: "CART",
};
