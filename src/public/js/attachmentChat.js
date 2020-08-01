function bufferToBase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ""));
}
function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function () {
    let fileData = $(this).prop("files")[0];
    //gioi han kich thuoc cua file anh
    let limit = 1048576; //byte = 1MB

    if (fileData.size > limit) {
      alertify.notify("Tệp tin upload cho phép tối đa là 1MB!", "error", 7);
      //refresh lai image
      $("#input-change-avatar").val(null);
      return false;
    }

    let targetId = $(this).data("chat");
    let isChatGroup = false;
    //Neu nhu co 1 image hop le, thi get Dataname cua img
    let messageformData = new FormData();
    messageformData.append("my-attachment-chat", fileData);
    messageformData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageformData.append("isChatGroup", true);
      isChatGroup = true;
    }
    $.ajax({
      url: "/message/add-new-attachment",
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
        let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
        let attachmentChat = `<a href="data:${data.message.file.contentType}; base64, ${bufferToBase64(data.message.file.data.data)}"
                              download="${data.message.file.fileName}"> 
                              ${data.message.file.fileName}
                              </a>`;
        if (isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
          //Cập nhật lại số tin nhắn
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId; //Gọi emit vào để xử lí bên socket

        } else {
          messageOfMe.html(attachmentChat);
          dataToEmit.contactId = targetId; //Gọi emit vào để xử lí bên socket
        }

        //Append dữ liệu vào màn hình 
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        //Cập nhật lại scroll để kéo xuống cuối cùng sau khi add tin nhắn vào 
        nineScrollRight(divId);

        //Hiển thị tin nhắn mới và thời gian nhận ở leftSide
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

        //Đẩy user mới nhắn tin lên đầu ở leftSide
        //Tạo 1 sự kiện lắng nghe,moveConversationToTheTop để phân biệt với thẻ khác
        $(`.person[data-chat=${divId}]`).on("clickcustom.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent(); //Dom tới thẻ a
          $(this).closest("ul").prepend(dataToMove); //Tìm thẻ ul gần nhất, đi từ li>a>ul và đẩy dữ liệu lên đầu
          $(this).off("clickcustom.moveConversationToTheTop"); //Đóng sự kiện lại để không bắt trường hợp click
        });
        $(`.person[data-chat=${divId}]`).trigger("clickcustom.moveConversationToTheTop"); //sử dụng trigger để không bị nhảy lên đầu khi đang nhập nội dung chat

        //Emit realtime
        socket.emit("chat-attachment", dataToEmit);

        //Thêm ảnh vào modal xem tất cả tệp
        let attachmentChatToAddModal = `<li>
                                          <a href="data:${data.message.file.contentType}; base64,${bufferToBase64(data.message.file.data.data)}"
                                              download="${bufferToBase64(data.message.file.fileName)}">
                                              ${bufferToBase64(data.message.file.fileName)}
                                          </a>
                                        </li>`;
        $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
      },
      error: function (error) {
        alertify.notify(error.responseText, "error", 7);
      },
    });
  });
}

$(document).ready(function () {
  socket.on("response-chat-attachment", function (response) {
    let divId = "";
    //Xử lý dữ liệu trước khi hiển thị
    let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.message._id}"></div>`);
    let attachmentChat = `<a href="data:${response.message.file.contentType}; base64, ${bufferToBase64(response.message.file.data.data)}"
    download="${response.message.file.fileName}"> 
    ${response.message.file.fileName}
    </a>`;
    if (response.currentGroupId) { //bên socket
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
      divId = response.currentGroupId;
      if (response.CurrentUserId !== $("#dropdown-navbar-user").data("uid")) {
        //Cập nhật lại số tin nhắn
        increaseNumberMessageGroup(divId);
      }
    } else {
      messageOfYou.html(attachmentChat);
      divId = response.CurrentUserId;
    }

    //kiểm tra nếu currentuserid truyền về khác với id đang đăng nhập vào
    if (response.CurrentUserId !== $("#dropdown-navbar-user").data("uid")) {
      //Append dữ liệu vào màn hình 
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      //Cập nhật lại scroll để kéo xuống cuối cùng sau khi add tin nhắn vào 
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime");
    }

    //Hiển thị tin nhắn mới và thời gian nhận ở leftSide
    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm...");

    
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
    if (response.CurrentUserId !== $("#dropdown-navbar-user").data("uid")) {
      let attachmentChatToAddModal = `<li>
      <a href="data:${response.message.file.contentType}; base64,${bufferToBase64(response.message.file.data.data)}"
          download="${bufferToBase64(response.message.file.fileName)}">
          ${bufferToBase64(response.message.file.fileName)}
      </a>
    </li>`;
      $(`#attachmentsModal_${divId}`).find("ul.list-attachments").append(attachmentChatToAddModal);
    }
  });
});
