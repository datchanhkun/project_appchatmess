import UserModel from "./../models/userModel";
import bcrypt from "bcrypt";
import uuidv4 from "uuid/v4";
import { reject, resolve } from "bluebird";
import {transErrors, transSuccess} from "./../../lang/vi";
let saltRounds = 7;
//Khai bao promise de su dung async-await ben authcontroller
let register =  (email,gender,password) => {
  return new Promise(async (resolve,reject) => {
    let userByEmail = await UserModel.findByEmail(email);
    //Kiem tra neu ton tai user roi
    if(userByEmail) {
      //Neu tai khoan da bi xoa thi reject la loi
      if(userByEmail.deleteAt != null) {
        return reject(transErrors.account_removed);
      }
      //Neu tai khoan chua xac thuc email
      // if(!userByEmail.local.isActive) {
      //   return reject(transErrors.account_not_active);
      // }
      return reject(transErrors.account_in_use);
    }
  
    let salt = bcrypt.genSaltSync(saltRounds);
  
    let userItem = {
      username: email.split("@")[0],
      gender: gender,
      local: {
        email: email,
        password: bcrypt.hashSync(password,salt),
        verifyToken: uuidv4()
      }
    };
    let user = await UserModel.createNew(userItem);
    resolve(transSuccess.userCreated(user.local.email));
  });
};

module.exports = {
  register : register
}