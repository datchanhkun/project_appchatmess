import passport from "passport";
import passportLocal from "passport-local";
import UserModel from "./../../models/userModel";
import {transErrors} from "./../../../lang/vi";
import {transSuccess} from "./../../../lang/vi";
let LocalStrategy = passportLocal.Strategy;
//kiem tra tai khoan local
let initPassportLocal = () => {
  passport.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  }, async (req,email,password,done) => {
    try {
      let user = await UserModel.findByEmail(email);
      //Neu khong ton tai user trong db
      if(!user) {
        return done(null,false,req.flash("errors",transErrors.login_failed));
      }

      let checkPassword = await user.comparePassword(password);
      if(!checkPassword) {
        return done(null,false,req.flash("errors",transErrors.login_failed));
      }

      //Truong hop dang nhap thanh cong
      return done(null,user,req.flash("success",transSuccess.loginSuccess(user.username)));
    } catch (error) {
      // console.log(error);
      return done(null,false,req.flash("errors",transErrors.server_error));
    }
  }));

  //Ghi thong tin cua user(id) vao session
  passport.serializeUser((user,done) => {
    done(null,user._id);
  });

  passport.deserializeUser((id,done) => {
    UserModel.findUserByIdForSessionToUse(id)
    .then(user => {
      return done(null,user);
    })
    .catch(error => {
      return done(error,null);
    });
  });
};

module.exports = initPassportLocal;