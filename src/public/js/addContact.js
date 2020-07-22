

function addContact() {
  $(".user-add-new-contact").bind("click", function () {
    let targetId = $(this).data("uid");
    console.log(targetId);
    $.post("/contact/add-new", { uid: targetId }, function (data) {
      console.log(data);
      if (data.success) {
        //Tìm đến thẻ li để ẩn btn thêm và hiện btn hủy
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display", "inline-block");
        increaseNumberNotifContact("count-request-contact-sent");
        //Xử lý realtime
        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}
//id, username, avatar lấy từ addNewContact
socket.on("response-add-new-contact", function(user) {
  let notif = `<span class="notif-readed-false" data-uid="${user.id}">
              <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
              <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
              </span><br><br><br>`;
  //Sau khi có thông báo thì dom dữ liệu vào trong web, prepend đẩy những thông báo mới nhất lên trên
  $(".noti_content").prepend(notif);
  increaseNumberNotifContact("count-request-contact-received");

  increaseNumberNotification("noti_contact_counter");
  increaseNumberNotification("noti_counter");
});
