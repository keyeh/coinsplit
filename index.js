var bitcoin = require('bitcoinjs-lib')
var testnet = bitcoin.networks.testnet

const serviceFeePercent = 0.04
const networkFee = 30001
const serviceFeeOutputAddress = 'mhRisqNUWMt6bpB9uWLHx3bSBVP4EqUrTS'

const pk = 'cMahea7zqjxrtgAbB7LSGbcQUr1uX1ojuat9jZodMN87JcbXMTcA' //testnet
const txInput = '386ae8fc315a96775fbb314c2561bd7d59a4d759e9ac55b9316676a196e82252'
const txInputAmount = btc_to_sats(1.43669591)

const serviceFeeAmount = Math.ceil(txInputAmount * serviceFeePercent)
const outputAmount = txInputAmount - serviceFeeAmount - networkFee
const outputAddress = 'mpVKw3WquXncCDkdHSv2HjWVBTngAyVJfT'



var keyPair = bitcoin.ECPair.fromWIF(pk, testnet)
// var keyPair = bitcoin.ECPair.fromWIF(pk)
var pubKey = keyPair.getPublicKeyBuffer()

var redeemScript = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey))
var scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript))
var address = bitcoin.address.fromOutputScript(scriptPubKey, testnet)
// var address = bitcoin.address.fromOutputScript(scriptPubKey)

console.log("Input address:", address)
console.log("Input amount:", sats_to_btc(txInputAmount))
console.log("")
console.log("Output address:", outputAddress)
console.log("Output amount:", sats_to_btc(outputAmount))
console.log("Network fee:", sats_to_btc(networkFee))
console.log("")
console.log("Service fee output address:", serviceFeeOutputAddress)
console.log("Service fee amount:", sats_to_btc(serviceFeeAmount))




var txb = new bitcoin.TransactionBuilder(testnet)
// var txb = new bitcoin.TransactionBuilder()
txb.addInput(txInput, txInputAmount)
txb.addOutput(outputAddress, outputAmount)
txb.addOutput(serviceFeeOutputAddress, serviceFeeAmount)
txb.sign(0, keyPair, redeemScript, null, 0)

var tx = txb.build().toHex()
console.log("\n\nRaw TX:")
console.log(tx)



function btc_to_sats(btc) {
    return btc*100000000
}
function sats_to_btc(sats) {
    return sats/100000000
}