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
