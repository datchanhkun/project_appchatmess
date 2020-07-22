import {notification} from "./../services/index";

let getHome = async(req, res) => {
  //Chỉ hiển thị 10 thông báo
  let notifications = await notification.getNotifications(req.user._id);
  //Đếm tổng số những thông báo chưa đọc
  let countNotiUnread = await notification.countNotiUnread(req.user._id);

  //Return ra view
  return res.render("main/home/home" , {
    errors: req.flash("errors"),
    success: req.flash("success"),
    user: req.user, // lay thang du lieu tu user
    notifications: notifications,
    countNotiUnread: countNotiUnread
    
  });
};

module.exports = {
  getHome: getHome
};
