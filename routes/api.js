'use strict';

const urlShortnenCtrl = require('../controllers/UrlShortenCtrl');

module.exports = (router) => {



  router.route("")
    .get(urlShortnenCtrl.getShortening)
    .post(urlShortnenCtrl.setShortening);

  router.route("/:url")
    .get(urlShortnenCtrl.redirectUrl);

  return router;
};
