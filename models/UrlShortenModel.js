const mysql = require('mysql');
const DBConfig = require('./../config/DBConfig');
const pool = mysql.createPool(DBConfig);
const transactionWrapper = require('./TransactionWrapper');


exports.shortening = (data) => {
  return new Promise((resolve, reject) => {

  });
};