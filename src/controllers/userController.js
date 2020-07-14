import multer from "multer";
import {app} from "./../config/app";
import {transErrors} from "./../../lang/vi";
import {transSuccess} from "./../../lang/vi";
import uuidv4 from "uuid/v4";
import {user} from "./../services/index";
import fsExtra from "fs-extra";

//Khai bao' noi upload image len server
let storageAvatar = multer.diskStorage({
  destination: (req,file,callback) => {
    callback(null,app.avatar_directory);
  },
  filename: (req,file,callback) => {
    let math = app.avatar_type;
    //Kiem tra dinh dang img upload len bi loi
    if(math.indexOf(file.mimetype) === -1) {
      return callback(transErrors.avatar_type,null);
    }
    //Kiem tra tên của ảnh có thể trùng, nên check thời gian up lên và khởi tạo 1 chuỗi ngẫu nhiên bằng uuidv4
    let avatarName = `${Date.now()}-${uuidv4()}-${file.originalname}`;
    callback(null,avatarName);
  }
});

//Validate error truoc khi upload img
let avatarUploadFile = multer({
  storage: storageAvatar, //nơi lưu trữ
  limits: {fileSize: app.avatar_limit_size} //validation giới hạn 1MB cho img
}).single("avatar"); //cho phép upload 1 img và truyền 'avatar' vào formData

let updateAvatar = (req,res) => {
  avatarUploadFile(req,res,async (error) => {
    if(error) {
      //Vì multer chưa hỗ trợ handle lỗi ra nên phải ghi đè lỗi
      if(error.message) {
        //Dùng status để không reload lại trang
        return res.status(500).send(transErrors.avatar_size);
      } 
      return res.status(500).send(error);
    }
    console.log(req.file);
    //Trường hợp upload thành công
    try {
      let updateUserItem = {
        avatar: req.file.filename, //update avatar trong userModel
        updateAt: Date.now()
      };
      let userUpdate = await user.updateUser(req.user._id,updateUserItem);
      //Sau khi update thành công thì xóa img avatar cũ đi
      //Sử dụng fs-extra thay vì fs.unlink vì fs chỉ hỗ trợ callback và promise
      await fsExtra.remove(`${app.avatar_directory}/${userUpdate.avatar}`);

      let result = {
        message: transSuccess.avatar_updated,
        imageSrc: `/images/users/${req.file.filename}`
      };
      return res.status(200).send(result);
    } catch (error) {
      return res.status(500).send(error);
    }
  });
}

module.exports = {
  updateAvatar: updateAvatar
};