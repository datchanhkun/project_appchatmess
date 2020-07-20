

function addContact() {
  $(".user-add-new-contact").bind("click", function() {
    let targetId = $(this).data("uid");
    console.log(targetId);
    $.post("/contact/add-new", {uid: targetId}, function(data) {
      console.log(data);
      if(data.success) {
        //Tìm đến thẻ li để ẩn btn thêm và hiện btn hủy
        $("#find-user").find(`div.user-add-new-contact[data-uid = ${targetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact[data-uid = ${targetId}]`).css("display","inline-block");
        increaseNumberNotifContact("count-request-contact-sent");
        //Xử lý realtime
      }
    });
  });
}