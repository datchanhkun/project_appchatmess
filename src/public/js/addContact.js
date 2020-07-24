

function addContact() {
  $(".user-add-new-contact").bind("click", function () {
    let targetId = $(this).data("uid");
    console.log(targetId);
    $.post("/contact/add-new", { uid: targetId }, function (data) {
      console.log(data);
      if (data.success) {
        //Tìm đến thẻ li để ẩn btn thêm và hiện btn hủy
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targetId}]`).css("display", "inline-block");
        //Đếm thông báo sau khi thêm liên lạc ở thanh navbar
        increaseNumberNotification("noti_contact_counter",1);

        increaseNumberNotifContact("count-request-contact-sent");

        //Hiển thị dữ liệu ra chờ xác nhận sau khi click thêm bạn bè
        //Lấy html toàn bộ thẻ li trong $find-user để dom qua thẻ ul #request-contact-sent(modal đang chờ xác nhận)
        let userInfoHtml = $("#find-user").find(`ul li[data-uid = ${targetId}]`).get(0).outerHTML; //contactModal
        $("#request-contact-sent").find("ul").prepend(userInfoHtml);
        //Gọi sự kiện hủy yêu cầu ở modal đang chờ xác nhận
        removeRequestContactSent();
        //Xử lý realtime
        socket.emit("add-new-contact", { contactId: targetId });
      }
    });
  });
}
//id, username, avatar lấy từ addNewContact
socket.on("response-add-new-contact", function(user) {
  let notif = `<div class="notif-readed-false" data-uid="${user.id}">
              <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
              <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
              </div>`;
  //Sau khi có thông báo thì dom dữ liệu vào trong web, prepend đẩy những thông báo mới nhất lên trên
  $(".noti_content").prepend(notif);
  $("ul.list-notifications").prepend(`<li> ${notif} </li>`); // thêm ở modal notif
  increaseNumberNotifContact("count-request-contact-received");

  increaseNumberNotification("noti_contact_counter",1);
  increaseNumberNotification("noti_counter",1);
//Lấy html toàn bộ thẻ li trong $find-user để dom qua thẻ ul #request-contact-received(modal yêu cầu kết bạn)
  let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                      <div class="contactPanel">
                          <div class="user-avatar">
                              <img src="images/users/${user.avatar}" alt="">
                          </div>
                          <div class="user-name">
                              <p>
                              ${user.username}
                              </p>
                          </div>
                          <br>
                          <div class="user-address">
                              <span>${user.address}</span>
                          </div>
                          <div class="user-acccept-contact-received" data-uid="${user.id}">
                              Chấp nhận
                          </div>
                          <div class="user-remove-request-contact-received action-danger"
                              data-uid="${user.id}">
                              Xóa yêu cầu
                          </div>
                      </div>
                    </li>`;
  //Tiến hành dom dữ liệu html vào modal yêu cầu kết bạn
  $("#request-contact-received").find("ul").prepend(userInfoHtml);
  removeRequestContactReceived();//js/removeRequestContactReceived.js
});
