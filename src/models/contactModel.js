import mongoose from "mongoose";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userID: String,
  contactId: String,
  status: {type: Boolean, default: false},
  createAt: {type: Number, default: Date.now},
  updateAt: {type: Number, default: null},
  deleteAt: {type: Number, default: null}
});

//Tao ban ghi, this la contactschema
ContactSchema.statics = {
  createNew(item) {
    return this.create(item);
  },
  //Hàm tìm kiếm tất cả những bản ghi liên quan đến user
  findAllByUser(userId) {
    return this.find({
      //Khi A kết bạn với B, A sẽ là userId và B là contactId và ngược lại
      $or: [
        {"userId": userId},
        {"contactId": userId}
      ]
    }).exec();
  }
};

module.exports = mongoose.model("contact", ContactSchema);
