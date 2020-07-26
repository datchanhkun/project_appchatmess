import UserModel from "./../models/userModel";
import { resolve, reject } from "bluebird";
import {transErrors} from "./../../lang/vi";
import bcrypt from "bcrypt";

const saltRound = 7;

//Ham update userInfo id: user.id item: data
//Hàm update đã return usermodel và thực hiện lệnh findByIdAndUpdate rồi nên không cần tạo promise bên controller nữa
let updateUser = (id, item) => {
  return UserModel.updateUser(id,item);
}

let updatePassword = (id, dataUpdate) => {
  return new Promise(async (resolve,reject) => {
    let currentUser = await UserModel.findUserByIdToUpdatePassword(id);
    //Kiểm tra nếu không tồn tại user
    if(!currentUser) {
      return reject(transErrors.account_undefined);
    }
    //Kiểm tra current password nhập vào có trùng với pass trong DB không
    let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
    if(!checkCurrentPassword) {
      return reject(transErrors.user_current_password_failed);
    }
    //mã hóa mật khẩu
    let salt = bcrypt.genSaltSync(saltRound);
    await UserModel.updatePassword(id,bcrypt.hashSync(dataUpdate.newPassword,salt));
    resolve(true);
  }); 
}

module.exports = {
  updateUser: updateUser,
  updatePassword: updatePassword
};
