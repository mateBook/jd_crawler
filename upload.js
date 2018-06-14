const  koa = require("koa");
const Koa = require('koa');
const router = require('koa-router')();
const multer = require('koa-router-multer');
const server = require('koa-static');

const app = new Koa();

app.use(server(__dirname + '/views'));

const upload = multer({ dest: 'uploads/' });

router.post('/profile', upload.single('file'));
app.use(router.routes());

app.listen(3000);

console.log('listening on port 3000');