import {check} from "express-validator/check";
import {transValidation} from "./../../lang/vi";
//validation độ dài tin nhắn gửi lên để lưu vào database
let checkMessageLength = [
  check("messageValue", transValidation.message_text_emoji_incorrect)
    .isLength({min: 1, max: 400})
];

module.exports = {
  checkMessageLength : checkMessageLength
}
