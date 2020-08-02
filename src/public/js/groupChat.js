function addFriendsToGroup() {
  $("ul#group-chat-friends").find("div.add-user").bind("click", function () {
    let uid = $(this).data("uid");
    $(this).remove();
    let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

    let promise = new Promise(function (resolve, reject) {
      $("ul#friends-added").append(html);
      $("#groupChatModal .list-user-added").show();
      resolve(true);
    });
    promise.then(function (success) {
      $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
    });
  });
}

function cancelCreateGroup() {
  $("#btn-cancel-group-chat").bind("click", function () {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function (index) {
        $(this).remove();
      });
    }
  });
}
function callSearchFriends(element) {
  if (element.which === 13 || element.type === "click") {
    let keyword = $("#input-search-friends-to-add-group-chat").val();
    let regexKeyword = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    //Kiểm tra nếu client chưa nhập gì vào
    if (!keyword.length) {
      alertify.notify("Bạn chưa nhập nội dung tìm kiếm", "error", 7);
      return false;
    }
    //Kiểm tra regex keyword nhập vào
    if (!regexKeyword.test(keyword)) {
      alertify.notify("Chỉ cho phép nhập vào chữ cái , số và khoảng trắng", "error", 7);
      return false;
    }

    $.get(`/contact/search-friends/${keyword}`, function (data) {
      //append html render được vào ul
      $("ul#group-chat-friends").html(data);
      // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    });
  }
};

function callCreateGroupChat() {
  $("#btn-create-group-chat").unbind("click").on("click", function () {
    let countUsers = $("ul#friends-added").find("li");
    //Kiểm tra tối thiểu 2 người trở lên mới cho tạo group
    if (countUsers.length < 2) {
      alertify.notify("Vui lòng chọn bạn bè để thêm vào nhóm, tối thiểu 2 người", "error", 7);
      return false;
    }

    let groupChatName = $("#input-name-group-chat").val();
    let regexGroupChatName = new RegExp(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/);
    if (!regexGroupChatName.test(groupChatName) || groupChatName.length < 5 || groupChatName.length > 30) {
      alertify.notify("Vui lòng nhập tên cuộc trò chuyện giới hạn từ 5-30 kí tự và không chứa các kí tự đặc biệt!", "error", 7);
      return false;
    }

    let arrayIds = [];
    $("ul#friends-added").find("li").each(function (index, item) {
      arrayIds.push({ "userId": $(item).data("uid") });
    });
    Swal.fire({
      title: `Bạn có chắc chắn muốn tạo nhóm &nbsp; ${groupChatName}?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy"
    }).then((result) => {
      if (!result.value) {
        return false;
      }
      $.post("/group-chat/add-new", {
        arrayIds: arrayIds,
        groupChatName: groupChatName
      }, function (data) {
        //1. Ẩn modal khi tạo thành công 1 nhóm trò chuyện
        $("#input-name-group-chat").val("");
        $("btn-cancel-group-chat").click();
        $("#groupChatModal").modal("hide");

        //2. handle leftside.ejs
        let subGroupChatName = data.groupChat.name;
        if (subGroupChatName.length > 15) {
          subGroupChatName = subGroupChatName.substr(0, 14);
        }
        let leftSideData = `
            <a href="#uid_${data.groupChat._id}" class="room-chat" data-target="#to_${data.groupChat._id}">
            <li class="person group-chat" data-chat="${data.groupChat._id}">
                <div class="left-avatar">
                    <!-- <div class="dot"></div> -->
                    <img src="images/users/group-chat-images.png" alt="">
                </div>
                <span class="name">
                    <span class="group-chat-name">
                      ${subGroupChatName}<span>...</span>
                    </span>
                </span>
                <span class="time">
                </span>
                <span class="preview"> 
                </span>
            </li>
          </a>`;
        $("#all-chat").find("ul").prepend(leftSideData);
        $("#group-chat").find("ul").prepend(leftSideData);

        //3.handle rightside.ejs
        let rightSideData = `
        <div class="right tab-pane" data-chat="${data.groupChat._id}"
        id="to_${data.groupChat._id}">
        <div class="top">
            <span>To: <span class="name">${data.groupChat.name}</span></span>
            <span class="chat-menu-right">
                <a href="#attachmentsModal_${data.groupChat._id}" class="show-attachments" data-toggle="modal">
                    Tệp đính kèm
                    <i class="fa fa-paperclip"></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="#imagesModal_${data.groupChat._id}" class="show-images" data-toggle="modal">
                    Hình ảnh
                    <i class="fa fa-photo"></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                    <span class="show-number-members">${data.groupChat.userAmount} </span> 
                    <i class="fa fa-users"></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                    <span class="show-number-messages">${data.groupChat.messageAmount} </span> 
                    <i class="fa fa-comment-o"></i>
                </a>
            </span>
              </div>
              <div class="content-chat">
                  <div class="chat" data-chat="${data.groupChat._id}">
                  </div>
              </div>
              <div class="write" data-chat="${data.groupChat._id}">
                  <input type="text" class="write-chat chat-in-group" id="write-chat-${data.groupChat._id}" data-chat="${data.groupChat._id}">
                  <div class="icons">
                      <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                      <label for="image-chat-${data.groupChat._id}">
                          <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group"
                              data-chat="${data.groupChat._id}">
                          <i class="fa fa-photo"></i>
                      </label>
                      <label for="attachment-chat-${data.groupChat._id}">
                          <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group"
                              data-chat="${data.groupChat._id}">
                          <i class="fa fa-paperclip"></i>
                      </label>
                      <a href="#streamModal" id="video-chat" class="video-chat" data-chat="${data.groupChat._id}"
                          data-toggle="modal">
                          <i class="fa fa-video-camera"></i>
                      </a>
                      <input type="hidden" id="peer-id" value="">
                  </div>
              </div>
          </div>
              `;
        $("#screen-chat").prepend(rightSideData);

        //4. Gọi lại function changeScreenChat
        changeScreenChat();

        //5.Handle modal xem tất cả ảnh
        let imageModalData = `
          <div class="modal fade" id="imagesModal_${data.groupChat._id}" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện. </h4>
                    </div>
                    <div class="modal-body">
                        <div class="all-images" style="visibility: hidden;">
                        </div>
                    </div>
                </div>
            </div>
          </div>
        `;
        $("body").append(imageModalData);

        //6.Gọi đến hàm GridPhotos
        gridPhotos(5);

        //7. Handle đến modal xem tất cả tệp
        let attachmentModalData = `
          <div class="modal fade" id="attachmentsModal_${data.groupChat._id}" role="dialog">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Những tệp đính kèm trong cuộc chuyện. </h4>
                    </div>
                    <div class="modal-body">
                        <ul class="list-attachments"></ul>
                    </div>
                </div>
            </div>
          </div>`;
        $("body").append(attachmentModalData);

        //8. Emit sự kiện tạo mới 1 cuộc trò chuyện nhóm
        socket.emit("new-group-created", { groupChat: data.groupChat });

        //10. update user online offline
        socket.emit("check-status");
      })
        .fail(function (response) {
          alertify.notify(response.responseText, "error", 7);
        });
    });
  });
};
$(document).ready(function () {
  //Bắt sự kiện keypress cho field input find user, "keypress" gõ phím
  $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends);

  //Bắt sự kiện click cho button find user
  $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends);
  callCreateGroupChat();

  socket.on("response-new-group-created", function (response) {

    //2. handle leftside.ejs
    let subGroupChatName = response.groupChat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.substr(0, 14);
    }
    let leftSideData = `
                <a href="#uid_${response.groupChat._id}" class="room-chat" data-target="#to_${response.groupChat._id}">
                <li class="person group-chat" data-chat="${response.groupChat._id}">
                    <div class="left-avatar">
                        <!-- <div class="dot"></div> -->
                        <img src="images/users/group-chat-images.png" alt="">
                    </div>
                    <span class="name">
                        <span class="group-chat-name">
                          ${subGroupChatName}<span>...</span>
                        </span>
                    </span>
                    <span class="time">
                    </span>
                    <span class="preview"> 
                    </span>
                </li>
              </a>`;
    $("#all-chat").find("ul").prepend(leftSideData);
    $("#group-chat").find("ul").prepend(leftSideData);

    //3.handle rightside.ejs
    let rightSideData = `
            <div class="right tab-pane" data-chat="${response.groupChat._id}"
            id="to_${response.groupChat._id}">
            <div class="top">
                <span>To: <span class="name">${response.groupChat.name}</span></span>
                <span class="chat-menu-right">
                    <a href="#attachmentsModal_${response.groupChat._id}" class="show-attachments" data-toggle="modal">
                        Tệp đính kèm
                        <i class="fa fa-paperclip"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="#imagesModal_${response.groupChat._id}" class="show-images" data-toggle="modal">
                        Hình ảnh
                        <i class="fa fa-photo"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)" class="number-members" data-toggle="modal">
                        <span class="show-number-members">${response.groupChat.userAmount} </span> 
                        <i class="fa fa-users"></i>
                    </a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)">&nbsp;</a>
                </span>
                <span class="chat-menu-right">
                    <a href="javascript:void(0)" class="number-messages" data-toggle="modal">
                        <span class="show-number-messages">${response.groupChat.messageAmount} </span> 
                        <i class="fa fa-comment-o"></i>
                    </a>
                </span>
                  </div>
                  <div class="content-chat">
                      <div class="chat" data-chat="${response.groupChat._id}">
                      </div>
                  </div>
                  <div class="write" data-chat="${response.groupChat._id}">
                      <input type="text" class="write-chat chat-in-group" id="write-chat-${response.groupChat._id}" data-chat="${response.groupChat._id}">
                      <div class="icons">
                          <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i class="fa fa-smile-o"></i></a>
                          <label for="image-chat-${response.groupChat._id}">
                              <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat" class="image-chat chat-in-group"
                                  data-chat="${response.groupChat._id}">
                              <i class="fa fa-photo"></i>
                          </label>
                          <label for="attachment-chat-${response.groupChat._id}">
                              <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat" class="attachment-chat chat-in-group"
                                  data-chat="${response.groupChat._id}">
                              <i class="fa fa-paperclip"></i>
                          </label>
                          <a href="#streamModal" id="video-chat" class="video-chat" data-chat="${response.groupChat._id}"
                              data-toggle="modal">
                              <i class="fa fa-video-camera"></i>
                          </a>
                          <input type="hidden" id="peer-id" value="">
                      </div>
                  </div>
              </div>
                  `;
    $("#screen-chat").prepend(rightSideData);

    //4. Gọi lại function changeScreenChat
    changeScreenChat();

    //5.Handle modal xem tất cả ảnh
    let imageModalData = `
              <div class="modal fade" id="imagesModal_${response.groupChat._id}" role="dialog">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Những hình ảnh trong cuộc trò chuyện. </h4>
                        </div>
                        <div class="modal-body">
                            <div class="all-images" style="visibility: hidden;">
                            </div>
                        </div>
                    </div>
                </div>
              </div>
            `;
    $("body").append(imageModalData);

    //6.Gọi đến hàm GridPhotos
    gridPhotos(5);

    //7. Handle đến modal xem tất cả tệp
    let attachmentModalData = `
              <div class="modal fade" id="attachmentsModal_${response.groupChat._id}" role="dialog">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal">&times;</button>
                            <h4 class="modal-title">Những tệp đính kèm trong cuộc chuyện. </h4>
                        </div>
                        <div class="modal-body">
                            <ul class="list-attachments"></ul>
                        </div>
                    </div>
                </div>
              </div>`;
    $("body").append(attachmentModalData);

    //8
    //9. Emit ngược lại để server nhận được những userId có trong group chat
    socket.emit("member-received-group-chat", {groupChatId: response.groupChat._id});

    //10 update user online offline
    socket.emit("check-status");

  });
});