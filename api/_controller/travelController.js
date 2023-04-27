const db = require("../../plugins/mysql"); //MySQL 데이터베이스와 통신하기 위해 mysql 모듈을 사용함
const TABLE = require("../../util/TABLE"); //util 폴더에 있는 함수들을 사용함
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");

//TRAVEL리스트의 전체 row 갯수
const getTotal = async () => {
  // const getTotal = async function () {
  try {
    const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TRAVEL}`;
    const [[{ cnt }]] = await db.execute(query);
    return cnt;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};

// 해당 id의 row 존재유무
const getSelectOne = async (id) => {
  // const getTotal = async function () {
  try {
    const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TRAVEL} WHERE id=?`;
    const values = [id];
    const [[{ cnt }]] = await db.execute(query, values);
    return cnt;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};

// 전체 TRAVEL리스트를 페이징으로 가져오기
const getList = async (req) => {
  try {
    // 마지막 id, len 갯수
    const lastId = parseInt(req.query.lastId) || 0;
    const len = parseInt(req.query.len) || 10;

    let where = "";
    if (lastId) {
      // 0은 false
      where = `WHERE id < ${lastId}`;
    }
    const query = `SELECT * FROM ${TABLE.TRAVEL} ${where} order by id desc limit 0, ${len}`;
    const [rows] = await db.execute(query);
    return rows;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};

const travelController = {
  // create : TRAVEL 리스트에 새로운 항목을 추가함
  create: async (req) => {
    const { city, country, mood, rating } = req.query;
    if (isEmpty(city) || isEmpty(country) || isEmpty(mood) || isEmpty(rating)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }

    try {
      const query = `INSERT INTO travel (city,country,mood,rating) VALUES (?,?,?,?)`;
      const values = [city, country, mood, rating];
      const [rows] = await db.execute(query, values);
      if (rows.affectedRows == 1) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT'),
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  // list : 전체 TRAVEL 리스트를 조회함
  list: async (req) => {
    // 화살표함수는 es6문법 this접근안됨
    const totalCount = await getTotal();
    const list = await getList(req);
    if (totalCount > 0 && list.length) {
      return resData(
        STATUS.S200.result,
        STATUS.S200.resultDesc,
        moment().format('LT'),
        { totalCount, list }
      );
    } else {
      return resData(STATUS.S201.result, STATUS.S201.resultDesc, moment().format('LT'));
    }
  },

  //update : TRAVEL 리스트에서 특정 항목을 수정함
  update: async (req) => {
    const { id } = req.params; // url /로 들어오는것
    const { city, country, mood, rating  } = req.query;
    if (isEmpty(id) || isEmpty(city) || isEmpty(country) || isEmpty(mood) || isEmpty(rating)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }

    try {
      const query = `UPDATE ${TABLE.TRAVEL} SET city =?, country=?, mood=?, rating=? WHERE id= ?`;
      const values = [city, country, mood, rating, id];
      const [rows] = await db.execute(query, values);
      if (rows.affectedRows == 1) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT')
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },

  //delete : TRAVEL 리스트에서 특정 항목을 삭제함
  delete: async (req) => {
    const { id } = req.params; // url /로 들어오는것
    if (isEmpty(id)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }
    const cnt = await getSelectOne(id);
    try {
      if (!cnt) {
        return resData(
          STATUS.E100.result,
          STATUS.E100.resultDesc,
          moment().format('LT')
        );
      }
      const query = `DELETE FROM ${TABLE.TRAVEL} WHERE id = ?;`;
      const values = [id];
      const [rows] = await db.execute(query, values);
      if (rows.affectedRows == 1) {
        return resData(
          STATUS.S200.result,
          STATUS.S200.resultDesc,
          moment().format('LT')
        );
      }
    } catch (e) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
    return rows;
  },

  //reset : TRAVEL 리스트의 리셋 기능 수행
  reset: async (req) => { //매개 변수로 req를 받음
    // truncate : TRAVEL 테이블을 비우고
    try {
      const query = `TRUNCATE TABLE ${TABLE.TRAVEL};`;
      await db.execute(query);
      return resData(STATUS.S200.result, STATUS.S200.resultDesc, moment().format('LT'));
    } catch (error) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }
  },
};

module.exports = travelController;

/*
travelController.js는 Node.js를 사용해 TRAVEL 리스트를 관리하는 CRUD API를 구현한 것임
*/
