const production = {
  PORT :3000,
  DB:{
      host:"localhost",
      user:'root',
      database:'vue',
      password:'root',
      port:"3306",
      connectionLimit:20,
      connectTimeout: 5000,
  },
}
const development = {
  PORT :4000,
  DB:{
      host:"localhost",
      user:'root',
      database:'vue',
      password:'root',
      port:"3306",
      connectionLimit:20,
      connectTimeout: 5000,
  },
}

module.exports = { production, development}
/*
각각의 객체(production, development)는 포트번호(PORT)와 데이터베이스(DB)에 대한 설정 정보를 담고 있음
DB 객체는 MySQL 데이터베이스의 호스트, 사용자 이름, 데이터베이스 이름, 비밀번호, 포트번호, 최대 연결수(connectionLimit)와
연결 시도 시간(connectTimeout)에 대한 설정 정보를 담고 있음
module.exports는 이 파일에서 선언된 객체를 외부에서 사용할 수 있도록 내보내는 역할을 함
따라서 다른 파일에서 이 객체를 import 할 수 있음
*/
