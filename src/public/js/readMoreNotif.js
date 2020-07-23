$(document).ready(function() {
  $("#link-read-more-notif").bind("click", function() {
    let skipNumber = $("ul.list-notifications").find("li").length;
    $.get(`/notification/read-more?skipNumber=${skipNumber}`, function(notifications) {
      // console.log(notifications);
    if(!notifications.length) {
      alertify.notify("Bạn không còn thông báo nào để xem nữa","error",7);
      return false;
    }
    notifications.forEach(function(notification) {
      //Append thông báo bên dưới khi người dùng click vào xem thêm
      $("ul.list-notifications").append(`<li> ${notification} </li>`);
    })
    });
  });
});