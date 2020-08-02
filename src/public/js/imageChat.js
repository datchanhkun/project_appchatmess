function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
}
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
      return false;
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;
    //Neu nhu co 1 image hop le, thi get Dataname cua img
    let messageformData = new FormData();
    messageformData.append("my-image-chat", fileData); //my-image-chat la name cua img
    messageformData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageformData.append("isChatGroup", true);
      isChatGroup = true;
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
        let dataToEmit = {
          message: data.message
        };

        //Xử lý dữ liệu trước khi hiển thị
        let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
        let imageChat = `<img src="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}"
        class="show-image-chat">`;
        if (isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar} ${imageChat}`);
          //Cập nhật lại số tin nhắn
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId; //Gọi emit vào để xử lí bên socket

        } else {
          messageOfMe.html(imageChat);
          dataToEmit.contactId = targetId; //Gọi emit vào để xử lí bên socket
        }


        //Append dữ liệu vào màn hình 
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        //Cập nhật lại scroll để kéo xuống cuối cùng sau khi add tin nhắn vào 
        nineScrollRight(divId);

        //Hiển thị tin nhắn mới và thời gian nhận ở leftSide
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh....");

        //Đẩy user mới nhắn tin lên đầu ở leftSide
        //Tạo 1 sự kiện lắng nghe,moveConversationToTheTop để phân biệt với thẻ khác
        $(`.person[data-chat=${divId}]`).on("clickcustom.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent(); //Dom tới thẻ a
          $(this).closest("ul").prepend(dataToMove); //Tìm thẻ ul gần nhất, đi từ li>a>ul và đẩy dữ liệu lên đầu
          $(this).off("clickcustom.moveConversationToTheTop"); //Đóng sự kiện lại để không bắt trường hợp click
        });
        $(`.person[data-chat=${divId}]`).trigger("clickcustom.moveConversationToTheTop"); //sử dụng trigger để không bị nhảy lên đầu khi đang nhập nội dung chat

        //Emit realtime
        socket.emit("chat-image", dataToEmit);

        //Thêm ảnh vào modal xem tất cả ảnh
        let imageChatToAddModal = `<img src="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}">`;
        $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
      },
      error: function (error) {
        alertify.notify(error.responseText, "error", 7);
      },
    });
  });
}

$(document).ready(function () {
  socket.on("response-chat-image", function (response) {
    let divId = "";
    //Xử lý dữ liệu trước khi hiển thị
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.message._id}"></div>`);
    let imageChat = `<img src="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}"
    class="show-image-chat">`;
    if (response.currentGroupId) { //bên socket
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar} ${imageChat}`);
      divId = response.currentGroupId;
      if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        //Cập nhật lại số tin nhắn
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(imageChat);
      divId = response.currentUserId;
    }

    //kiểm tra nếu currentuserid truyền về khác với id đang đăng nhập vào
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      //Append dữ liệu vào màn hình 
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      //Cập nhật lại scroll để kéo xuống cuối cùng sau khi add tin nhắn vào 
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    //Hiển thị tin nhắn mới và thời gian nhận ở leftSide
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh...");

    //Đẩy user mới nhắn tin lên đầu ở leftSide
    //Tạo 1 sự kiện lắng nghe,moveConversationToTheTop để phân biệt với thẻ khác
    $(`.person[data-chat=${divId}]`).on("clickcustom.moveConversationToTheTop", function () {
      let dataToMove = $(this).parent(); //Dom tới thẻ a
      $(this).closest("ul").prepend(dataToMove); //Tìm thẻ ul gần nhất, đi từ li>a>ul và đẩy dữ liệu lên đầu
      $(this).off("clickcustom.moveConversationToTheTop"); //Đóng sự kiện lại để không bắt trường hợp click
    });
    $(`.person[data-chat=${divId}]`).trigger("clickcustom.moveConversationToTheTop"); //sử dụng trigger để không bị nhảy lên đầu khi đang nhập nội dung chat


    //Thêm ảnh vào modal xem tất cả ảnh
    //kiểm tra nếu currentuserid truyền về khác với id đang đăng nhập vào
    if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let imageChatToAddModal = `<img src="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}">`;
      $(`#imagesModal_${divId}`).find("div.all-images").append(imageChatToAddModal);
    }
  });
});
