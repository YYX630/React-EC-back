const admin = require("../firebase"); //ファイル名省略で自動的にindex.js内のexportを読み込む。
const User = require("../models/user");

//middleware の関数は、第3引数まで必須。処理を終わらせずに、次につづけるため。（これがmiddlewareとcontrollerの違い）

// tokenがvalidかチェックするミドルウェア
exports.authCheck = async (req, res, next) => {
  try {
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    // console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
    req.user = firebaseUser; //ここからもわかるように、  //req, resオブジェクトはプログラムを通してシェアされる。
    next();
  } catch (err) {
    res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

// admin としてのログインのためのセキュリティチェックをするmiddleware.authCheckが終わった後に使うのでreqは更新されている。
exports.adminCheck = async (req, res, next) => {
  const { email } = req.user;

  const adminUser = await User.findOne({ email: email }).exec();

  if (adminUser.role !== "admin") {
    res.status(403).json({ err: "Admin resource. Access denied." });
  } else {
    next();
  }
};
