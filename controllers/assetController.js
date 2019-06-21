const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Asset = require('../models/asset');
const User = require('../models/user');


// POST /asset/all
exports.getAll = async (req, res, next) => {
  console.log(`[getAll] req.body`, req.body);

  const userId = req.body.userId;
  const currentPage = req.query.page || 1;
  const perPage = 50;
  try {
    // get the number of data related to this user
    const userTotalItems = await Asset.find({ creator: {$in: userId} }).countDocuments();
    // get "all" data related to this user
    const userAssets = await Asset.find({ creator: {$in: userId} })
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    // BAD SOLUTION ///////////////////////////////////////////
    // filter the data related to the user
    // const userAssets = assets.filter(asset => JSON.stringify(asset.creator._id) === JSON.stringify(userId));

    res.status(200).json({
      message: 'Fetched assets successfully.',
      assets: userAssets,
      totalItems: userTotalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// POST /asset/random-one
exports.getRandomOne = async (req, res, next) => {
    // required third party for findRandom
    // const asset = await Asset.findRandom({}, {}, {limit: 1});

    const userId = req.body.userId;

    const userAssets = await Asset.find({ creator: {$in: userId} })
      .populate('creator')
      .sort({ createdAt: -1 });

    // Get the count of all data related to this user
    const totalItems = await Asset.find({ creator: {$in: userId} }).countDocuments();
    // Get a random entry
    const random = Math.floor(Math.random() * totalItems);
    const randomAsset = userAssets[random];

    try {
      if (!randomAsset) {
        const error = new Error('Could not find randomAsset.');
        error.statusCode = 404;
        throw error;
      }
      const creatorId = await User.findById(randomAsset.creator);
      res.status(200).json({
        message: 'randomAsset fetched.',
        randomAsset: randomAsset,
        creatorId: creatorId
      });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };


// POST /asset/add
exports.createAsset = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const japanese = req.body.japanese;
  const english = req.body.english;
  const asset = new Asset({
    japanese: japanese,
    english: english,
    creator: req.userId
  });
  try {
    await asset.save();
    const user = await User.findById(req.userId);
    user.assets.push(asset);
    await user.save();
    // io.getIO().emit('assets', {
    //   action: 'create',
    //   asset: { ...asset._doc, creator: { _id: req.userId, name: user.name } }
    // });
    res.status(201).json({
      message: 'Asset created successfully!',
      asset: asset,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// PUT /asset/:assetId
exports.updateAsset = async (req, res, next) => {
  const assetId = req.params.assetId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const japanese = req.body.japanese;
  const english = req.body.english;
  try {
    const asset = await Asset.findById(assetId).populate('creator');
    if (!asset) {
      const error = new Error('Could not find asset.');
      error.statusCode = 404;
      throw error;
    }
    if (asset.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    asset.japanese = japanese;
    asset.english = english;
    const result = await asset.save();
    // io.getIO().emit('assets', { action: 'update', asset: result });
    res.status(200).json({ message: 'asset updated!', asset: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// DELETE /asset/:assetId
exports.deleteAsset = async (req, res, next) => {
  const assetId = req.params.assetId;
  try {
    const asset = await Asset.findById(assetId);

    if (!asset) {
      const error = new Error('Could not find asset.');
      error.statusCode = 404;
      throw error;
    }
    if (asset.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    await Asset.findByIdAndRemove(assetId);

    const user = await User.findById(req.userId);

    const userAssetIds = user.assets.pull(assetId);

    // BAD SOLUTION ///////////////////////////////////////////
    // let userAssets = [];
    // userAssetIds.map(async id => {
    //   let uAsset = await Asset.findById(id);
    //   userAssets.push(uAsset);
    // });

    const userAssets = await Asset.find({ _id: {$in: userAssetIds} }).sort({ createdAt: -1 });

    await user.save();
    // io.getIO().emit('assets', { action: 'delete', asset: assetId });
    res.status(200).json({
      message: 'Deleted asset.',
      assets:  userAssets});
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
