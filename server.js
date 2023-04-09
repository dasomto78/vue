const config = require('./config').development;
const express = require('express');
const http = require('http');

const app = express();
const port = config.PORT;
const cors = require('cors');

//cors
let corsOptions = {
	origin: '*', // 출처 허용 옵션
	credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};
app.use(cors(corsOptions));

//autoRouter
const autoRoute = require('./autoRoute');
autoRoute('/api',app);

//server
const webServer = http.createServer(app);
webServer.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})
