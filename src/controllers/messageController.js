import { validationResult } from "express-validator/check";
import {message} from "./../services/index";
import multer from "multer";
import { app } from "./../config/app";
import { transErrors } from "./../../lang/vi";
import { transSuccess } from "./../../lang/vi";
import fsExtra from "fs-extra";
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
};

//Khai bao' noi upload image len server
let storageImageChat = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, app.image_message_directory);
  },
  filename: (req, file, callback) => {
    let math = app.image_message_type;
    //Kiem tra dinh dang img upload len bi loi
    if (math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.image_message_type, null);
    }
    //Kiem tra tên của ảnh có thể trùng, nên check thời gian up lên và khởi tạo 1 chuỗi ngẫu nhiên bằng uuidv4
    let imageName = `${file.originalname}`;
    callback(null, imageName);
  }
});

//Validate error truoc khi upload img
let imageMessageUploadFile = multer({
  storage: storageImageChat, //nơi lưu trữ
  limits: { fileSize: app.image_message_limit_size } //validation giới hạn 1MB cho img
}).single("my-image-chat"); //cho phép upload 1 img và truyền 'my-image-chat' vào formData
let addNewImage = (req,res) => {
  imageMessageUploadFile(req,res, async (error) => {
    if (error) {
      //Vì multer chưa hỗ trợ handle lỗi ra nên phải ghi đè lỗi
      if (error.message) {
        //Dùng status để không reload lại trang
        return res.status(500).send(transErrors.image_message_size);
      }
      return res.status(500).send(error);
    }
    try {
      //Lấy dữ liệu truyền lên từ phía client textAndEmojiChat.js
      let sender = {
        id: req.user._id,
        name: req.user.username,
        avatar: req.user.avatar
      };
  
      let receiverId = req.body.uid;
      let messageValue = req.file; //handle duoc tu multer
      let isChatGroup = req.body.isChatGroup;
      // console.log(receiverId);
      // console.log(messageValue);
      // console.log(isChatGroup);
  
      let newMessage = await message.addNewImage(sender,receiverId,messageValue,isChatGroup);
    
      //Xóa image trong folder để lưu vào trong mongoDB
      await fsExtra.remove(`${app.image_message_directory}/${newMessage.file.fileName}`);
      return res.status(200).send({message: newMessage}); //client
    } catch (error) {
      return res.status(500).send(error);
    }
  });

};


module.exports = {
  addNewTextEmoji: addNewTextEmoji,
  addNewImage: addNewImage
};
