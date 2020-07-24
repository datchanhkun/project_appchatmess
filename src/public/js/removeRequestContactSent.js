

function removeRequestContactSent() {
  //Vì hàm removeRequestContactSent() được gọi request lên server quá nhiều lần(3 lần 1 click) nên sẽ bị lỗi server khi click hủy nhiều user
  //Sử dụng hàm unbind: khi click hủy yêu cầu thì sẽ xóa hết request và gọi hàm onlick
  $(".user-remove-request-contact-sent").unbind("click").on("click", function() {
    let targetId = $(this).data("uid");
    $.ajax({
      url:"/contact/remove-request-contact-sent",
      type: "delete",
      data: {uid: targetId},
      success: function(data) {
        // console.log(data);
        if(data.success) {
          //Tìm đến thẻ li để ẩn btn thêm và hiện btn hủy 
          $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).css("display","inline-block");
          decreaseNumberNotifContact("count-request-contact-sent");

          //xoá html thẻ li khi người dùng huỷ yêu cầu kết bạn ở modal đang chờ xác nhận
          $("#request-contact-sent").find(`li[data-uid = ${targetId}]`).remove();

          //Xử lý realtime
          socket.emit("remove-request-contact-sent", { contactId: targetId });
        }
      }
    });
  });
}

//id, username, avatar lấy từ addNewContact
socket.on("response-remove-request-contact-sent", function(user) {
  $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
  $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();
  
  //xoá html thẻ li khi người dùng huỷ yêu cầu kết bạn ở modal yêu cầu kết bạn
  $("#request-contact-received").find(`li[data-uid = ${user.id}]`).remove();

  decreaseNumberNotifContact("count-request-contact-received");

  decreaseNumberNotification("noti_contact_counter",1);
  decreaseNumberNotification("noti_counter",1);
});

$(document).ready(function () {
  removeRequestContactSent();
})
