'use strict';

const urlShortnenCtrl = require('../controllers/UrlShortenCtrl');

module.exports = (router) => {

  router.route("/:url")
    .get(urlShortnenCtrl.shortening);

  return router;
};
