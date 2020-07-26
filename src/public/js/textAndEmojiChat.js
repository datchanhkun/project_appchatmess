

function textAndEmojiChat(divId) {
  //Bắt sự kiện gõ phím của emoji
  $(".emojionearea").unbind("keyup").on("keyup", function(element) {
    if(element.which === 13) { // kiểm tra nếu gõ phím Enter
      //DOM tới thẻ input 
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageValue = $(`#write-chat-${divId}`).val(); // Lấy value trong thẻ input
      //Khi người dùng chưa gõ gì mà enter thì return về false
      if(!targetId.length || !messageValue.length) {
        return false;
      }
      //Khởi tạo dữ liệu để gửi lên server
      let dataTextEmojiForSend = {
        uid: targetId, //id của nhóm trò chuyện hoặc của cá nhân
        messageValue: messageValue,
      };
      //Kiểm tra nếu đang chat emoji bên group thì gửi dữ liệu nhóm về server
      if($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataTextEmojiForSend.isChatGroup = true;
      }

      // Gửi tin nhắn lên server
      $.post("/message/add-new-text-emoji", dataTextEmojiForSend, function(data) {
        //Success
        console.log(data.message);

      }).fail(function (response) {
        //errors
        // console.log(response);
        alertify.notify(response.responseText, "error",7);
      });
      console.log(targetId);
      console.log(messageValue);
    }
  });
}