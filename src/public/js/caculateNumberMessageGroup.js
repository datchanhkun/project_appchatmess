//Hàm tính tổng số tin nhắn trong group chat
function increaseNumberMessageGroup(divId) {
  //Tìm đếm html của tổng số tin nhắn và convert thành number
  let currentValue = +$(`.right[data-chat=${divId}]`).find("span.show-number-messages").text();
  currentValue += 1;
  //Gán giá trị mới vào lại messageAmount
  $(`.right[data-chat=${divId}]`).find("span.show-number-messages").html(currentValue);
}
