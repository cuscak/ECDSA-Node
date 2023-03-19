const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require(" ");

function generatePrivateKey() {
    const privatekey = secp.utils.randomPrivateKey();
    const publicKey = secp.getPublicKey(privatekey);
    const address = keccak256(publicKey.slice(1,)).slice(-20);

    console.log('private key: ', toHex(privatekey));
    console.log('pub key: ', toHex(publicKey));
    console.log('address: ', toHex(address));
}

function hashMessage(message) {
    const bytes = utf8ToBytes(message);
    return keccak256(bytes);
}

const msgHash = hashMessage('Doesnt matter');

async function getSignatures() {
    const acc1Sign = await secp.sign(msgHash, 'ec2c4cc2eca5b8d97e02d4f25a40b39bf1278fa49b4b3196a2908b31437dbc49', { recovered: true });
    const acc2Sign = await secp.sign(msgHash, 'cd2c9e2a51d78b9afad7edebca3ac9c46240a60e181ea8824c21eb61188861fd', { recovered: true });
    const acc3Sign = await secp.sign(msgHash, '98ff20e5e727ef28912632e1c1f2a56e721b6777a097dd2f24930208ebd7b12c', { recovered: true });

    console.log('acc1 signature: ', toHex(acc1Sign[0]));
    console.log('acc1 recovery bit: ', acc1Sign[1]);

    console.log('acc2 signature: ', toHex(acc2Sign[0]));
    console.log('acc2 recovery bit: ', acc2Sign[1]);

    console.log('acc3 signature: ', toHex(acc3Sign[0]));
    console.log('acc3 recovery bit: ', acc3Sign[1]);
}


async function test() {
    const signature = await secp.sign(toHex(msgHash), 'ec2c4cc2eca5b8d97e02d4f25a40b39bf1278fa49b4b3196a2908b31437dbc49', { recovered: true });

    console.log('sig toHex: ', toHex(signature[0]));
    console.log('sig rec bit: ', signature[1]);
    const x = secp.recoverPublicKey(msgHash, signature[0], signature[1]);
    console.log('pub key x:', toHex(x));

    const y = secp.recoverPublicKey(msgHash, signature[0], 0);
    console.log('pub key y:', toHex(y));

    const z = signature.recoverPublicKey(msgHash);
    console.log('pub key z:', toHex(z));
}

async function main(){
    //generatePrivateKey();
    //getSignatures();
    test();
}