//Hàm tăng giảm số lượng cho lời mời kết bạn và thông báo trên thanh navbar
function decreaseNumberNotification(className,number) {
  let currentValue = +$(`.${className}`).text();
  currentValue -= number;
  if(currentValue === 0) {
    $(`.${className}`).css("display","none").html("");
  } else {
    $(`.${className}`).css("display","block").html(currentValue);
  }
}

function increaseNumberNotification(className, number) {
  let currentValue = +$(`.${className}`).text();
  currentValue += number;
  if(currentValue === 0) {
    $(`.${className}`).css("display","none").html("");
  } else {
    $(`.${className}`).css("display","block").html(currentValue);
  }
}
