import session from "express-session";
import connectMongo from "connect-mongo";

let MongoStore = connectMongo(session);

//Noi luu tru session trong mongodb
let sessionStore = new MongoStore({
  url: `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  autoReconnect: true
  // autoRemove: "native" // khi het han cookie thi se tu dong xoa di cookie trong mongodb
});

//cau hinh session
let config = (app) => {
  app.use(session({
    key: "express.sid",
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 //thoi gian song cua cookie trong 1 ngay
    }
  }));
};

module.exports =  {
  config : config,
  sessionStore : sessionStore
}
