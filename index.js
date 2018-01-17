var bitcoin = require('bitcoinjs-lib')
var testnet = bitcoin.networks.testnet

const serviceFeePercent = 0.04
const networkFee = 300000
const serviceFeeOutputAddress = 'mhRisqNUWMt6bpB9uWLHx3bSBVP4EqUrTS'

const inputPrivateKey = 'cNBCLzxuPygDygtgSEdqu8jeig4tvNxr3oMTJaL7uT7mqt4iagJr' //testnet
const inputTxId = '0e05f3eb3ce168466bfbbf3cd6feeed75b66840424df817aac03aacf4080b702'
const inputAmount = btc_to_sats(0.5865438)

const serviceFeeAmount = Math.ceil(inputAmount * serviceFeePercent)
const outputAmount = inputAmount - serviceFeeAmount - networkFee
const outputAddress = 'mpVKw3WquXncCDkdHSv2HjWVBTngAyVJfT'


// copy paste from https://github.com/bitcoinjs/bitcoinjs-lib/blob/master/test/integration/transactions.js#L151
var keyPair = bitcoin.ECPair.fromWIF(inputPrivateKey, testnet)
var pubKey = keyPair.getPublicKeyBuffer()
var pubKeyHash = bitcoin.crypto.hash160(pubKey)

var redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(pubKeyHash)
var redeemScriptHash = bitcoin.crypto.hash160(redeemScript)

var scriptPubKey = bitcoin.script.scriptHash.output.encode(redeemScriptHash)
var address = bitcoin.address.fromOutputScript(scriptPubKey, testnet)

console.log("Input address:", address)
console.log("Input amount:", sats_to_btc(inputAmount))
console.log("Input redeemScript:", redeemScript.toString('hex'))
console.log("Input scriptPubKey:", scriptPubKey.toString('hex'))
console.log("")
console.log("Output address:", outputAddress)
console.log("Output amount:", sats_to_btc(outputAmount))
console.log("Network fee (calculated):", sats_to_btc(networkFee))
console.log("Network fee (actual):", sats_to_btc(inputAmount-(outputAmount+serviceFeeAmount)))
console.log("")
console.log("Service fee output address:", serviceFeeOutputAddress)
console.log("Service fee amount:", sats_to_btc(serviceFeeAmount))




var txb = new bitcoin.TransactionBuilder(testnet)
// var txb = new bitcoin.TransactionBuilder()
txb.addInput(inputTxId, 1) // vout from https://testnet.blockexplorer.com/api/addr/2N4ke6EfP3m5qmx7yWNZxq8HhTM5wKuZK9o/utxo
txb.addOutput(outputAddress, outputAmount)
txb.addOutput(serviceFeeOutputAddress, serviceFeeAmount)
txb.sign(0, keyPair, redeemScript, null, inputAmount)

var tx = txb.build().toHex()
console.log("\n\nRaw TX:")
console.log(tx)



return

console.log("\n\nBroadcasting tx...")
// POST to testnet api to broadcast TX
var request = require('request');
request.post({
     url: "https://testnet-api.smartbit.com.au/v1/blockchain/pushtx",
     headers: {
        "Content-Type": "application/json"
     },
     body: {
       "hex": tx
     },
     json:true
}, function(error, response, body){
   console.log(error);
   console.log(body);
});




function btc_to_sats(btc) {
    return Math.round(btc*100000000)
}
function sats_to_btc(sats) {
    var b = sats*0.00000001
    return Number(Math.round(b+'e'+8)+'e-'+8); // round to 8 decimal places fucking floats kill me
}