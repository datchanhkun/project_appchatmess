import { validationResult } from "express-validator/check";
import {message} from "./../services/index";
let addNewTextEmoji = async (req,res) => {
    //Khai bao mot mang chua msg loi:
    let errorArr = [];
    //khai bao 1 validationErrors de lay req.isEmpty va mapped ra
    let validationErrors = validationResult(req);
    //Kiem tra neu co loi thi push msg ra man hinh va redirect lai register
    if (!validationErrors.isEmpty()) {
      let errors = Object.values(validationErrors.mapped());
      errors.forEach(item => {
        errorArr.push(item.msg);
      });
      return res.status(500).send(errorArr);
    }
    try {
      //Lấy dữ liệu truyền lên từ phía client textAndEmojiChat.js
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };

      let receiverId = req.body.uid;
      let messageValue = req.body.messageValue;
      let isChatGroup = req.body.isChatGroup;
      // console.log(receiverId);
      // console.log(messageValue);
      // console.log(isChatGroup);

      let newMessage = await message.addNewTextEmoji(sender,receiverId,messageValue,isChatGroup);
      let newmas
    
      return res.status(200).send({message: newMessage}); //client
    } catch (error) {
      return res.status(500).send(error);
    }
}

module.exports = {
  addNewTextEmoji: addNewTextEmoji
};
