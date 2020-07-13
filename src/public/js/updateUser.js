//Tao cac bien Global
let userAvatar = null;
let userInfo = {};
let originAvatarSrc = null;
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
    userInfo.username = $("#input-change-username").val();
  });

  //Bat su kien click gender male
  $("#input-change-gender-male").bind("click", function () {
    userInfo.gender = $("#input-change-gender-male").val();
  });

  //Bat su kien click gender female
  $("#input-change-gender-female").bind("click", function () {
    userInfo.gender = $("#input-change-gender-female").val();
  });

  //Bat su kien change address
  $("#input-change-address").bind("change", function () {
    userInfo.address = $("#input-change-address").val();
  });

  //Bat su kien change phone
  $("#input-change-phone").bind("change", function () {
    userInfo.phone = $("#input-change-phone").val();
  });
}

$(document).ready(function () {
  updateUserInfo();
  //Lay lai duong dan goc' ban dau cua image
  originAvatarSrc = $("#user-modal-avatar").attr("src");

  //Bat su kien click button save
  $("#input-btn-update-user").bind("click", function () {
    //Kiem tra object rong va avatar = null
    if($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Bạn phải thay đổi thông tin trước khi cập nhật dữ liệu mới!","error",7);
    }

    //request ajax de gui userAvatar len sever khi upload anh
    $.ajax({
      url: "/user/update-avatar",
      type: "put", //'put' la method khi update 1 field dung' voi quy tac chuan cua API
      //Khi gui 1 request co' du lieu la formData thi can phai khi bao 3 method
      cache: false,
      contentType: false,
      processData: false,
      data: userAvatar,
      success: function(result){

      },
      error: function(result){

      },
    });
    // console.log(userAvatar);
    // console.log(userInfo);
  });

  //Bat su kien click button cancel
  $("#input-btn-cancel-update-user").bind("click", function () {
    userAvatar = null;
    userInfo = {};
    $("#user-modal-avatar").attr("src",originAvatarSrc);
  });
});
