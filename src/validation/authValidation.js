import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi";

let register = [
  check("email", transValidation.email_incorrect)
  .isEmail()
  .trim(),

  check("gender",transValidation.gender_incorrect)
  .isIn(["male","female"]),

  check("password",transValidation.password_incorrect)
  .isLength({min: 8})
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/
  ),

  check("password_confirmation",transValidation.re_password_incorrect)
  .custom((value, {req}) => {
    // Kiem tra password nhap lai trung vs password
    return value === req.body.password 
  })
];

module.exports = {
  register : register
}