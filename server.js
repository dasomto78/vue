const config = require('./config').development; //config 객체를 require 하여 개발 환경(development)에 맞는 포트번호를 가져옴
const express = require('express');
const http = require('http');

const app = express(); //Express 프레임워크를 사용해 애플리케이션 객체를 생성함 => HTTP 요청에 대한 핸들링을 담당함
const port = config.PORT;
/*
cors 모듈 사용해 CORS 활성화함. origin 옵션은 모든 출처(*)에서의 요청을 허용하도록 설정하고,
credential 옵션을 true로 설정하여 사용자 인증이 필요한 리소스에 접근할 수 있도록 설정함
*/
const cors = require('cors');
let corsOptions = {
	origin: '*',
	credential: true,
};
app.use(cors(corsOptions));
//app.use() 함수는 미들웨어를 등록하는 함수로, 해당 미들웨어는 요청이 발생할 때마다 자동으로 실행됨
//미들웨어 : 요청과 응답에 대한 중간 처리를 수행하는 함수

//body parser를 등록하여 JSON과 urlencoded 형식의 데이터를 파싱할 수 있도록 함
//body.urlencoded()를 등록하면 자동으로 req에 body 속성이 추가되고 저장됨. extended는 중첩된 객체표현을 허용하지 말지를 정하는 것임
app.use(express.json());
app.use(express.urlencoded({extended : true }));

//autoRouter 모듈 이용해 자동으로 라우팅 처리함. 이 모듈은 라우트 파일을 자동으로 등록해주는 역할을 함
const autoRoute = require('./autoRoute');
autoRoute('/api',app);

//server => http 모듈을 사용해 서버를 생성하고, listen 함수를 호출해 해당 포트에서 서버를 시작함
const webServer = http.createServer(app);
webServer.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})

/*
server.js는 Express 프레임워크를 사용한 웹 서버 구성 코드임
*/
