const router = require('express').Router(); //express 모듈을 불러와 라우터를 생성함
const movieController = require('./_controller/movieController'); //컨트롤러 파일을 불러와서 CRUD와 테이블 초기화를 위한 라우트를 정의함


// create
router.post("/", async (req, res) => {  //router.post("/") : POST메소드를 이용해 새로운 movie를 생성하는 라우트
    const result = await movieController.create(req); //movieController.create() : 해당 함수를 호출해 새로운 movie를 생성하고, 결과를 JSON 형식으로 반환함
    res.json(result);
    });


// list
router.get('/', async (req,res)=>{ //router.get("/") : GET메소드를 통해 모든 movie를 조회하는 라우트
    const result = await movieController.list(req); //movieController.list() : 해당 함수를 호출해 모든 movie를 조회하고, 결과를 JSON 형식으로 반환함
    res.json(result);
})


// update
router.put('/:id', async (req,res)=>{ //router.put("/:id") : PUT 메소드를 통해 특정 movie를 업데이트하는 라우트
    const result = await movieController.update(req); //movieController.update() : 해당 함수를 호출해 해당 movie를 업데이트하고, 결과를 JSON 형식으로 반환함
    res.json(result);
})

// delete
router.delete('/:id', async (req,res)=>{ //router.delete("/:id") : delete 메소드를 통해 특정 movie를 삭제하는 라우트
    const result = await movieController.delete(req); //movieController.delete() : 해당 함수를 호출해 해당 movie를 삭제하고, 결과를 JSON 형식으로 반환함
    res.json(result);
})

// truncate, dummy insert
router.post('/reset', async (req,res)=>{ //router.post('/reset') : POST 메소드를 통해 테이블을 초기화하고 더미 데이터를 삽입하는 라우트
    const result = await movieController.reset(req); //movieController.reset() : 해당 함수를 호출해 테이블을 초기화하고 더미 데이터를 삽입하고, 결과를 JSON 형식으로 반환함
    res.json(result);
})

module.exports = router; //라우터 객체를 모듈로 내보냄
/*
movie.js는 Node.js에서 Express 프레임워크를 사용해 REST API를 작성하는 코드
api라는 폴더를 만들고 그안에 router를 구성할 js파일을 만듬
그리고 실제 로직을 작성할 controller 폴더를 만들어 그안에 controller.js 파일을 만듬
*/
