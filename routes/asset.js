const express = require('express');
const { body } = require('express-validator/check');

const assetController = require('../controllers/assetController');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// POST /asset/all
router.post('/all', isAuth, assetController.getAll);

// POST /asset/all:term
router.post('/all/:term', isAuth, assetController.getTermItems);

// POST /asset/random-one
router.post('/random-one', isAuth, assetController.getRandomOne);

// POST /asset/add
router.post(
  '/add',
  isAuth,
  [
    body('japanese')
      .trim()
      .isLength({ min: 1 }),
    body('english')
      .trim()
      .isLength({ min: 1 })
  ],
  assetController.createAsset
);

// PUT /asset/:assetId
router.put(
  '/:assetId',
  isAuth,
  [
    body('japanese')
      .trim()
      .isLength({ min: 1 }),
    body('english')
      .trim()
      .isLength({ min: 1 })
  ],
  assetController.updateAsset
);

// DELETE /asset/:assetId
router.delete('/:assetId', isAuth, assetController.deleteAsset);

module.exports = router;
