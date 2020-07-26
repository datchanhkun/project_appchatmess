// File chứa String thông báo khi gặp lỗi validation
export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Không xác định được giới tính",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ hoa, chữ thường, chữ số và ký tự đặc biệt",
  re_password_incorrect: "Mật khẩu nhập lại không chính xác",
  update_username: "Username chỉ được chứa 3-17 kí tự và không được phép chứa kí tự đặc biệt!",
  update_gender: "Lỗi hệ thống!",
  update_address: "Địa chỉ chỉ được chứa 3-30 kí tự!",
  update_phone: "Số điện thoại bắt đầu và số 0 và chỉ bao gồm 10 kí tự!",
  keyword_find_user: "Chỉ cho phép nhập vào chữ cái , số và khoảng trắng",
  message_text_emoji_incorrect: "Tin nhắn không hợp lệ. Độ dài kí tự giới hạn từ 1-400 kí tự!"
};

export const transErrors = {
  account_in_use: "Email đã được sử dụng. Vui lòng nhập email khác",
  account_removed: "Tài khoản này đã bị gỡ bỏ khỏi hệ thống",
  account_not_active: "Email đã đăng ký nhưng chưa xác thực.Vui lòng kiểm tra email để xác thực tài khoản",
  account_undefined: "Tài khoản không tồn tại!",
  login_failed: "Sài tài khoản hoặc mật khẩu!",
  server_error: "Server đang gặp lỗi, vui lòng đăng nhập lại sau",
  avatar_type: "Định dạng file không hợp lệ!",
  avatar_size: "Ảnh upload cho phép tối đa là 1MB!",
  user_current_password_failed: "Mật khẩu hiện tại không chính xác!",
  conversation_not_found: "Cuộc trò chuyện không tồn tại!"
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong> ${userEmail}</strong> đã được tạo thành công. Vui lòng đăng nhập vào để sử dụng ứng dụng!`;
  },
  loginSuccess: (username) => {
    return `Xin chào ${username}, chúc bạn có một trải nghiệm tuyệt vời với ứng dụng của chúng tôi`
  },
  logoutSuccess: "Đăng xuất tài khoản thành công!",
  user_info_updated: "Cập nhật thông tin người dùng thành công!",
  user_password_updated: "Cập nhật mật khẩu thành công!"
};

