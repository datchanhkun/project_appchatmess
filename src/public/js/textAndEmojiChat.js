

function textAndEmojiChat(divId) {
  //Bắt sự kiện gõ phím của emoji
  $(".emojionearea").unbind("keyup").on("keyup", function (element) {
    let currentEmojoneArea = $(this);
    if (element.which === 13) { // kiểm tra nếu gõ phím Enter
      //DOM tới thẻ input 
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageValue = $(`#write-chat-${divId}`).val(); // Lấy value trong thẻ input
      //Khi người dùng chưa gõ gì mà enter thì return về false
      if (!targetId.length || !messageValue.length) {
        return false;
      }
      //Khởi tạo dữ liệu để gửi lên server
      let dataTextEmojiForSend = {
        uid: targetId, //id của nhóm trò chuyện hoặc của cá nhân
        messageValue: messageValue,
      };
      //Kiểm tra nếu đang chat emoji bên group thì gửi dữ liệu nhóm về server
      if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true;
      }

      // Gửi tin nhắn lên server
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function (data) {
        let dataToEmit = {
          message: data.message
        };
        //Success
        // console.log(data.message);
        //Xử lý dữ liệu trước khi hiển thị
        let messageOfMe = $(`<div class="bubble me data-mess-id="${data.message._id}"></div>`);
        messageOfMe.text(data.message.text);
        if (dataTextEmojiForSend.isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}" />`;
          messageOfMe.html(`${senderAvatar}`);
          //Cập nhật lại số tin nhắn
          increaseNumberMessageGroup(divId);
          dataToEmit.groupId = targetId; //Gọi emit vào để xử lí bên socket
        } else {
          dataToEmit.contactId = targetId; //Gọi emit vào để xử lí bên socket
        }
        //Append dữ liệu vào màn hình 
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        //Cập nhật lại scroll để kéo xuống cuối cùng sau khi add tin nhắn vào 
        nineScrollRight(divId);
        //Xóa đi dữ liệu đã nhập vào trong thẻ input
        $(`#write-chat-${divId}`).val("");
        currentEmojoneArea.find(".emojionearea-editor").text("");
        //Hiển thị tin nhắn mới và thời gian nhận ở leftSide
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);
        //Đẩy user mới nhắn tin lên đầu ở leftSide
        //Tạo 1 sự kiện lắng nghe,moveConversationToTheTop để phân biệt với thẻ khác
        $(`.person[data-chat=${divId}]`).on("clickcustom.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent(); //Dom tới thẻ a
          $(this).closest("ul").prepend(dataToMove); //Tìm thẻ ul gần nhất, đi từ li>a>ul và đẩy dữ liệu lên đầu
          $(this).off("clickcustom.moveConversationToTheTop"); //Đóng sự kiện lại để không bắt trường hợp click
        });
        $(`.person[data-chat=${divId}]`).trigger("clickcustom.moveConversationToTheTop"); //sử dụng trigger để không bị nhảy lên đầu khi đang nhập nội dung chat


        //Emit realtime
        socket.emit("chat-text-emoji", dataToEmit);
      }).fail(function (response) {
        //errors
        // console.log(response);
        alertify.notify(response.responseText, "error", 7);
      });
      console.log(targetId);
      console.log(messageValue);
    }
  });
}

//Viết sự kiện lắng nghe ở người nhận
$(document).ready(function () {
  socket.on("response-chat-text-emoji", function (response) {
    let divId = "";
    //Xử lý dữ liệu trước khi hiển thị
    let messageOfYou = $(`<div class="bubble you data-mess-id="${response.message._id}"></div>`);
    messageOfYou.text(response.message.text);
    if (response.currentGroupId) { //bên socket
      let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}" />`;
      messageOfYou.html(`${senderAvatar}`);
      divId = response.currentGroupId;
      if (response.CurrentUserId !== $("#dropdown-navbar-user").data("uid")) {
        //Cập nhật lại số tin nhắn
        increaseNumberMessageGroup(divId);
      }
    } else {
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
    $(`.person[data-chat=${divId}]`).find("span.preview").html(response.message.text);

    //Đẩy user mới nhắn tin lên đầu ở leftSide
    //Tạo 1 sự kiện lắng nghe,moveConversationToTheTop để phân biệt với thẻ khác
    $(`.person[data-chat=${divId}]`).on("clickcustom.moveConversationToTheTop", function () {
      let dataToMove = $(this).parent(); //Dom tới thẻ a
      $(this).closest("ul").prepend(dataToMove); //Tìm thẻ ul gần nhất, đi từ li>a>ul và đẩy dữ liệu lên đầu
      $(this).off("clickcustom.moveConversationToTheTop"); //Đóng sự kiện lại để không bắt trường hợp click
    });
    $(`.person[data-chat=${divId}]`).trigger("clickcustom.moveConversationToTheTop"); //sử dụng trigger để không bị nhảy lên đầu khi đang nhập nội dung chat
  });
});