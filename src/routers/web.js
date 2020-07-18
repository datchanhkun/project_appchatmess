import express from "express";
import { home, auth ,user,contact} from "./../controllers/index";
import { authValid , userValid, contactValid} from "./../validation/index";
import passport from "passport";
import initPassportLocal from "./../controllers/passportController/local";
import initPassportFacebook from "./../controllers/passportController/facebook";
import initPassportGoogle from "./../controllers/passportController/google";


//Init all passport
initPassportLocal();
initPassportFacebook();
initPassportGoogle();

let router = express.Router();

//Init tat ca router, app lay tu express 
let initRouters = (app) => {
  //Page index
  router.get("/", auth.checkLoggedIn, home.getHome);

  //Page Login and register
  router.get("/login-register", auth.checkLoggedOut, auth.getLoginRegister);

  //Tao moi 1 user
  router.post("/register", auth.checkLoggedOut, authValid.register, auth.postRegister);


  //ket noi router sau khi dang nhap 
  router.post("/login", auth.checkLoggedOut, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-register",
    successFlash: true,
    failureFlash: true
  }));

  //Login Facebook
  router.get("/auth/facebook", auth.checkLoggedOut,passport.authenticate("facebook", { scope: ["email"] }));
  router.get("/auth/facebook/callback", auth.checkLoggedOut,passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login-register",
  }));

  //Login Google
  router.get("/auth/google", auth.checkLoggedOut,passport.authenticate("google", { scope: ["email"] }));
  router.get("/auth/google/callback", auth.checkLoggedOut,passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/login-register",
  }));

  //Page logout
  router.get("/logout", auth.checkLoggedIn, auth.getLogout);

  //Update user
  router.put("/user/update-avatar",auth.checkLoggedIn,user.updateAvatar);
  router.put("/user/update-info",auth.checkLoggedIn,userValid.updateInfo,user.updateInfo);
  router.put("/user/update-password",auth.checkLoggedIn,userValid.updatePassword,user.updatePassword);
  
  //Find user
  router.get("/contact/find-users/:keyword",auth.checkLoggedIn,contactValid.findUsersContact,contact.findUsersContact);
  return app.use("/", router);
};

module.exports = initRouters;
