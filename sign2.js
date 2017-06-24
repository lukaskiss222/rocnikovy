var Crypto = require("node-webcrypto-ossl");

const crypto = new Crypto();

const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256",
}

const JWK = {
  "kty": "RSA",
  "alg": "RS256",
  "ext": true,
  "key_ops": [
    "verify"
  ],
  "e": "AQAB",
  "n": "ke_LcEJyNkE7l8kD5TnIeF-YCqM1XWbqG5thoCmHj1m58VyScQMSXqc7ksQjTiNJ2bHsHS1_kkkV0fpiMht_ykWBtMmJB7spbIP-gRpwuPT-tVXllTAN1CsYlEnWu0oxDjVVxTVpEXqap5VXnEvfbq0p3kMctW_MKuUNMbJsLrA9y8_qvZKfR-r2annYR9UGeSgzLlQFNHbOzHutRk6gkfFZZHn8aS0qR6HpENLX6_x2iWke2Rqo6s9OxgOC_Evw8gQGJUBlumZtTRIXm2lk8crmivfC5iosS0rtPTzTXEfMXRk7ewqNqV_mvYtH2XghwNPq57j5uXpk9YZ42HK-2Q"
} 
const SIGNATURE = new Buffer("040f99d1c74cbf66a784282a7b46656202ed1fd79125a3477bdb42a39cf5b2537a2ed51196e0b91d6feead9844b3652891553ef625020d39be458ff196b26509d0cb577e0fc45d4c505c7dd439a755c2e7a39bee271f07a30481761416e477ac1a1a4d4edf21a68a235c558e8471aea60c9d5ed2ee2a280a4bc8eb0c1c5920e64f92bca03229956170c7eeb386b38879ef689195a726b84230d82107d770ce602c041e78eab62f424919f0765d3e4d7a6e542c41f8a1adb0a66a5b1076384899095219fb467353508be1820459d1e2465150aa789bcb97da312eb802d7cf10024f484bccb54f9123947642817c9109d1ff46588984b67cf26e03cebf79596da0", "hex");
const DATA = new Buffer("Some message here");

crypto.subtle.importKey("jwk", JWK, algorithm, true, ["verify"])
    .then((key) => {
        return crypto.subtle.verify(algorithm, key, SIGNATURE, DATA);
    })
    .then((ok) => {
        console.log("Verification:", ok);
    })
    .catch((err) => {
        console.error(err);
    })
