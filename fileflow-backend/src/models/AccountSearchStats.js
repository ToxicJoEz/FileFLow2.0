import mongoose from 'mongoose';

// Numeric aggregates only. No query terms, document identifiers or contents.
const schema = new mongoose.Schema({
  _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  trackingSince: {type: Date, required: true},
  lastReceivedAt: Date, lastSearchAt: Date,
  totals: {type: mongoose.Schema.Types.Mixed, default: {}},
  statuses: {type: mongoose.Schema.Types.Mixed, default: {}},
  formats: {type: mongoose.Schema.Types.Mixed, default: {}},
  modes: {type: mongoose.Schema.Types.Mixed, default: {}},
}, {strict: 'throw', versionKey: false});
export default mongoose.model('AccountSearchStats', schema);
