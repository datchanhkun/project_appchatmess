function typingOn (divId) {
  let targetId = $(`#write-chat-${divId}`).data("chat");
  //Kiểm tra trò chuyện nhóm hay là cá nhân
  if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
    socket.emit("user-is-typing",{groupId: targetId}); 
  } else {
    socket.emit("user-is-typing",{contactId: targetId});
  }
}

function typingOff (divId) {
  let targetId = $(`#write-chat-${divId}`).data("chat");
  //Kiểm tra trò chuyện nhóm hay là cá nhân
  if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
    socket.emit("user-is-not-typing",{groupId: targetId}); 
  } else {
    socket.emit("user-is-not-typing",{contactId: targetId});
  }
}

$(document).ready(function() {
  //Lắng nghe typing on
  socket.on("response-user-is-typing", function(response) {
    let messageTyping = `<div class="bubble you bubble-typing-gif">
    <img  src="/images/chat/typing.gif" />
    </div>`;
    //Nếu là nhóm
    if(response.currentGroupId) {
      //kiểm tra nếu currentuserid truyền về khác với id đang đăng nhập vào
      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        //kiểm tra nếu tồn tại click rồi thì không xuất ra gif lần 2
        let checkTyping = $(`.chat[data-chat =${response.currentGroupId}]`).find("div.bubble-typing-gif");
        if(checkTyping.length) {
          return false;
        }
        $(`.chat[data-chat =${response.currentGroupId}]`).append(messageTyping);
        nineScrollRight(response.currentGroupId);
      }
    } else {
      let checkTyping = $(`.chat[data-chat =${response.currentUserId}]`).find("div.bubble-typing-gif");
      if(checkTyping.length) {
        return false;
      }
      $(`.chat[data-chat =${response.currentUserId}]`).append(messageTyping);
      nineScrollRight(response.currentUserId);
    }
  });

  //Lắng nghe typing off
  socket.on("response-user-is-not-typing", function(response) {
    //Nếu là nhóm
    if(response.currentGroupId) { 
      //kiểm tra nếu currentuserid truyền về khác với id đang đăng nhập vào
      if(response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
        $(`.chat[data-chat =${response.currentGroupId}]`).find("div.bubble-typing-gif").remove();
        nineScrollRight(response.currentGroupId);
      }
    } else {
      $(`.chat[data-chat =${response.currentUserId}]`).find("div.bubble-typing-gif").remove();
      nineScrollRight(response.currentUserId);
    }
  });
});