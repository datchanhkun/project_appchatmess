import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import UserModel from "./../../models/userModel";
import {transErrors} from "./../../../lang/vi";
import {transSuccess} from "./../../../lang/vi";

let GoogleStrategy = passportGoogle.Strategy;

let ggAppId = process.env.GG_APP_ID;
let ggAppSecret = process.env.GG_APP_SECRET;
let ggCallbackUrl = process.env.GG_CALLBACK_URL;

//kiem tra tai khoan google
let initPassportGoogle = () => {
  passport.use(new GoogleStrategy({
    clientID: ggAppId,
    clientSecret: ggAppSecret,
    callbackURL: ggCallbackUrl,
    passReqToCallback: true,
  }, async (req,accessToken,refreshToken,profile,done) => {
    try {
      let user = await UserModel.findByGoogleUid(profile.id);
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
        google: {
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

  //Lay user tu session ra ngoai
  passport.deserializeUser((id,done) => {
    UserModel.findUserByIdForSessionToUse(id)
    .then(user => {
      return done(null,user);
    })
    .catch(error => {
      return done(error,null);
    })
  });
};

module.exports = initPassportGoogle;