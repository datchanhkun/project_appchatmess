//Hàm convert từ binary sang base64 để lấy được avatar
export let bufferToBase64 = (bufferFrom) => {
  return Buffer.from(bufferFrom).toString("base64");
};