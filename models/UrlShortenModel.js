const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');


/**********
 * long url의 값이 있는지 확인후 저장
 * TODO 코드 중복제거, Promise 경고 제거
 * @param data
 * @returns {Promise.<TResult>}
 */
exports.setShortening = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT
        longUrl
      FROM urls
        WHERE longUrl = ? 
       `;
    pool.query(sql, [data.longUrl], (err, rows) => {
      if (err){
        reject(err);
      } else {
        let data = {};
        if (rows.length === 0 ){ // url이 존재하지 않는 경우
          data = {
            isNew: true
          };
          resolve(data);
        } else { // url이 이미 존재하는 경우
          data = {
            rows: rows[0],
            isNew: false
          };
          resolve(data);
        }
      }
    });
  }).then((prevResult) => {
    if (prevResult.isNew === true) { // url이 존재하지 않는 경우
      return new Promise((resolve, reject) => {
        const sql =
          `
        INSERT INTO urls(longUrl, shortUrl)
        VALUES (? , ?) 
         `;
        pool.query(sql,[data.longUrl,data.shortUrl],(err,rows) => {
          if (err){
            reject(err);
          } else {
            if (rows.affectedRows === 0 ){ // Insert 실패시
              const _err = new Error("url insert Error");
              reject(_err);
            } else {
              resolve(rows);
            }
          }
        });
      }).then((prevResult) => {
        return new Promise((resolve, reject) => {
          const sql =
            `
            SELECT longUrl, shortUrl
            FROM urls
            WHERE id = ?
            `;
          pool.query(sql, [prevResult.insertId], (err, rows) => {
            if (err){
              reject(err);
            } else {
              resolve(rows[0]);
            }
          })
        });
      });
    } else{
      return new Promise((resolve, reject) => {
        const sql =
          `
          SELECT
            longUrl, shortUrl
          FROM urls
            WHERE longUrl = ? 
          `;
        pool.query(sql, [data.longUrl],(err, rows)=>{
          if(err){
            reject(err);
          } else {
            resolve(rows[0]);
          }
        });
      });
    }
  })
};


/******************8
 * short url으로 long url을 검색
 * @param data
 * @returns {Promise}
 */
exports.redirectUrl = (data) =>{
  return new Promise((resolve, reject) => {
    const sql =
      `
        SELECT 
          longUrl
        FROM urls
        WHERE shortUrl = ?      
      `;
    pool.query(sql, data, (err, rows) => {
      if(err){
        reject(err);
      } else {
        resolve(rows[0]);
      }
    });
  });
};