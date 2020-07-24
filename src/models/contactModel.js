import mongoose from "mongoose";
import { user, contact } from "../services";

let Schema = mongoose.Schema;

let ContactSchema = new Schema({
  userId: String,
  contactId: String,
  status: { type: Boolean, default: false },
  createAt: { type: Number, default: Date.now },
  updateAt: { type: Number, default: null },
  deleteAt: { type: Number, default: null }
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
        { "userId": userId },
        { "contactId": userId }
      ]
    }).exec();
  },
  //Hàm kiểm tra xem userId và contactId đã là bạn bè hay chưa
  //A: userId , B: contactId
  checkExists(userId, contactId) {
    return this.findOne({
      $or: [
        //Kiểm tra chéo
        //Trường hợp A gửi lời mời kb cho B rồi nên kiểm tra chéo để B không gửi được lời mời KB cho A
        {
          $and: [
            { "userId": userId }, //Kiểm tra userId có trùng với userId truyền vào
            { "contactId": contactId }
          ]
        },
        {
          $and: [
            { "userId": contactId },
            { "contactId": userId } //Kiểm tra userId có trùng với userId truyền vào
          ]
        }
      ]
    }).exec();
  },

  //Hàm xóa 1 yêu cầu kết bạn
  removeRequestContact(userId, contactId) {
    return this.remove({
      $and: [
        { "userId": userId }, //Kiểm tra userId có trùng với userId truyền vào
        { "contactId": contactId }
      ]
    }).exec();
  },
  //Hàm lấy danh sách user để xuất ra modal danh bạ và gọi ra cho contactService
  getContacts(userId, limit) {
    return this.find({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId }
          ]
        },
        { "status": true }
      ]
    }).sort({ "createAt": -1 }).limit(limit).exec();//{"createAt": -1} sắp xếp những ai mới add vào lên đầu
  },
  //Hàm lấy danh sách user để xuất ra modal Đang chờ xác nhận và gọi ra cho contactService
  getContactsSent(userId, limit) {
    return this.find({
      $and: [
        { "userId": userId },
        { "status": false }
      ]
    }).sort({ "createAt": -1 }).limit(limit).exec();//{"createAt": -1} sắp xếp những ai mới add vào lên đầu
  },
  //Hàm lấy danh sách user để xuất ra modal Đang chờ xác nhận và gọi ra cho contactService
  getContactsReceived(userId, limit) {
    return this.find({
      $and: [
        { "contactId": userId },
        { "status": false }
      ]
    }).sort({ "createAt": -1 }).limit(limit).exec();//{"createAt": -1} sắp xếp những ai mới add vào lên đầu
  },

  //Hàm đếm danh sách chưa xem thêm trong danh bạ
  countAllContacts(userId) {
    return this.count({
      $and: [
        {
          $or: [
            { "userId": userId },
            { "contactId": userId }
          ]
        },
        { "status": true }
      ]
    }).exec();//{"createAt": -1} sắp xếp những ai mới add vào lên đầu
  },
  //Hàm đếm danh sách chưa xem thêm trong đang chờ xác nhận
  countAllContactsSent(userId) {
    return this.count({
      $and: [
        { "userId": userId },
        { "status": false }
      ]
    }).exec();//{"createAt": -1} sắp xếp những ai mới add vào lên đầu
  },
  //Hàm đếm danh sách chưa xem thêm trong yêu cầu kết bạn
  countAllContactsReceived(userId) {
    return this.count({
      $and: [
        { "contactId": userId },
        { "status": false }
      ]
    }).exec();//{"createAt": -1} sắp xếp những ai mới add vào lên đầu
  }
};

module.exports = mongoose.model("contact", ContactSchema);
