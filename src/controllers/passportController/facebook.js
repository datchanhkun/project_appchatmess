import passport from "passport";
import passportFacebook from "passport-facebook";
import UserModel from "./../../models/userModel";
import {transErrors} from "./../../../lang/vi";
import {transSuccess} from "./../../../lang/vi";

let FacebookStrategy = passportFacebook.Strategy;

let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbCallbackUrl = process.env.FB_CALLBACK_URL;

//kiem tra tai khoan facebook
let initPassportFacebook = () => {
  passport.use(new FacebookStrategy({
    clientID: fbAppId,
    clientSecret: fbAppSecret,
    callbackURL: fbCallbackUrl,
    passReqToCallback: true,
    profileFields:["email","gender","displayName"] // nhung truong` can lay ra tu fb
  }, async (req,accessToken,refreshToken,profile,done) => {
    try {
      let user = await UserModel.findByFacebookUid(profile.id);
      //Kiem tra neu ton tai user
      if(user) {
        return done(null,user,req.flash("success",transSuccess.loginSuccess(user.username)));
      }

      //console.log(profile);
      //Neu chua ton tai thi tien hanh tao moi user
      let newUserItem = {
        username: profile.displayName,
        gender: profile.gender,
        local: {isActive: true},
        facebook: {
          uid: profile.id,
          token: accessToken,
          email: profile.emails[0].value
        }
      };
      let newUser = UserModel.createNew(newUserItem);
      return done(null,newUser,req.flash("success",transSuccess.loginSuccess(newUser.username)));
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
    .then((user) => {
      return done(null,user);
    })
    .catch(error => {
      return done(error,null);
    })
  });
};

module.exports = initPassportFacebook;