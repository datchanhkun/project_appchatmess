import moment from "moment";
//Hàm convert từ binary sang base64 để lấy được avatar
export let bufferToBase64 = (bufferFrom) => {
  return Buffer.from(bufferFrom).toString("base64");
};

//Hàm lấy ra phần tử cuối cùng của mảng
export let lastItemOfArray = (array) => {
  //có những cuộc trò chuyện chưa có tin nhắn thì return ra mảng rỗng
  if(!array.length) {
    return [];
  }
  //Lấy độ dài của mảng trừ đi 1 để lấy được index cuối cùng
  return array[array.length - 1];
};
//hàm convert timestamp của updateAt sang ngôn ngữ của người dùng, dùng npm moment js
export let convertTimestampToHumanTime = (timestamp)  => {
  //nếu không có timestamp thì sẽ trả về mảng rồi, fix lỗi "vài giây trước"
  if(!timestamp) {
    return "";
  }
  return moment(timestamp).locale("vi").startOf("seconds").fromNow(); //hiển thị ngôn ngữ VNI theo giây
}