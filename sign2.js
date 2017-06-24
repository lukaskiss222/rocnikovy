const graphene = require("graphene-pk11");
const readline = require('readline');
const SHA = require('jssha');
const pkijs = require("pkijs");
const asn1js = require("asn1js");
const Crypto = require("node-webcrypto-ossl");
const crypto = new Crypto();
const base64url = require('base64url');

pkijs.setEngine("OpenSSL", crypto, crypto.subtle);

function sha256(str, type_in, type_out) {
    let sha = new SHA("SHA-256", type_in);
    sha.update(str);
    return sha.getHash(type_out);
}


var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function hidden(query, callback) {
    var stdin = process.openStdin();
    process.stdin.on("data", function(char) {
        char = char + "";
        switch (char) {
            case "\n":
            case "\r":
            case "\u0004":
                stdin.pause();
                break;
            default:
                process.stdout.write("\033[2K\033[200D" + query + Array(rl.line.length + 1).join("*"));
                break;
        }
    });

    rl.question(query, function(value) {
        rl.history = rl.history.slice(1);
        callback(value);
    });
}

hidden("password : ",  function(password) {
    var Module = graphene.Module;
    var lib = "/usr/lib/eidklient/libpkcs11_sig_x64.so";
    var mod = Module.load(lib, "Eid");
    mod.initialize();

    var session = mod.getSlots(1).open();
    console.log("[*] Loggin in");
    session.login(password);
    //privatny kluc
    var privateKeys = session.find({
        class: graphene.ObjectClass.PRIVATE_KEY
    });
    var privateKey = privateKeys.items(0);

    //createVerify
    var certs = session.find({
        class: graphene.ObjectClass.CERTIFICATE,
        certType: graphene.CertificateType.X_509
    });

    const x509Object = certs.items(0).toType();
    const x509ArrayBuffer = new Uint8Array(x509Object.value).buffer;
    const asn1 = asn1js.fromBER(x509ArrayBuffer);
    const x509 = new pkijs.Certificate({
        schema: asn1.result
    });
    // Get public key from Certificate
    const publicKeyInfoSchema = x509.subjectPublicKeyInfo.toSchema();
    const publicKeyInfoBuffer = publicKeyInfoSchema.toBER(false);
    const MESSAGE = "String, which should be signed";
    var message_sha = sha256(MESSAGE, "TEXT", "HEX");

    var buf_message_sha = new Buffer(message_sha, "hex");
    console.log("Buf-sha: " + buf_message_sha);


    var signature = session.createSign("RSA_PKCS", privateKey).once(buf_message_sha);
    //console.log(x509.toJSON());
    console.log("Message: " + MESSAGE);
    console.log("SHA-256 Message: " + message_sha);
    console.log("RSA_PKCS: " + signature.toString("hex"));

    console.log("\n====================================");
    console.log("Verify");

    var jwk = x509.subjectPublicKeyInfo.toJSON();
    console.log(base64url.toBuffer(jwk.e));
    const template = {
      token: false,
      class: graphene.ObjectClass.PUBLIC_KEY,
      keyType: graphene.KeyType.RSA,
      //label: "SIG_EP",
      //id: Buffer,
      verify: true,
      encrypt: false,
      wrap: false,
      publicExponent: base64url.toBuffer(jwk.e),
      modulus: base64url.toBuffer(jwk.n)
    };

    console.log(template);

    var publicKey = session.create(template).toType();
    console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");

    var verify = session.createVerify("RSA_PKCS",publicKey).once(buf_message_sha,signature);

    console.log("Verify: " + verify);

    console.log("End, closing connection");

    session.logout();
    session.close();
    mod.finalize();
});
