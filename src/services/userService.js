import UserModel from "./../models/userModel";

//Ham update userInfo id: user.id item: data
//Hàm update đã return usermodel và thực hiện lệnh findByIdAndUpdate rồi nên không cần tạo promise bên controller nữa
let updateUser = (id, item) => {
  return UserModel.updateUser(id,item);
}

module.exports = {
  updateUser: updateUser
};
