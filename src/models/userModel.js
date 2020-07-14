import mongoose from "mongoose";
import bcrypt from "bcrypt";
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: {type: String, default: "male"},
  phone: {type: Number,default: null},
  address: {type: String, default: null},
  avatar: {type: String,default: "avatar-default.jpg"},
  role: {type: String, default: "user"},
  local: {
    email: {type: String, trim: true},
    password: String,
    isActive: {type: Boolean, default: true},
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: {type: String, trim: true}
  },
  google: {
    uid: String,
    token: String,
    email: {type: String, trim: true}
  },
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

//Tao ban ghi, this la UserSchema
UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({"local.email": email}).exec();
  },
  findUserById(id) {
    return this.findById(id).exec();
  },
  findByFacebookUid(uid) {
    return this.findOne({"facebook.uid": uid}).exec();
  },
  findByGoogleUid(uid) {
    return this.findOne({"google.uid": uid}).exec();
  },
  updateUser(id, item) {
    //return về dữ liệu cũ sau khi update thành công
    return this.findByIdAndUpdate(id,item).exec();
  }
};

UserSchema.methods = {
  comparePassword(password) {
    //Ham bat dong bo nen return ve 1 promise co ket qua true hoac false
    return bcrypt.compare(password,this.local.password);
  } 
};
module.exports = mongoose.model("user", UserSchema);