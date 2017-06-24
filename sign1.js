var graphene = require("graphene-pk11");
var readline = require('readline');
var sha1 = require('sha1');

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
                process.stdout.write("\033[2K\033[200D" + query + Array(rl.line.length+1).join("*"));
                break;
        }
    });

    rl.question(query, function(value) {
        rl.history = rl.history.slice(1);
        callback(value);
    });
}

hidden("password : ", function(password) {
    var Module = graphene.Module;
    var lib = "/usr/lib/eidklient/libpkcs11_sig_x64.so";
    var mod = Module.load(lib, "Eid");
    mod.initialize();

    var session = mod.getSlots(1).open();
    session.login(password);
    //privatny kluc
    var privateKeys = session.find({class:graphene.ObjectClass.PRIVATE_KEY});
    var privateKey = privateKeys.items(0);
     
    //public kluc
    //var publicKeys = session.find({class:graphene.ObjectClass.PUBLIC_KEY});
    //var publicKey = publicKeys.item(0);

    var MESSAGE = "Fuu ha funguje to :D lalalala";
    MESSAGE = sha1(MESSAGE);
    var signature = session.createSign("RSA_PKCS", privateKey).once(MESSAGE);
    
    console.log("Message: " + MESSAGE);
    console.log("RSA_PKCS: " + signature.toString("hex"));
    
    console.log("\n====================================");
    console.log("Verify");
    //var verify = session.createVerify("RSA_PKCS", publicKey).once(signature);
    //console.log("Verify result: ", verify);
    
    session.logout();
    session.close();
    mod.finalize();
});
