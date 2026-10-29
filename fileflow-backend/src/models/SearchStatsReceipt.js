import mongoose from 'mongoose';

// Minimal permanent deduplication key. Contains no search details or timestamps.
// Keeping the key prevents delayed retries from double-counting after log expiry.
const schema = new mongoose.Schema({_id: {type: String, required: true}}, {versionKey: false, strict: 'throw'});
export default mongoose.model('SearchStatsReceipt', schema);
