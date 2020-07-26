//Biến toàn cục cho socket io
const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}

function nineScrollRight(divId) {
  $(`.right .chat[data-chat = ${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat = ${divId}]`).scrollTop($(`.right .chat[data-chat = ${divId}]`)[0].scrollHeight);
}
//enableEmojioneArea là thư viện biểu tượng cảm xúc
//Hàm ẩn thẻ input gốc đi và chuyển về input của emoijz
function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      //mỗi khi gõ 1 dữ liệu bất kỳ vào div emoij thì keyup sẽ lấy dữ liệu đó gán với input gốc
      keyup: function (editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());
      },
      //Bật lắng nghe DOM cho việc chat tin nhắn văn bản + emoji
      click: function () {
        textAndEmojiChat(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function (event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('.lds-roller').css('display', 'none');
}

function spinLoading() {
  $('.lds-roller').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function () {
      spinLoading();
    })
    .ajaxStop(function () {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function () {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function () {
    $('#notifications').fadeToggle('fast', 'linear');
    $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-content").click(function () {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  $(".show-images").unbind("click").on("click", function () {
    //Lấy địa chỉ của ảnh, tách ra để lấy được id của mỗi ảnh
    let href = $(this).attr("href");
    let modalImagesId = href.replace("#", "");

    let countRows = Math.ceil($(`#${modalImagesId}`).find("div.all-images>img").length / layoutNumber);
    let layoutStr = new Array(countRows).fill(layoutNumber).join("");

    $(`#${modalImagesId}`).find("div.all-images").photosetGrid({
      highresLinks: true,
      rel: "withhearts-gallery",
      gutter: "2px",
      layout: layoutStr,
      onComplete: function () {
        $(`#${modalImagesId}`).find(".all-images").css({
          "visibility": "visible"
        });
        $(`#${modalImagesId}`).find(".all-images a").colorbox({
          photo: true,
          scalePhotos: true,
          maxHeight: "90%",
          maxWidth: "90%"
        });
      }
    });
  });
}


function addFriendsToGroup() {
  $('ul#group-chat-friends').find('div.add-user').bind('click', function () {
    let uid = $(this).data('uid');
    $(this).remove();
    let html = $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').html();

    let promise = new Promise(function (resolve, reject) {
      $('ul#friends-added').append(html);
      $('#groupChatModal .list-user-added').show();
      resolve(true);
    });
    promise.then(function (success) {
      $('ul#group-chat-friends').find('div[data-uid=' + uid + ']').remove();
    });
  });
}

function cancelCreateGroup() {
  $('#cancel-group-chat').bind('click', function () {
    $('#groupChatModal .list-user-added').hide();
    if ($('ul#friends-added>li').length) {
      $('ul#friends-added>li').each(function (index) {
        $(this).remove();
      });
    }
  });
}

function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  //Neu ton tai loi
  if (notify.length) {
    alertify.notify(notify, "success", 7) // cho hien thi thong bao 7s
  }
}
//Bắt sự kiện khi select kiểu chát
function changeTypeChat() {
  $("#select-type-chat").bind("change", function () {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");
    if ($(this).val() == "user-chat") {
      $(".create-group-chat").hide();
    } else {
      $(".create-group-chat").show();
    }
  });
}

//Bắt sự kiện click user chat để hiển thị nội dung, truy xuất vào thẻ a
function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function () {
    //Cấu hình thanh cuộn bên box chat rightSide.ejs mỗi khi người dùng click vào một cuộc trò chuyện cụ thể
    let divId = $(this).find("li").data("chat");
    //Remove thẻ li thành màu trắng
    $(".person").removeClass("active");
    //khi click vào thì màu xám gọi đến active
    $(`.person[data-chat=${divId}]`).addClass("active");
    $(this).tab("show");



    nineScrollRight(divId);
    //Mỗi khi thay đổi màn hình chát thì resert lại chat icon
    // Bật emoji, tham số truyền vào là id của box nhập nội dung tin nhắn
    enableEmojioneArea(divId);
  });
}
$(document).ready(function () {
  // Hide số thông báo trên đầu icon mở modal contact
  showModalContacts();

  // Bật tắt popup notification
  configNotification();

  // Cấu hình thanh cuộn
  nineScrollLeft();

  // Icon loading khi chạy ajax
  ajaxLoading();


  // Hiển thị hình ảnh grid slide trong modal tất cả ảnh, tham số truyền vào là số ảnh được hiển thị trên 1 hàng.
  // Tham số chỉ được phép trong khoảng từ 1 đến 5
  gridPhotos(5);

  // Thêm người dùng vào danh sách liệt kê trước khi tạo nhóm trò chuyện
  addFriendsToGroup();

  // Action hủy việc tạo nhóm trò chuyện
  cancelCreateGroup();

  //flash massage o man hinh master
  flashMasterNotify();

  //Thay đổi kiểu trò chuyện
  changeTypeChat();

  //Bắt sự kiện click user chat để hiển thị nội dung
  changeScreenChat();

  //Click sẵn vào phần tử đầu tiên của cuộc trò chuyện khi load trang web
  $("ul.people").find("a")[0].click();
});
