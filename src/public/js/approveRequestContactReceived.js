function approveRequestContactReceived() {
  //Vì hàm approveRequestContactReceived() được gọi request lên server quá nhiều lần(3 lần 1 click) nên sẽ bị lỗi server khi click hủy nhiều user
  //Sử dụng hàm unbind: khi click hủy yêu cầu thì sẽ xóa hết request và gọi hàm onlick
  $(".user-approve-request-contact-received").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");

    $.ajax({
      url: "/contact/approve-request-contact-received",
      type: "put",
      data: { uid: targetId },
      success: function (data) {
        // console.log(data);
        if (data.success) {
          //Lấy ra thẻ li của 1 data uid
          let userInfo = $("#request-contact-received").find(`ul li[data-uid = ${targetId}]`);
          //Xóa nút chấp nhận trong thẻ li
          $(userInfo).find("div.user-approve-request-contact-received").remove();
          //Xóa nút hủy yêu cầu trong thẻ li
          $(userInfo).find("div.user-remove-request-contact-received").remove();
          //Thêm nút trò chuyện và xóa yêu cầu vào thẻ li(thêm vào cuối)
          $(userInfo).find("div.contactPanel")
            .append(`<div class="user-talk" data-uid="${targetId}">
                    Trò chuyện
                </div>
                <div class=" user-remove-contact action-danger" data-uid="${targetId}">
                    Xóa liên hệ
                </div>
              </div>
              `);
          //lấy html của thẻ li sau đó chuyển qua bên modal danh bạ 
          let userInfoHtml = userInfo.get(0).outerHTML;
          $("#contacts").find("ul").prepend(userInfoHtml);
          //Sau khi chuyển qua danh bạ thì remove user trong modal yêu cầu kết bạn
          $(userInfo).remove();
          //Giảm số lượng ở modal yêu cầu kết bạn
          decreaseNumberNotifContact("count-request-contact-received");
          //Tăng số lượng ở modal danh bạ
          increaseNumberNotifContact("count-contacts");
          //Giảm số lượng ở quản lý yêu cầu trên thanh navbar
          decreaseNumberNotification("noti_contact_counter", 1);
          //Xóa liên hệ
          removeContact();
          //Xử lý realtime
          socket.emit("approve-request-contact-received", { contactId: targetId });
        }
      }
    });
  });
}

//id, username, avatar lấy từ addNewContact
socket.on("response-approve-request-contact-received", function (user) {
  //Hiển thị thông báo cho contactId khi userId chấp nhận yêu cầu
  let notif = `<div class="notif-readed-false" data-uid="${user.id}">
              <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
              <strong>${user.username}</strong> đã chấp nhận lời mời kết bạn của bạn!
              </div>`;
  //Sau khi có thông báo thì dom dữ liệu vào trong web, prepend đẩy những thông báo mới nhất lên trên
  $(".noti_content").prepend(notif);
  $("ul.list-notifications").prepend(`<li> ${notif} </li>`); // thêm ở modal notif
  //Giảm quản lý yêu cầu ở navbar đi 1
  decreaseNumberNotification("noti_contact_counter", 1);
  //Tăng thông báo ở navbar lên 1
  increaseNumberNotification("noti_counter", 1);

  //Giảm số lượng ở modal đang chờ xác nhận đối với contactId
  decreaseNumberNotifContact("count-request-contact-sent");
  //Tăng số lượng ở modal danh bạ
  increaseNumberNotifContact("count-contacts");
  //Xóa thẻ li trong modal đang chờ xác nhận
  $("#request-contact-sent").find(`ul li[data-uid = ${user.id}]`).remove();
  //Xóa thẻ li trong model tìm người dùng
  $("#find-user").find(`ul li[data-uid = ${user.id}]`).remove();
  //Tạo bản ghi mới sau đó prepend vào danh bạ sau khi đã xóa trong modal đang chờ xác nhận
  let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                      <div class="contactPanel">
                          <div class="user-avatar">
                              <img src="images/users/${user.avatar}" alt="">
                              </div>
                              <div class=" user-name">
                              <p>
                              ${user.username}
                              </p>
                          </div>
                          <br>
                          <div class="user-address">
                              <span> ${(user.address !== null ? user.address : "")} </span> 
                          </div>
                          <div class="user-talk" data-uid="${user.id}">
                                  Trò chuyện
                              </div>
                              <div class=" user-remove-contact action-danger" data-uid="${user.id}">
                                  Xóa liên hệ
                              </div>
                          </div>
                      </li>`;
  $("#contacts").find("ul").prepend(userInfoHtml);
  removeContact();
});

$(document).ready(function () {
  approveRequestContactReceived();
})

