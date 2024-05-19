import path from "node:path";
import crypto from "node:crypto";
import multer from "multer";
import exp from "node:constants";


const storage = multer.diskStorage({
    // вказує в якій папці має зберігтися файл
    destination(req, file, cb) {
    // path.resolve або path.join нормалізують  шлях під конкретну операційну систему
        cb(null, path.resolve("tmp"));
    },
    // вказує з якою назвою має зберегтися файл
    filename(req, file, cb) {
    //вирішення проблеми перезатирання файлів з однаковим іменем
        const extname = path.extname(file.originalname);
        const basename = path.basename(file.originalname, extname);
        const suffix = crypto.randomUUID();
        // console.log(`${basename}-${suffix}${extname}`);
        cb(null, `${basename}-${suffix}${extname}`);
    }

}); 

export default multer({ storage });