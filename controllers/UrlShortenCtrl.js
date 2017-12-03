'use strict';
const QRCode = require('qrcode');

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
  let longUrl = req.body.longUrl;

  const lastChar = longUrl.charAt(longUrl.length-1);
  if  (lastChar === '/'){  // longUrl 마지막에 '/'가 붙는다면 삭제
    longUrl = longUrl.slice(0,-1);
  }

  let shortUrl;

  while (true){ // 난수 중복 검사
    let temp;
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


  // QR코드 생성 및 콜백에서 렌더
  QRCode.toDataURL(longUrl, (err, url) => {

    res.render('result',
      {
        longUrl: result.longUrl,
        shortUrl:  result .shortUrl,
        img: url,
      });
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


