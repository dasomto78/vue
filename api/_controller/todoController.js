const db = require("../../plugins/mysql"); //MySQL 데이터베이스와 통신하기 위해 mysql 모듈을 사용함
const TABLE = require("../../util/TABLE"); //util 폴더에 있는 함수들을 사용함
const STATUS = require("../../util/STATUS");
const { resData, currentTime, isEmpty } = require("../../util/lib");
const moment = require("../../util/moment");

//TODO리스트의 전체 row 갯수
const getTotal = async () => {
  // const getTotal = async function () {
  try {
    const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TODO}`;
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
    const query = `SELECT COUNT(*) AS cnt FROM ${TABLE.TODO} WHERE id=?`;
    const values = [id];
    const [[{ cnt }]] = await db.execute(query, values);
    return cnt;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};

// 전체 TODO리스트를 페이징으로 가져오기
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
    const query = `SELECT * FROM ${TABLE.TODO} ${where} order by id desc limit 0, ${len}`;
    const [rows] = await db.execute(query);
    return rows;
  } catch (e) {
    console.log(e.message);
    return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
  }
};

const todoController = {
  // create : TODO 리스트에 새로운 항목을 추가함
  create: async (req) => {
    const { title, done } = req.query;
    if (isEmpty(title) || isEmpty(done)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }

    try {
      const query = `INSERT INTO todo (title,done) VALUES (?,?)`;
      const values = [title, done];
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

  // list : 전체 TODO 리스트를 조회함
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

  //update : TODO 리스트에서 특정 항목을 수정함
  update: async (req) => {
    const { id } = req.params; // url /로 들어오는것
    const { title, done } = req.body;
    if (isEmpty(id) || isEmpty(title) || isEmpty(done)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }

    try {
      const query = `UPDATE ${TABLE.TODO} SET title =?, done=? WHERE id= ?`;
      const values = [title, done, id];
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

  //delete : TODO 리스트에서 특정 항목을 삭제함
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
      const query = `DELETE FROM ${TABLE.TODO} WHERE id = ?;`;
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

  //reset : TODO 리스트의 리셋 기능 수행
  reset: async (req) => { //매개 변수로 req를 받음
    // truncate : TODO 테이블을 비우고
    try {
      const query = `TRUNCATE TABLE ${TABLE.TODO};`;
      await db.execute(query);
    } catch (error) {
      console.log(e.message);
      return resData(STATUS.E300.result, STATUS.E300.resultDesc, moment().format('LT'));
    }

    // insert : 지정된 길이만큼 더미 데이터를 삽입함
    const { title } = req.body; //req.body에서 title, done, len 값을 읽어오며 title은 필수적인 값임
    const done = req.body.done || "N";
    const len = req.body.len || 100; //len 값이 없는 경우, 기본값으로 100을 사용함
    if (isEmpty(title)) {
      return resData(STATUS.E100.result, STATUS.E100.resultDesc, moment().format('LT'));
    }
    try {
      //더미쌓기 타이틀에 1씩추가하면서 인서트하기
      let query = `INSERT INTO todo (title, done) VALUES`; //title과 done 값을 사용해 더미 데이터를 생성하고 SQL쿼리를 만듬. 더미 데이터의 수는 len 값에 의해 결정됨 => .values( data1 ), (data2),,,
      let arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(`('${title}_${i}', '${done}')`);
      }
      query = query + arr.join(",");
      const [rows] = await db.execute(query);

      if (rows.affectedRows != 0) {
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
};

module.exports = todoController;

/*
todoController.js는 Node.js를 사용해 TODO 리스트를 관리하는 CRUD API를 구현한 것임
*/
