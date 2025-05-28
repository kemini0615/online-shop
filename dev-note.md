### `import`/`export`와 `require`/`module.exports`의 차이점

**`require`/`module.exports`**
Node.js 환경의 '구형' 또는 '전통적인' 방식입니다. 사용자가 제공한 app.js 코드는 이 방식을 사용하고 있습니다.

- `require()`는 코드의 어느 위치에서든 호출할 수 있습니다.
- 동기적(Synchronous): 코드를 만나는 즉시 파일을 불러오고 실행.
- `const express = require('express');`

**`import`/`export`**
JavaScript의 '현대적인' 공식 표준 방식입니다. React.js 같은 프론트엔드 환경에서는 기본적으로 이 방식을 사용하며, 최신 Node.js 프로젝트에서도 설정 (`package.json`에 `"type": "module"`)을 통해 사용할 수 있습니다.

- `import`는 반드시 파일의 최상단에 위치해야 합니다.
- 비동기적(Asynchronous): 파일들을 먼저 모두 분석/파싱하고 실제 실행.
- `import express from 'express';`

### 모듈과 코어 모듈

- 모듈: 특정 기능들(함수, 변수 등)이 모여있는 하나의 JavaScript 파일을 의미합니다.
- 코어 모듈: `npm install` 같은 명령어로 따로 설치하지 않아도, Node.js 자체에 내장되어 있어서 `require('path')`처럼 바로 불러와서 사용할 수 있는 모듈입니다. `http`, `fs(파일시스템)` 등도 코어 모듈입니다.

### `app.use()`

`app.use()`는 Express 애플리케이션의 핵심입니다. 미들웨어(middleware) 함수를 등록하는 데 사용됩니다.

`app.use()`가 호출될 때마다 미들웨어 함수들이 순서대로 '조립 라인'에 추가된다고 상상하면 쉽습니다.

**동작 원리:**

1. 클라이언트로부터 요청이 들어옵니다.
2. Express는 `app.use()`로 등록된 첫 번째 미들웨어에게 요청 객체(req), 응답 객체(res), 그리고 다음 미들웨어로 제어를 넘기는 next 함수를 전달하며 실행시킵니다.
3. 해당 미들웨어는 자신의 역할(로깅, 데이터 파싱, 인증 등)을 수행합니다.
4. 작업이 끝나면 `next()` 함수를 호출하여 제어권을 다음 미들웨어에게 넘깁니다.
   만약 미들웨어가 `res.send()`나 `res.json()` 등으로 클라이언트에게 직접 응답을 보내면, 요청-응답 사이클은 거기서 종료되고 `next()`는 호출되지 않습니다.
5. 이 과정은 라인의 마지막 미들웨어까지 또는 응답이 전송될 때까지 반복됩니다.

**사용 형태:**

모든 경로에 미들웨어 적용

```
app.use(express.json()); // 모든 요청에 대해 JSON body를 파싱
app.use(myLoggerMiddleware); // 모든 요청에 대해 로그를 남김
```

경로를 지정하지 않으면, 어떤 URL로 요청이 오든 이 미들웨어들이 순서대로 실행됩니다.

특정 경로에만 미들웨어 적용

```
app.use('/admin', checkAdminPermissionMiddleware);
```

이렇게 하면 URL이 `/admin`, `/admin/products`, `/admin/users` 등 `/admin`으로 시작하는 요청에 대해서만 `checkAdminPermissionMiddleware`가 실행됩니다. 다른 경로(예: `/`, `/cart`)의 요청은 이 미들웨어를 건너뜁니다. 라우터를 등록할 때 이 방식을 아주 유용하게 사용합니다.

`app.use()`는 Express의 유연성과 확장성의 원천입니다. 필요한 기능들을 독립적인 미들웨어로 만들어두고, `app.use()`를 이용해 필요한 곳에 '부착'하는 방식으로 서버를 조립해나가는 것이 Express의 개발 방식입니다.

### `express.static()`

`express.static()`은 Express에 내장된 미들웨어 함수로, 정적(Static) 파일을 제공하는 역할을 합니다.

```
app.use(express.static("public"));
```

이 코드는 이렇게 해석할 수 있습니다.

"클라이언트로부터 요청이 들어왔을 때, 만약 그 요청 경로와 일치하는 파일이 public 폴더 안에 있다면 그 파일을 찾아서 보내줘. 만약 파일이 없으면, 그 다음 미들웨어로 요청을 넘겨줘."

**예시:**

1. 브라우저가 `http://내서버.com/css/style.css`를 요청합니다.
2. `express.static("public")` 미들웨어는 서버의 `public` 폴더 안에서 `/css/style.css` 파일을 찾습니다. (즉, `[프로젝트 폴더]/public/css/style.css` 파일을 찾음)
3. 파일이 있으면 그 파일을 브라우저에게 응답으로 보내주고, 요청-응답 사이클은 여기서 종료됩니다.
4. 파일이 없으면, `next()`를 호출하여 뒤이어 등록된 다른 미들웨어(`app.use(...)`)가 요청을 처리하도록 넘깁니다.

```
app.use("/products/assets", express.static("data"));
```

이 코드는 가상 경로를 만드는, 조금 더 발전된 사용법입니다.

"URL 경로가 `/products/assets`으로 시작하는 요청에 대해서만, 서버의 `data` 폴더 안에서 파일을 찾아줘."

**예시:**

1. 브라우저가 `http://내서버.com/products/assets/images/product-1.jpg`를 요청합니다.
2. Express는 요청 URL이 `/products/assets`으로 시작하는 것을 확인합니다.
3. `express.static("data")` 미들웨어는 URL에서 `/products/assets` 부분을 제외한 나머지 경로(`images/product-1.jpg`)를 가져옵니다.
4. 그리고 그 경로를 data 폴더에 조합하여 `[프로젝트 폴더]/data/images/product-1.jpg` 파일을 찾아서 응답으로 보내줍니다.

왜 이렇게 사용할까요?

1. 보안 및 구조 숨기기: 클라이언트는 URL만 보고 서버의 실제 폴더 구조가 data인지 files인지 storage인지 알 수 없습니다. 실제 파일 시스템 구조를 외부에 노출하지 않을 수 있습니다.
2. 유연한 URL 관리: 실제 폴더 이름과 상관없이 원하는 URL 구조를 만들 수 있습니다.

### `express.urlencoded()`와 Form 데이터

**문제 상황: 왜 이게 필요한가?**

HTML의 `<form>` 태그를 통해 사용자가 데이터를 서버로 전송(submit)할 때, 데이터는 HTTP 요청의 본문(body) 에 담겨서 보내집니다. 하지만 **Express는 기본적으로 이 본문(body)을 해석하는 방법**을 모릅니다. 그래서 `req.body`를 그냥 출력해보면 `undefined`가 나옵니다.

**해결책: `express.urlencoded()` 미들웨어**

이 미들웨어는 `<form>` 태그를 통해 전송된 요청의 본문(body)을 해석해서, 우리가 다루기 쉬운 JavaScript 객체 형태로 `req.body`에 넣어주는 역할을 합니다.

**`urlencoded`란 무슨 뜻인가?**

"URL Encoded"는 form 데이터를 서버로 보낼 때 사용되는 표준 인코딩 방식 중 하나입니다. `Content-Type` 헤더가 `application/x-www-form-urlencoded`로 설정되며, 데이터는 아래와 같은 형식의 문자열로 변환됩니다.
`key1=value1&key2=value2`

**예시:**

```
<form action="/login" method="POST">
    <input type="text" name="username" value="testuser">
    <input type="password" name="password" value="1234">
    <button type="submit">로그인</button>
</form>
```

위 form 데이터를 전송하면, 요청 본문(body)에는 `username=testuser&password=1234` 라는 문자열이 담겨서 서버로 갑니다. `express.urlencoded()` 미들웨어는 이 문자열을 파싱해서 `req.body`를 아래와 같은 객체로 만들어 줍니다.

```
 {
     username: 'testuser',
     password: '1234'
 }
```

- `extended: false`: Node.js의 기본 내장 querystring 모듈을 사용하여 URL 인코딩된 데이터를 분석합니다. 단순한 키-값 쌍만 처리할 수 있습니다.
- `extended: true`: qs라는 더 강력한 라이브러리를 사용합니다. user[name]=John과 같은 복잡한 객체나 배열도 파싱할 수 있습니다. 특별한 경우가 아니면 보통 false로도 충분합니다.

**다른 데이터 전송 방식**

- `JSON`: 현대적인 웹 애플리케이션(특히 API 서버, React/Vue 등)에서는 JSON 형식을 더 많이 사용합니다. 이 데이터를 처리하려면 `app.use(express.json());` 미들웨어를 사용해야 합니다.
- `Multipart/form-data`: form 데이터에 `파일`이 포함될 때 사용되는 방식입니다. 이 방식은 `express.urlencoded()`나 `express.json()`으로는 처리할 수 없으며, `multer`와 같은 별도의 미들웨어 라이브러리를 설치해서 사용해야 합니다.

### Express의 미들웨어

`app.use()`에 라우터 객체를 전달하면, Express는 그 라우터 객체를 하나의 거대한 미들웨어 덩어리처럼 취급합니다.

Express에서 '미들웨어'는 요청(Request)을 받아서 응답(Response)을 보내기까지의 과정(요청-응답 사이클)에 참여하는 모든 종류의 함수를 가리키는 넓은 개념입니다.

조금 더 구체적으로 나눠보면, 미들웨어는 역할에 따라 다음과 같이 부를 수 있습니다.

**일반 미들웨어 (Application-level Middleware)**

`app.use()`를 통해 등록되며, 특정 기능을 수행한 후 next()를 호출해 제어권을 다음 미들웨어로 넘기는 가장 일반적인 형태입니다.
예시: `express.urlencoded()`, `express.json()`

**라우터 (Router-level Middleware)**

`express.Router()`로 생성된 객체입니다.
관련된 경로들을 그룹화하고, 그 그룹 전체가 하나의 거대한 미들웨어처럼 동작합니다.

**라우트 핸들러 (Route Handler)**

`app.get()`, `router.post()` 등의 마지막 인자로 전달되어, 실질적인 로직을 처리하고 클라이언트에게 최종 응답을 보내는 함수입니다.
이 함수는 보통 next()를 호출하지 않고 res.send(), res.json(), res.render() 등으로 요청-응답 사이클을 종료시킵니다.
이 라우트 핸들러 역시 (req, res)를 다루기 때문에 넓은 의미에서는 미들웨어의 한 종류로 볼 수 있습니다. **'마지막 미들웨어'**인 셈이죠.

**오류 처리 미들웨어 (Error-handling Middleware)**

유일하게 (err, req, res, next) 4개의 인자를 갖는 특별한 형태의 미들웨어입니다.
따라서 사용자가 말씀하신 것처럼, Express에서는 라우터를 포함한 모든 리퀘스트 핸들러가 근본적으로 '미들웨어'라는 개념 위에 구축되어 있습니다.

아래 흐름을 보시면 더 명확하게 이해되실 겁니다.

요청 -> 미들웨어 1 (로깅) -> 미들웨어 2 (세션 검사) -> 라우터 ('/admin') -> 라우트 핸들러 (GET /products) -> 응답
