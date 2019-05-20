const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assetSchema = new Schema(
  {
    japanese: {
      type: String,
      required: true
    },
    english: {
      type: String,
      required: true
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);