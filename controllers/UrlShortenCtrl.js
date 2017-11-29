'use strict';

const urlShortenModel = require('../models/UrlShortenModel');

/******
 * Main 화면
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<void>}
 */
exports.getShortening = async(req, res, next) => {
  res.render('index');
};


/*******
 * 난수 생성 함수
 * @returns {string}
 */
const randomString = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  const stringLength = 8;
  let randomString = '';
  for (let i=0; i<stringLength; i++) {
    let rnum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rnum,rnum+1);
  }

  return randomString;
};


/**********
 * 받은 long Url을 short Url로 변경
 * TODO url 유효성 검사
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.setShortening = async(req, res, next)=>{

  let result = '';
  const longUrl = req.body.longUrl;

  let temp ;
  let shortUrl;


  //TODO 난수 생성 함수로 옮기기
  while (true){ // 난수 중복 검사
      let data = randomString();
      temp = await urlShortenModel.checkRandomString(data);
      if (temp){
        shortUrl = data;
        break;
      }
  }

  try {
    const data = {
      longUrl: longUrl,
      shortUrl: shortUrl
    };
    result = await urlShortenModel.setShortening(data)

  }catch (error){
    console.log(error);
    return next(error);
  }

  res.render('result',
    {
      longUrl: result.longUrl,
      shortUrl:  result .shortUrl
    });
};

/*************
 * 클라에서 받은 난수를 디비 검색을 통해 원래 주소로 리다이렉트
 * @param req
 * @param res
 * @param next
 * @returns {Promise.<*>}
 */
exports.redirectUrl = async(req, res, next) => {

  let result = '';

  try{
    const data = req.params.url;

    result = await urlShortenModel.redirectUrl(data);
  } catch (error){
    console.log(error);
    return next(error);
  }
  res.redirect(result.longUrl);
};


