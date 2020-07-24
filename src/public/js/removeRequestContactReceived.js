

function removeRequestContactReceived() {
  //Vì hàm removeRequestContactReceived() được gọi request lên server quá nhiều lần(3 lần 1 click) nên sẽ bị lỗi server khi click hủy nhiều user
  //Sử dụng hàm unbind: khi click hủy yêu cầu thì sẽ xóa hết request và gọi hàm onlick
  $(".user-remove-request-contact-received").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");
    $.ajax({
      url: "/contact/remove-request-contact-received",
      type: "delete",
      data: { uid: targetId },
      success: function (data) {
        // console.log(data);
        if (data.success) {
          // //Xóa thông báo ở modal notification và modal navbar
          // $(".noti_content").find(`div[data-uid = ${user.id}]`).remove();
          // $("ul.list-notifications").find(`li>div[data-uid = ${user.id}]`).parent().remove();
          // decreaseNumberNotification("noti_counter", 1);

          //Giảm số lượng yêu cầu kết bạn ở navbar
          decreaseNumberNotification("noti_contact_counter", 1);
          //Giảm số lượng ở modal yêu cầu kết bạn
          decreaseNumberNotifContact("count-request-contact-received");

          //xoá html thẻ li khi người dùng huỷ yêu cầu kết bạn ở modal yêu cầu kết bạn
          $("#request-contact-received").find(`li[data-uid = ${targetId}]`).remove();

          //Xử lý realtime
          socket.emit("remove-request-contact-received", { contactId: targetId });
        }
      }
    });
  });
}

//id, username, avatar lấy từ addNewContact
socket.on("response-remove-request-contact-received", function (user) {
  //Tìm đến thẻ li để ẩn btn thêm và hiện btn hủy ở tìm user
  $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${user.id}]`).hide();
  $("#find-user").find(`div.user-add-new-contact[data-uid = ${user.id}]`).css("display", "inline-block");


  //xoá html thẻ li khi người dùng huỷ yêu cầu kết bạn ở modal đang chờ xác nhận
  $("#request-contact-sent").find(`li[data-uid = ${user.id}]`).remove();

  //Giảm số lượng ở modal đang chờ xác nhận của user gửi yêu cầu kết bạn
  decreaseNumberNotifContact("count-request-contact-sent");
  //Giảm số lượng quản lý yêu cầu ở navbar
  decreaseNumberNotification("noti_contact_counter", 1);

});

$(document).ready(function () {
  removeRequestContactReceived();
})
