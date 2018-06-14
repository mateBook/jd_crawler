var crypto = require('crypto');
var md5 = crypto.createHash('md5'),
    icon = "1099725538@qq.com"
    email_MD5 = md5.update(icon.toLowerCase()).digest('hex'),
    head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";

    console.log(head);
