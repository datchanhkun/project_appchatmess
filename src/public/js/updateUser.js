//Tao cac bien Global
let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
let userUpdatePassword = {};
//Ham sua thong tin user
function updateUserInfo() {
  //Bat su kien chon file anh va preview avt truoc khi save upload image
  $("#input-change-avatar").bind("change", function () {
    let fileData = $("#input-change-avatar").prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    //gioi han kich thuoc cua file anh
    let limit = 1048576; //byte = 1MB

    //Neu ket qua = -1 thi file data khong khop voi 1 phan tu nao trong mang(jpg, png,jpeg)
    if ($.inArray(fileData.type, math) === -1) {
      alertify.notify("Định dạng file không hợp lệ!", "error", 7);
      //refresh lai image
      $("#input-change-avatar").val(null);
      return false;
    }

    if (fileData.size > limit) {
      alertify.notify("Ảnh upload cho phép tối đa là 1MB!", "error", 7);
      //refresh lai image
      $("#input-change-avatar").val(null);
      return false;
    }

    if (typeof (FileReader) != "undefined") {
      let imagePreview = $("#image-edit-profile");
      imagePreview.empty(); // lam rong the div chua img
      let fileReader = new FileReader();
      fileReader.onload = function (element) {
        $("<img>", {
          "src": element.target.result, //lay thuoc tinh cua anh
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePreview);
      };
      imagePreview.show();
      fileReader.readAsDataURL(fileData);

      //Neu nhu co 1 image hop le, thi get Dataname cua img
      let formData = new FormData();
      formData.append("avatar", fileData); //avatar la name cua img
      userAvatar = formData;
    } else {
      alertify.notify("Trình duyệt của bạn không hỗ trợ FileReader!", "error", 7);
    }
  });

  //Bat su kien change username
  $("#input-change-username").bind("change", function () {
    //Hiển thị thông báo ở phía front end
    let username = $("#input-change-username").val();
    let regexUsername = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if(!regexUsername.test(username) || username.length < 3 || username.length > 17) {
      alertify.notify("Username chỉ được chứa 3-17 kí tự và không được phép chứa kí tự đặc biệt!", "error", 7);
      $("#input-change-username").val(originUserInfo.username); //Gán lại giá trị gốc ban đầu
      delete userInfo.username; //Xóa dữ liệu update khi đúng lần 1
      return false;
    }
    userInfo.username = $("#input-change-username").val();
  });

  //Bat su kien click gender male
  $("#input-change-gender-male").bind("click", function () {
    let gender = $("#input-change-gender-male").val();
    if(gender !== "male") {
      alertify.notify("Lỗi hệ thống!", "error", 7);
      $("#input-change-gender-male").val(originUserInfo.gender); //Gán lại giá trị gốc ban đầu
      delete userInfo.gender; //Xóa dữ liệu update khi đúng lần 1
      return false;
    }
    userInfo.gender = $("#input-change-gender-male").val();
  });

  //Bat su kien click gender female
  $("#input-change-gender-female").bind("click", function () {
    let gender = $("#input-change-gender-female").val();
    if(gender !== "female") {
      alertify.notify("Lỗi hệ thống!", "error", 7);
      $("#input-change-gender-female").val(originUserInfo.gender); //Gán lại giá trị gốc ban đầu
      delete userInfo.gender; //Xóa dữ liệu update khi đúng lần 1
      return false;
    }
    userInfo.gender = $("#input-change-gender-female").val();
  });

  //Bat su kien change address
  $("#input-change-address").bind("change", function () {
    let address = $("#input-change-address").val();
    if(address.length < 3 || address.length > 30) {
      alertify.notify("Địa chỉ chỉ được chứa 3-30 kí tự!", "error", 7);
      $("#input-change-address").val(originUserInfo.address); //Gán lại giá trị gốc ban đầu
      delete userInfo.address; //Xóa dữ liệu update khi đúng lần 1
      return false;
    }
    userInfo.address = $("#input-change-address").val();
  });

  //Bat su kien change phone
  $("#input-change-phone").bind("change", function () {
    let phone = $("#input-change-phone").val();
    let regexPhone = new RegExp(/^(0)[0-9]{9}$/);
    if(!regexPhone.test(phone)) {
      alertify.notify("Số điện thoại bắt đầu và số 0 và chỉ bao gồm 10 kí tự!", "error", 7);
      $("#input-change-phone").val(originUserInfo.phone); //Gán lại giá trị gốc ban đầu
      delete userInfo.phone; //Xóa dữ liệu update khi đúng lần 1, lần 2 sai
      return false;
    }
    userInfo.phone = $("#input-change-phone").val();
  });

  //Bắt sự kiện change mật khẩu hiện tại
  $("#input-change-current-password").bind("change", function () {
    let currentPassword = $("#input-change-current-password").val();
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
    if(!regexPassword.test(currentPassword)) {
      alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ hoa, chữ thường, chữ số và ký tự đặc biệt", "error", 7);
      $("#input-change-current-password").val(null); //Gán lại giá trị gốc ban đầu
      delete userUpdatePassword.currentPassword; //Xóa dữ liệu update khi đúng lần 1, lần 2 sai
      return false;
    }
    userUpdatePassword.currentPassword = currentPassword;
  });

  //Bắt sự kiện change mật khẩu mới
  $("#input-change-new-password").bind("change", function () {
    let newPassword = $("#input-change-new-password").val();
    let regexPassword = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}$/);
    if(!regexPassword.test(newPassword)) {
      alertify.notify("Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm cả chữ hoa, chữ thường, chữ số và ký tự đặc biệt", "error", 7);
      $("#input-change-new-password").val(null); //Gán lại giá trị gốc ban đầu
      delete userUpdatePassword.newPassword; //Xóa dữ liệu update khi đúng lần 1, lần 2 sai
      return false;
    }
    userUpdatePassword.newPassword = newPassword;
  });

  //Bắt sự kiện change nhập lại mật khẩu
  $("#input-change-confirm-new-password").bind("change", function () {
    let confirmNewPassword = $("#input-change-confirm-new-password").val();
    //Kiểm tra nếu chưa nhập MK mới
    if(!userUpdatePassword.newPassword) { 
      alertify.notify("Bạn chưa nhập mật khẩu mới!", "error", 7);
      $("#input-change-confirm-new-password").val(null); //Gán lại giá trị gốc ban đầu
      delete userUpdatePassword.confirmNewPassword; //Xóa dữ liệu update khi đúng lần 1, lần 2 sai
      return false;
    }
    //Kiểm tra nếu nhập lại mật khẩu không trùng khớp
    if(confirmNewPassword !== userUpdatePassword.newPassword) { 
      alertify.notify("Nhập lại mật khẩu chưa chính xác!", "error", 7);
      $("#input-change-confirm-new-password").val(null); //Gán lại giá trị gốc ban đầu
      delete userUpdatePassword.confirmNewPassword; //Xóa dữ liệu update khi đúng lần 1, lần 2 sai
      return false;
    }
    userUpdatePassword.confirmNewPassword = confirmNewPassword;
  });

}
//request ajax de gui userAvatar len sever khi upload anh
function callUpdateUserAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put", //'put' la method khi update 1 field dung' voi quy tac chuan cua API
    //Khi gui 1 request co' du lieu la formData thi can phai khi bao 3 method
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function (result) {
      //Hiển thị thông báo update thành công
      $(".user-modal-alert-success").find("span").text(result.message);
      //Hien thi voi css
      $(".user-modal-alert-success").css("display", "block");
      //Update avatar small on navbar
      $("#navbar-avatar").attr("src", result.imageSrc);
      //Update lại đường dẫn mặc định 
      originAvatarSrc = result.imageSrc;
      //Reset all khi upload img thanh cong
      $("#input-btn-cancel-update-user").click(); // jquery sẽ tự động click button cancel
    },
    error: function (error) {
      //Xuat loi ra man hinh, 'error.responseText' ghi đè lỗi 
      // console.log(error);
      $(".user-modal-alert-error").find("span").text(error.responseText);
      //Xuat ra loi voi css
      $(".user-modal-alert-error").css("display", "block");
      //Reset all khi upload img loi
      $("#input-btn-cancel-update-user").click(); // jquery sẽ tự động click button cancel
    },
  });
}
//request ajax de gui userAvatar len sever khi upload info
function callUpdateUserInfor() {
  $.ajax({
    url: "/user/update-info",
    type: "put", //'put' la method khi update 1 field dung' voi quy tac chuan cua API
    data: userInfo,
    success: function (result) {
      //Hiển thị thông báo update thành công
      $(".user-modal-alert-success").find("span").text(result.message);
      //Hien thi voi css
      $(".user-modal-alert-success").css("display", "block");

      //Kiểm tra trường hợp client chỉ thay đổi 1 field
      if(userInfo.username) {
        originUserInfo.username = userInfo.username;
      }
      if(userInfo.gender) {
        originUserInfo.gender = userInfo.gender;
      }
      if(userInfo.address) {
        originUserInfo.address = userInfo.address;
      }
      if(userInfo.phone) {
        originUserInfo.phone = userInfo.phone;
      }
      //Update username trên thanh navbar
      $("#navbar-username").text(originUserInfo.username);
      //Reset all khi upload img thanh cong
      $("#input-btn-cancel-update-user").click(); // jquery sẽ tự động click button cancel
    },
    error: function (error) {
      //Xuat loi ra man hinh, 'error.responseText' ghi đè lỗi 
      // console.log(error);
      $(".user-modal-alert-error").find("span").text(error.responseText);
      //Xuat ra loi voi css
      $(".user-modal-alert-error").css("display", "block");
      //Reset all khi upload img loi
      $("#input-btn-cancel-update-user").click(); // jquery sẽ tự động click button cancel
    },
  });
}

function callUpdateUserPassword() {
  $.ajax({
    url: "/user/update-password",
    type: "put", //'put' la method khi update 1 field dung' voi quy tac chuan cua API
    data: userUpdatePassword,
    success: function (result) {
      //Hiển thị thông báo update thành công
      $(".user-modal-password-alert-success").find("span").text(result.message);
      //Hien thi voi css
      $(".user-modal-password-alert-success").css("display", "block");

      //Reset all
      $("#input-btn-cancel-user-password").click();
    },
    error: function (error) {
      //Xuat loi ra man hinh, 'error.responseText' ghi đè lỗi 
      // console.log(error);
      $(".user-modal-password-alert-error").find("span").text(error.responseText);
      //Xuat ra loi voi css
      $(".user-modal-password-alert-error").css("display", "block");
      //Reset all khi upload img loi
      $("#input-btn-cancel-update-user").click(); // jquery sẽ tự động click button cancel
    },
  });
}
$(document).ready(function () {
  //Lay lai duong dan goc' ban dau cua image
  originAvatarSrc = $("#user-modal-avatar").attr("src");
  originUserInfo = {
    username: $("#input-change-username").val(),
    gender: ($("#input-change-gender-male").is(":checked")) ? $("#input-change-gender-male").val() : $("#input-change-gender-female").val(),
    address: $("#input-change-address").val(),
    phone: $("#input-change-phone").val(),
  };

  //Cap nhat thong tin user sau khi thay doi gia tri trong field
  updateUserInfo();
  //Bat su kien click button save
  $("#input-btn-update-user").bind("click", function () {
    //Kiem tra object rong va avatar = null
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu mới!", "error", 7);
      return false;
    }
    if(userAvatar) {
      callUpdateUserAvatar();
    }
    if(!$.isEmptyObject(userInfo)) {
      callUpdateUserInfor();
    }


  });

  //Bat su kien click button cancel
  $("#input-btn-cancel-update-user").bind("click", function () {
    userAvatar = null;
    userInfo = {};
    $("#input-change-avatar").val(null);
    $("#user-modal-avatar").attr("src", originAvatarSrc);

    //Lấy giá trị gốc trả về thẻ input(update info)
    $("#input-change-username").val(originUserInfo.username);
    (originUserInfo.gender === "male") ? $("#input-change-gender-male").click() : $("#input-change-gender-female").click();
    $("#input-change-address").val(originUserInfo.address);
    $("#input-change-phone").val(originUserInfo.phone);

  });

  //Bắt sự kiện click button save password
  $("#input-btn-update-user-password").bind("click", function () {
    //Nếu không tồn tại 1 trong 3 field thì trả về lỗi
    if(!userUpdatePassword.currentPassword || !userUpdatePassword.newPassword || !userUpdatePassword.confirmNewPassword) {
      alertify.notify("Bạn phải nhập đầy đủ thông tin!", "error", 7);
      return false;
    }
    //Hiển thị modal xác nhận có thay đổi mật khẩu hay không (sweetalert2)
    Swal.fire({
      title: "Bạn có chắc chắn muốn thay đỏi mật khẩu?",
      text: "Bạn không thể hoàn tác lại thao tác này!",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if(!result.value) {
        $("#input-btn-cancel-user-password").click();
        return false;
      }
    callUpdateUserPassword();
    });

  });

  //Bắt sự kiện click button cancel password
  $("#input-btn-cancel-user-password").bind("click", function () {
    //Reset ALL
    userUpdatePassword = {};
    $("#input-change-current-password").val(null);
    $("#input-change-new-password").val(null);
    $("#input-change-confirm-new-password").val(null);
  });
});
