//Tao cac bien Global
let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
let originUserInfo = {};
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
});
