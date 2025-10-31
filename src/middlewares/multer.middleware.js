import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // './public/temp' folder me hum temporary files ko store kr rhe hain
    // cb (callback) do(2)argument (params) leta h... 1st argument error ke liye hota h agr error h to voh pass krte h verna null krte h
    // 2nd argument me destination folder ka path dete h.
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // file.originalname se hume file ka original naam milta h
    // hum yahan file ka naam change kr sakte h ya phir same rakh sakte h
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({
  storage,
});
