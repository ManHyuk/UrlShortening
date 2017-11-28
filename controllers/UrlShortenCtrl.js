'use strict';

// const urlShortenModel = require('../models/UrlShortenModel');

exports.shortening = async(req, res, next)=>{
  const params = req.params.url;
  try {

  }catch (error){

  }


  res.render('index',  { title: params});
};