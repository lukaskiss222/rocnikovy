var P11Crypto = require("node-webcrypto-p11");

var crypto = new P11Crypto.WebCrypto({
    library: "/usr/lib/eidklient/libpkcs11_sig_x64.so", // path to the PKCS#11 library
    slot: 1, // index of slot
    pin: "xxxxxx",  //here your BOK code
});

// you can do it in you local js file
// this is template :)

const algorithm = {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-512",
}

const data = new Buffer("Some message here");

crypto.certStorage.keys()
    .then((certs) => {
        // returns list of certificates
        console.log("Certificates:", certs);
        return crypto.keyStorage.keys()
            .then((keys) => {
                // List of keys
                console.log("Keys:", keys);
                return signDocument(algorithm, keys[0], data) // put your key id here
                    .then((signature) => {
                        console.log("Signature:", new Buffer(signature).toString("hex"));
                        return verifyDocument(algorithm, certs[0], signature, data); // put your x509 id here
                    })
                    .then((ok) => {
                        console.log("Verification:", ok)
                        return exportPublicKey(certs[0]);
                    })
                    .then((jwk) => {
                        console.log(JSON.stringify(jwk, null, "  "));
                    })
            })
    })
    .catch((err) => {
        console.error(err);
    })
    
// returns signature as Buffer
function signDocument(algorithm, keyId, message){
    return Promise.resolve()
        .then(() => {
            // get key from storage
            return crypto.keyStorage.getItem(keyId, algorithm, ["sign"]);
        })
        .then((key) => {
            // signing
            return crypto.subtle.sign(algorithm, key, message);
        });
}

// returns true/false
function verifyDocument(algorithm, certId, signature, message) {
    return Promise.resolve()
        .then(() => {
            // get cert from storage
            return crypto.certStorage.getItem(certId, algorithm, ["verify"])
        })
        .then((cert) => {
            console.log("Certificate: ",JSON.stringify(cert.toJSON(), null, "  "));
            // verify
            return crypto.subtle.verify(algorithm, cert.publicKey, signature, message);
        })
}

function exportPublicKey(certId){
    return Promise.resolve()
        .then(() => {
            // get cert from storage
            return crypto.certStorage.getItem(certId, algorithm, ["verify"])
        })
        .then((cert) => {
            return crypto.subtle.exportKey("jwk", cert.publicKey);
        })
                   
}
