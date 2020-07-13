import {validationResult} from "express-validator/check";
import {auth} from "./../services/index";
import {transSuccess} from "./../../lang/vi";
let getLoginRegister = (req, res) => {
  return res.render("auth/master", {
    errors: req.flash("errors"),
    success: req.flash("success")
  });
};

let postRegister = async (req,res) => {
  //Khai bao mot mang chua msg loi:
  let errorArr = [];
  let successArr = [];
  //khai bao 1 validationErrors de lay req.isEmpty va mapped ra
  let validationErrors = validationResult(req);
  //Kiem tra neu co loi thi push msg ra man hinh va redirect lai register
  if(!validationErrors.isEmpty()) {
    let errors = Object.values(validationErrors.mapped());
    errors.forEach(item => {
      errorArr.push(item.msg);
    });
    req.flash("errors",errorArr);
    return res.redirect("/login-register");
  }
  try {
     //Nguoc lai neu khong co loi thi xuat thong tin user ra man hinh
  // *await* vi authService chay await 2 lan nen dung await de doi validation roi moi xuat loi ra
  let createUserSuccess = await auth.register(req.body.email, req.body.gender, req.body.password);
  successArr.push(createUserSuccess);

  req.flash("success",successArr);
  return res.redirect("/login-register");
  } catch (error) {
    errorArr.push(error);
    req.flash("errors",errorArr);
    return res.redirect("/login-register");
  }
 
};

let getLogout = (req,res) => {
  req.logout(); // xoa passport user da luu session khi dang nhap
  req.flash("success",transSuccess.logoutSuccess);
  return res.redirect("/login-register");
};

//Function kiem tra user da dang nhap hay chua
let checkLoggedIn = (req,res,next) => {
  //Neu chua dang nhap
  if(!req.isAuthenticated()) {
    return res.redirect("/login-register");
  }
  next();
}

//Function kiem tra user da dang xuat hay chua
let checkLoggedOut = (req,res,next) => {
  //Neu da dang nhap
  if(req.isAuthenticated()) { // la phuong thuc cua passport
    return res.redirect("/");
  }
  next();
}

module.exports = {
  getLoginRegister: getLoginRegister,
  postRegister: postRegister,
  getLogout: getLogout,
  checkLoggedIn: checkLoggedIn,
  checkLoggedOut: checkLoggedOut
};
