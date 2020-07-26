

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
        //Success
        // console.log(data.message);
        //Xử lý dữ liệu trước khi hiển thị
        let messageOfMe = $(`<div class="bubble me data-mess-id="${data.message._id}"></div>`);
        if (dataTextEmojiForSend.isChatGroup) {
          messageOfMe.html(`<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}">`);

          messageOfMe.text(data.message.text);
          //Cập nhật lại số tin nhắn
          increaseNumberMessageGroup(divId);
          //Append dữ liệu vào màn hình 
          $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
          //Cập nhật lại scroll để kéo xuống cuối cùng sau khi add tin nhắn vào 
          nineScrollRight(divId);
          //Xóa đi dữ liệu đã nhập vào trong thẻ input
          $(`#write-chat-${divId}`).val("");
          currentEmojoneArea.find(".emojionearea-editor").text("");
          //Hiển thị tin nhắn mới và thời gian nhận ở leftSide
          $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
          $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);
          //Đẩy user mới nhắn tin lên đầu ở leftSide
          //Tạo 1 sự kiện lắng nghe,moveConversationToTheTop để phân biệt với thẻ khác
          $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function () {
            let dataToMove = $(this).parent(); //Dom tới thẻ a
            $(this).closest("ul").prepend(dataToMove); //Tìm thẻ ul gần nhất, đi từ li>a>ul và đẩy dữ liệu lên đầu
            $(this).off("click.moveConversationToTheTop"); //Đóng sự kiện lại để không bắt trường hợp click
          });
          $(`.person[data-chat=${divId}]`).click(); //Dom đến .click  và lắng nghe đến sự kiện trên
          //Emit realtime

        } else {
          messageOfMe.text(data.message.text);
          $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
          //Cập nhật lại scroll để kéo xuống cuối cùng sau khi add tin nhắn vào 
          nineScrollRight(divId);
          //Xóa đi dữ liệu đã nhập vào trong thẻ input
          $(`#write-chat-${divId}`).val("");
          currentEmojoneArea.find(".emojionearea-editor").text("");
          //Hiển thị tin nhắn mới và thời gian nhận ở leftSide
          $(`.person[data-chat=${divId}]`).find("span.time").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
          $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);
          //Đẩy user mới nhắn tin lên đầu ở leftSide
          //Tạo 1 sự kiện lắng nghe,moveConversationToTheTop là namespace để phân biệt với thẻ khác
          $(`.person[data-chat=${divId}]`).on("click.moveConversationToTheTop", function () {
            let dataToMove = $(this).parent(); //Dom tới thẻ a
            $(this).closest("ul").prepend(dataToMove); //Tìm thẻ ul gần nhất, đi từ li>a>ul và đẩy dữ liệu lên đầu
            $(this).off("click.moveConversationToTheTop"); //Đóng sự kiện lại để không bắt trường hợp click
          });
          $(`.person[data-chat=${divId}]`).click(); //Dom đến .click  và lắng nghe đến sự kiện trên
          //Emit realtime
        }
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