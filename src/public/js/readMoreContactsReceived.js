$(document).ready(function() {
  $("#link-read-more-contacts-received").bind("click", function() {
    let skipNumber = $("#request-contact-received").find("li").length;
    $.get(`/contact/read-more-contacts-received?skipNumber=${skipNumber}`, function(newContactUsers) {
      // console.log(notifications);
    if(!newContactUsers.length) {
      alertify.notify("Bạn không còn danh sách nào để xem nữa","error",7);
      return false;
    }
    newContactUsers.forEach(function(user) {
      // console.log(user);
      //Tiến hành dom dữ liệu tìm được ra view
      //Append thông báo bên dưới khi người dùng click vào xem thêm
      $("#request-contact-received")
      .find("ul")
      .append(
        `<li class="_contactList" data-uid="${user._id}">
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
                <span>${(user.address !== null ? user.address : "")}</span>
              </div>
              <div class="user-acccept-contact-received" data-uid="${user._id}">
                  Chấp nhận
              </div>
              <div class="user-remove-request-contact-received action-danger"
                  data-uid="${user._id}">
                  Xóa yêu cầu
              </div>
          </div>
      </li>`);
    });
    removeRequestContactReceived();//js/removeRequestContactReceived.js
    });
  });
});
