function imageChat(divId) {
  $(`#image-chat-${divId}`).unbind("change").on("change", function () {
    let fileData = $(this).prop("files")[0];
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

    let targetId = $(this).data("chat");
    //Neu nhu co 1 image hop le, thi get Dataname cua img
    let messageformData = new FormData();
    messageformData.append("my-image-chat", fileData); //my-image-chat la name cua img
    messageformData.append("uid", targetId);
    if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
      dataTextEmojiForSend.isChatGroup = true;
    }

    $.ajax({
      url: "/message/add-new-image",
      type: "post", 
      //Khi gui 1 request co' du lieu la formData thi can phai khi bao 3 method
      cache: false,
      contentType: false,
      processData: false,
      data: messageformData,
      success: function (data) {
        console.log(data);
      },
      error: function (error) {
        alertify.notify(error.responseText, "error", 7);
      },
    });
  });
}