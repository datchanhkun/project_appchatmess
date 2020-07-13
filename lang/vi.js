// File chứa String thông báo khi gặp lỗi validation
export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Không xác định được giới tính",
  password_incorrect: "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ hoa, chữ thường, chữ số và ký tự đặc biệt",
  re_password_incorrect: "Mật khẩu nhập lại không chính xác",
};

export const transErrors = {
  account_in_use: "Email đã được sử dụng. Vui lòng nhập email khác",
  account_removed: "Tài khoản này đã bị gỡ bỏ khỏi hệ thống",
  account_not_active: "Email đã đăng ký nhưng chưa xác thực.Vui lòng kiểm tra email để xác thực tài khoản",
  login_failed: "Sài tài khoản hoặc mật khẩu!",
  server_error: "Server đang gặp lỗi, vui lòng đăng nhập lại sau"
};

export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong> ${userEmail}</strong> đã được tạo thành công. Vui lòng đăng nhập vào để sử dụng ứng dụng!`;
  },
  loginSuccess: (username) => {
    return `Xin chào ${username}, chúc bạn có một trải nghiệm tuyệt vời với ứng dụng của chúng tôi`
  },
  logoutSuccess: "Đăng xuất tài khoản thành công!"
};

