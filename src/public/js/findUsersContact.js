function callFindUsers(element) {
  if(element.which === 13 || element.type === "click") {
    let keyword = $("#input-find-users-contact").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    //Kiểm tra nếu client chưa nhập gì vào
    if(!keyword.length) {
      alertify.notify("Bạn chưa nhập nội dung tìm kiếm", "error", 7);
      return false;
    }
    //Kiểm tra regex keyword nhập vào
    if(!regexKeyword.test(keyword)) {
      alertify.notify("Chỉ cho phép nhập vào chữ cái , số và khoảng trắng", "error",7);
      return false;
    }

    $.get(`/contact/find-users/${keyword}`, function(data) {
      //append html render được vào ul
      $("#find-user ul").html(data);
      //js/addContact.js
      addContact();
      //js/removeRequstContact.js
      removeRequestContact();
    });
  }
}
$(document).ready(function() {
  //Bắt sự kiện keypress cho field input find user, "keypress" gõ phím
  $("#input-find-users-contact").bind("keypress",callFindUsers );

  //Bắt sự kiện click cho button find user
  $("#btn-find-users-contact").bind("click", callFindUsers);
});
