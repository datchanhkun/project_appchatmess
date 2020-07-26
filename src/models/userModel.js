import mongoose from "mongoose";
import bcrypt from "bcrypt";
let Schema = mongoose.Schema;

let UserSchema = new Schema({
  username: String,
  gender: { type: String, default: "male" },
  phone: { type: String, default: null },
  address: { type: String, default: null },
  avatar: { type: String, default: "avatar-default.jpg" },
  role: { type: String, default: "user" },
  local: {
    email: { type: String, trim: true },
    password: String,
    isActive: { type: Boolean, default: true },
    verifyToken: String
  },
  facebook: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  google: {
    uid: String,
    token: String,
    email: { type: String, trim: true }
  },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null }
});

//Tao ban ghi, this la UserSchema
UserSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  findByEmail(email) {
    return this.findOne({ "local.email": email }).exec();
  },
  //Trả lại toàn bộ thông tin user
  findUserByIdToUpdatePassword(id) {
    return this.findById(id).exec();
  },
  //Trả lại thông tin user và loại bỏ password để trả lại cho người dùng
  findUserByIdForSessionToUse(id) {
    return this.findById(id,{"local.password": 0}).exec();
  },
  findByFacebookUid(uid) {
    return this.findOne({ "facebook.uid": uid }).exec();
  },
  findByGoogleUid(uid) {
    return this.findOne({ "google.uid": uid }).exec();
  },
  updateUser(id, item) {
    //return về dữ liệu cũ sau khi update thành công
    return this.findByIdAndUpdate(id, item).exec();
  },
  updatePassword(id, hashedPassword) {
    return this.findByIdAndUpdate(id, { "local.password": hashedPassword }).exec();
  },
  //Hàm tìm kiếm user còn lại trong contact sau khi đã lọc
  findAllForAddContact(deprecatedUserIds, keyword) {
    return this.find({
      $and: [
        //"nin: viet tat cua not in"
        //Lọc ra những id không nằm trong mảng deprecatedUserIds
        { "_id": { $nin: deprecatedUserIds } },
        { "local.isActive": true },
        {
          $or: [
            //Tìm những user có username gần giống với keyword mà người dùng nhập vào theo $regex
            { "username": { "$regex": new RegExp(keyword, "i") } },
            { "local.email": { "$regex": new RegExp(keyword, "i") } },
            { "facebook.email": { "$regex": new RegExp(keyword, "i") } },
            { "google.email": { "$regex": new RegExp(keyword, "i") } }
          ]
        }
      ]
    }, { _id: 1, username: 1, address: 1, avatar: 1 }).exec(); //cho phép lấy ra những field trong DB ra
  },
  //Hàm lấy những trường cần thiết để view ra tìm kiếm theo id
  getNormalUserDataById(id) {
    return this.findById(id, { _id: 1, username: 1, address: 1, avatar: 1 }).exec();
  }
};

UserSchema.methods = {
  comparePassword(password) {
    //Ham bat dong bo nen return ve 1 promise co ket qua true hoac false
    return bcrypt.compare(password, this.local.password);
  }
};
module.exports = mongoose.model("user", UserSchema);
