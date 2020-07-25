//Xóa liên hệ
function removeContact() {
  //Vì hàm approveRequestContactReceived() được gọi request lên server quá nhiều lần(3 lần 1 click) nên sẽ bị lỗi server khi click hủy nhiều user
  //Sử dụng hàm unbind: khi click hủy yêu cầu thì sẽ xóa hết request và gọi hàm onlick
  $(".user-remove-contact").unbind("click").on("click", function () {
    let targetId = $(this).data("uid");
    let username = $(this).parent().find("div.user-name p").text(); //parent ở li đi vào div và đi vào p

    //Hiển thị modal xác nhận có xóa liên hệ hay không (sweetalert2)
    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ?`,
      text: "Bạn không thể hoàn tác lại thao tác này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (!result.value) {
        return false;
      }
      //Nếu đồng ý thì gọi ajax và truyền lên server
      $.ajax({
        url: "/contact/remove-contact",
        type: "delete",
        data: { uid: targetId },
        success: function (data) {
          // console.log(data);
          if (data.success) {
            //Xóa thẻ li trong danh bạ
            $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();
            //Giảm số lượng ở modal yêu cầu kết bạn
            decreaseNumberNotifContact("count-contacts");
            //Xóa user ở phần chat
  
            //Xử lý realtime
            socket.emit("remove-contact", { contactId: targetId });
          }
        }
      });
    });

  });
}

//id, username, avatar lấy từ addNewContact
socket.on("response-remove-contact", function (user) {
  //Xóa thẻ li trong danh bạ
  $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();
  //Giảm số lượng ở modal yêu cầu kết bạn
  decreaseNumberNotifContact("count-contacts");
});

$(document).ready(function () {
  removeContact();
})
