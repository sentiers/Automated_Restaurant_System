// --------------------------------------------------------
var router = require('express').Router();
var express = require('express');
var Stock = require('../models/stock');
var path = require('path');
router.use(express.static('./app'));
// --------------------------------------------------------

// --------------------------------------------------------

//==== 모든 재고가져오기 =========================
function getAllMenu() {
  return new Promise(function (resolve, reject) {
    Stock.find()
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(500);
      });
  });
}

//==== 재고 생성하는 함수 =========================
function createMenu(data) {
  return new Promise(function (resolve, reject) {
    var newStock = new Stock(data);
    newStock.save((err) => {
      // 메뉴 저장
      if (err) {
        reject(500);
      } else {
        resolve(201);
      }
    });
  });
}

//==== 재고 수정하는 함수 =========================
function updateMenu(data, idData) {
  return new Promise(function (resolve, reject) {
    Stock.updateOne(
      { _id: idData },
      {
        $set: {
          stock_name: data.stock_name,
          stock_order: {
            order_company: data.stock_order.order_company,
            order_unit: data.stock_order.order_unit,
            order_price: data.stock_order.order_price,
            order_phone: data.stock_order.order_phone,
          },
          stock_img: data.stock_img,
        },
      }
    )
      .then(() => {
        resolve(200);
      })
      .catch((err) => {
        // 재고를 찾을수없을때
        reject(404);
      });
  });
}

//==== 재고 id 별로 조회 함수 =========================
function getMenuById(idData) {
  return new Promise(function (resolve, reject) {
    Stock.findOne({
      _id: idData,
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        // 재고를 찾을수없을때
        reject(404);
      });
  });
}

//==== 재고 삭제 함수 =========================
function removeMenu(idData) {
  return new Promise(function (resolve, reject) {
    Stock.deleteOne({
      _id: idData,
    })
      .then(() => {
        resolve(200);
      })
      .catch((err) => {
        // 재고를 찾을수없을때
        reject(404);
      });
  });
}

// ----------------------------------------------------------------

//==== 전체 재고 조회 =============================
router.get('/', function (req, res, next) {
  getAllMenu()
    .then((data) => {
      res.render('stock', { datas: data });
    })
    .catch((errcode) => {
      console.log('err');
    });
});

//==== 재고 생성 =============================
router.get('/create', function (req, res, next) {
  res.render('stock_create');
});

router.post('/create', function (req, res, next) {
  createMenu(req.body)
    .then(() => {
      res.redirect('/stockpage');
    })
    .catch((errcode) => {
      console.log(errcode);
    });
});

//==== id와 일치하는 재고 조회 =============================
router.get('/:id', function (req, res, next) {
  getMenuById(req.params.id)
    .then((data) => {
      res.render('stock_view', data);
    })
    .catch((errcode) => {
      console.log(errcode);
    });
});

//==== 재고수정 =============================
router.post('/update/:id', function (req, res, next) {
  updateMenu(req.body, req.params.id)
    .then(() => {
      res.redirect('/stockpage');
    })
    .catch((errcode) => {
      console.log(errcode);
    });
});

//==== 재고 삭제 =============================
router.get('/remove/:id', function (req, res, next) {
  removeMenu(req.params.id)
    .then(() => {
      res.redirect('/stockpage');
    })
    .catch((errcode) => {
      console.log(errcode);
    });
});

//====  =============================

// --------------------------------------------------------
module.exports = router;
