const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator/check');

const Asset = require('../models/asset');
const User = require('../models/user');


// GET /asset/all
exports.getAll = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 3;
  try {
    const totalItems = await Asset.find().countDocuments();
    const assets = await Asset.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Fetched assets successfully.',
      assets: assets,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


// TODO: later
// GET /asset/random-one
// exports.getRandomOne = async (req, res, next) => {
//     const assetId = req.params.AssetId;
//     const Asset = await Asset.findById(AssetId);
//     try {
//       if (!Asset) {
//         const error = new Error('Could not find Asset.');
//         error.statusCode = 404;
//         throw error;
//       }
//       console.log(`Asset`, Asset);
//       const creatorId = await User.findById(Asset.creator);
//       res.status(200).json({ message: 'Asset fetched.', Asset: Asset, creatorId: creatorId });
//     } catch (err) {
//       if (!err.statusCode) {
//         err.statusCode = 500;
//       }
//       next(err);
//     }
//   };


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
  let imageUrl = req.body.image;
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
    const result = await Asset.save();
    // io.getIO().emit('assets', { action: 'update', asset: result });
    // res.status(200).json({ message: 'asset updated!', asset: result });
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
    user.assets.pull(assetId);
    await user.save();
    // io.getIO().emit('assets', { action: 'delete', asset: assetId });
    // res.status(200).json({ message: 'Deleted asset.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
