var express = require('express');
var router = express.Router();
var db = require('../db');



router.get('/', function (req, res) {
    let sql = "SELECT concat(11*floor(sd.AGE/11), '-', 11*floor(sd.AGE/11) + 10) as 'Age', COUNT(*) AS 'Number' FROM simulation_data AS sd INNER JOIN im_sim_0_pt_checks AS im ON sd.USER_ID = im.USER_ID group by 1 ORDER BY sd.AGE;";
    console.log(sql);
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

router.get('/', function (req, res) {
    let sql = "SELECT DISTINCT 'BUS' AS Transport, COUNT(*) AS Number FROM im_sim_0_pt_checks AS Number WHERE CHECK_TYPE LIKE '%BUS%' UNION SELECT DISTINCT 'TRAIN' AS Transport, COUNT(*) AS Number FROM im_sim_0_pt_checks AS Number WHERE CHECK_TYPE LIKE '%TRAIN%' UNION SELECT DISTINCT 'SUBWAY' AS Transport, COUNT(*) AS Number FROM im_sim_0_pt_checks AS Number WHERE CHECK_TYPE LIKE '%SUBWAY%';";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

router.get('/', function (req, res) {
    let sql = "SELECT concat(HOUR(CONVERT(DATE_TIME, DATETIME)), '-', HOUR(CONVERT(DATE_TIME, DATETIME)) + 1) as Hour, COUNT(*) AS Number FROM simulation_data group by 1 ORDER BY HOUR(CONVERT(DATE_TIME, DATETIME))";
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});


module.exports = router
