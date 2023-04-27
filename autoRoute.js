const fs = require("fs");
const path = require("path");


module.exports = function (root, app) {
  //폴더를 탐색함
  const dir = fs.readdirSync(path.join(__dirname, root), {
    withFileTypes: true, // withFileTypes: 파일이 fs.Dirent 객체로 반환되는지 여부를 지정하는 부울 값입니다. 기본값은 '거짓'입니다.
  });
	//console.log('dir',dir);

  //각 파일을 검사함
  dir.forEach((p) => {
		//console.log(`p.name : .${root}/${p.name}`);
    if (p.isDirectory()) {
      //폴더인 경우 재귀적으로 탐색함 /api/todo, app
      if (p.name != "_controller") {
        arguments.callee(`${root}/${p.name}`, app);
      }
    } else {
      //파일인 경우 컨트롤러를 동록함
      let moduleName = '/'+ p.name.replace(/\.js/g, "");
      if(moduleName == '/index'){
        moduleName="";
      }
			//console.log(`p.name : ${root}${moduleName}`,`.${root}/${p.name}`);
      app.use(`${root}${moduleName}`, require(`.${root}/${p.name}`));
    }
  });
};

/*
autoRoute.js는 autoRoute 함수를 정의하는 모듈로, autoRoute 함수는 지정된 경로의 컨트롤러를 자동으로 등록하는 함수이며 폴더를 탐색하여 컨트롤러를 찾음
함수의 호출은 autoRoute('api', app);↓
'/api'는 루트 경로를 지정하고, 'app'은 Express 애플리케이션 객체로 컨트롤러를 등록할 때 이 객체의 use 함수를 사용함
*/
/*
1. 지정된 경로에서 파일 목록을 가져옴
2. 각 파일에 대해 다음을 수행함
  2-1. 파일이 폴더인 경우, 재귀적으로 탐색함
  2-2. 파일이 JavaScript 파일인 경우, 컨트롤러를 등록함. 등록할 때는 파일명에서 .js 확장자를 제거한 이름을
  모듈 경로로 사용함. 그리고 Express 애플리케이션 객체의 'use' 함수를 사용해 해당 모듈을 등록함
*/
