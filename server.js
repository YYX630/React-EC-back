// serverサイドで最初に実行されるファイル。

// import packages.
const express = require("express"); //node_modulesからパッケージを読み取る。
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs"); // もとからあるnodeのモジュール。ファイルシステムへのアクセスを可能に。
require("dotenv").config(); //process.env.DATABASEの意味を理解させるためのパッケージ。

// app
const app = express(); //execute "express"function. express server are written into the variable "app"

// mongoDBへ接続
mongoose
  .connect(process.env.DATABASE, {
    //config指定引数
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then(() => console.log("DB CONNECTED")) //成功時
  .catch((err) => console.log(`DB CONNECTION ERR ${err}`)); //失敗時

//----optional----------------------------------------------------
//存在しないObjectIdを参照しないようにする
const idValidator = require("mongoose-id-validator");
// 参照バリデータを全てのスキーマに適用
mongoose.plugin(idValidator);
//-----------------------------------------------------

// middle wares : サーバーへの送信前に割り込んでしたいこと。
app.use(morgan("dev")); //"GET /api 200 0.355 ms - 38"のようなlogが出るようになる
app.use(bodyParser.json({ limit: "2mb" }));
app.use(cors());

// ***********************************************route*********************************************
// app.get("/api", (req, res) => {
//   //なんでも
//   res.json({
//     data: "hey you hit node API",
//   });
// }); //get(反応するURL, それに対する返答)
// routeフォルダーに移植。さらに、第二引数はcontrollerとして分離.
// *****************************************************************************************************************************

// *****************************************routes middleware　= routesを呼び出す前にいといとしてから（たとえば、prefixに/api/つけてから...）************************************************************
//1．import routes
//const authRoutes = require("./routes/auth"); fsの使用で不要に。
// 2．使う。
// app.use("/api", authRoutes); //prefix all the routes with "api".------------------]]

//しかし、いちいちrequireしてuseするのはだるい。なのでroutesフォルダ内を全部見るようにする。
fs.readdirSync("./routes").map((filename) => {
  //expressを使う際、app.method("", function)をapp.use("",router), router.method=("",function)に分解。middlewareが差し込みやすい
  const router = require("./routes/" + filename);
  app.use("/api", router);
});
// ****************************************************************************************************************************

// port
const port = process.env.PORT || 8000;

// 実行
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
