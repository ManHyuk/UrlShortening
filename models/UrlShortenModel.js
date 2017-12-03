const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);


/**********
 * long url의 값이 있는지 확인후 저장
 * @param data
 * @returns {Promise.<TResult>}
 */
exports.setShortening = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT longUrl
      FROM urls
      WHERE longUrl = ? 
      `;
    pool.query(sql, [data.longUrl], (err, rows) => {
      if(err){
        reject(err);
      } else {
        let urlIsNew = false;
        if (rows.length === 0 ) { // 디비에 저장된 longUrl이 없는경우
          urlIsNew = true;
          resolve(urlIsNew);
        } else { // 디비에 저장된 longUrl값이 있는 경우
          urlIsNew = false;
          resolve(urlIsNew);
        }
      }
    });
  }).then((urlIsNew) => {
    if (urlIsNew){ // urlIsNew가 true일 경우(저장된 longUrl이 없는경우)
      return new Promise((resolve, reject) => {
        const sql =
          `
          INSERT INTO urls(longUrl, shortUrl)
          VALUES (? , ?)
          `;
        pool.query(sql, [data.longUrl, data.shortUrl], (err, rows) => {
          if (err){
            reject(err);
          } else {
            if (rows.affectedRows === 0 ){ // insert 실패
              const _err = new Error("Insert Custom Error");
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
          });
        });
      });
    } else { // urlIsNew가 false일 경우(저장된 longUrl이 있는 경우)
      return new Promise((resolve, reject) => {
        const sql =
          `
          SELECT longUrl, shortUrl
          FROM urls
          WHERE longUrl = ?
          `;
        pool.query(sql, [data.longUrl], (err, rows) => {
          if (err){
            reject(err);
          } else {
            resolve(rows[0]);
          }
        });
      });
    }
  });
};

/***********
 * 난수 중복 검사
 * @param data
 * @returns {Promise}
 */
exports.checkRandomString = (data) => {
  return new Promise((resolve, reject) => {
    const sql =
      `
      SELECT shortUrl
      FROM urls
      WHERE shortUrl = ?
      `;
    pool.query(sql, [data], (err, rows) => {
      if(err){
        reject(err);
      } else {
        if (rows.length === 0){ // 난수 중복 없음
          resolve(true);
        } else { // 난수 중복
          resolve(false);
        }
      }
    });
  });
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
      SELECT longUrl
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