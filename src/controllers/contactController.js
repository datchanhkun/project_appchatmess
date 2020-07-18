import {contact} from "./../services/index";
import { validationResult } from "express-validator/check";
let findUsersContact = async (req, res) => {
  let errorArr = [];
  let validationErrors = validationResult(req);
  //Khai bao mot mang chua msg loi:
 //Kiem tra neu co loi thi push msg ra man hinh va redirect lai register
  if (!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    //console.log(errorArr);
    return res.status(500).send(errorArr);
  }
 

  try {
    //Lấy ra id của người dùng hiện tại
    let currentUserId = req.user._id;
    let keyword = req.params.keyword; //lấy từ router :keyword

    let users = await contact.findUsersContact(currentUserId,keyword);
    return res.render("main/contact/sections/_FindUsersContact",{users});
    
  } catch (error) {
    return res.status(500).send(error);
  }
}

module.exports = {
  findUsersContact : findUsersContact
};
