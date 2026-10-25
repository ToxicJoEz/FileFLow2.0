import mongoose from 'mongoose';

// Only the closed, validated DTO reaches this collection. No legacy search fields.
const adminLogSchema = new mongoose.Schema({
  eventId:{type:String,required:true}, schemaVersion:{type:Number,required:true},
  actor:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true}, actorRole:{type:String,enum:['user','admin'],required:true},
  kind:{type:String,enum:['search','preview','export'],required:true}, searchId:String,
  status:{type:String,enum:['success','partial_failure','failed','cancelled','interrupted'],required:true},
  startedAt:{type:Date,required:true},finishedAt:{type:Date,required:true},
  environment:{type:mongoose.Schema.Types.Mixed,required:true}, config:{type:mongoose.Schema.Types.Mixed,required:true},
  metrics:{type:mongoose.Schema.Types.Mixed,required:true}, formats:{type:[mongoose.Schema.Types.Mixed],default:[]},
  issues:{type:[mongoose.Schema.Types.Mixed],default:[]},
  receivedAt:{type:Date,default:Date.now}, expiresAt:{type:Date,required:true},
}, {strict:'throw',versionKey:false});
adminLogSchema.index({actor:1,eventId:1},{unique:true});
adminLogSchema.index({receivedAt:-1,_id:-1});
adminLogSchema.index({status:1,receivedAt:-1});
adminLogSchema.index({actor:1,receivedAt:-1});
adminLogSchema.index({searchId:1,actor:1});
adminLogSchema.index({expiresAt:1},{expireAfterSeconds:0});
export default mongoose.model('AdminLog',adminLogSchema);
