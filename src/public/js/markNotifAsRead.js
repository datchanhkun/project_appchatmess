function markNotificationAsRead(targetUsers) {
  $.ajax({
    url: "/notification/mark-all-as-read",
    type: "put",
    data: {targetUsers: targetUsers},
    success: function (result) {
      if(result) {
        //Nếu result = true thì tiến hành lọc các uid của người dùng
        targetUsers.forEach(function(uid) {
          //Xóa thông báo chưa đọc ở navbar và modal notif
          $(".noti_content").find(`div[data-uid = ${uid}]`).removeClass("notif-readed-false");
          $("ul.list-notifications").find(`li>div[data-uid = ${uid}]`).removeClass("notif-readed-false");
        });
        //Trừ đi số lượng thông báo đã đọc ở thanh navbar
        decreaseNumberNotification("noti_counter",targetUsers.length);
      }
    }
  });
}

$(document).ready(function() {
  //Bắt sự kiện click cho đánh dấu tất cả đã đọc
  $("#popup-mark-notif-as-read").bind("click", function() {
    let targetUsers = [];
    //Lọc lấy dữ liệu uid của từng thông báo, sử dụng hàm each() trong jquery
    $(".noti_content").find("div.notif-readed-false").each(function(index,notification) {
      targetUsers.push($(notification).data("uid"));
    });
    if(!targetUsers.length) {
      alertify.notify("Bạn không còn thông báo nào chưa đọc","error",7);
      return false;
    }
    //Gọi request ajax lên server để thông báo đã đọc
    markNotificationAsRead(targetUsers);
  });
  //Bắt sự kiện click cho modal xem tất cả thông báo
  $("#modal-popup-mark-notif-as-read").bind("click", function() {
    let targetUsers = [];
    //Lọc lấy dữ liệu uid của từng thông báo, sử dụng hàm each() trong jquery
    $("ul.list-notifications").find("li>div.notif-readed-false").each(function(index,notification) {
      targetUsers.push($(notification).data("uid"));
    });
    if(!targetUsers) {
      alertify.notify("Bạn không còn thông báo nào chưa đọc","error",7);
      return false;
    }
    //Gọi request ajax lên server để thông báo đã đọc
    markNotificationAsRead(targetUsers);
  });
});
