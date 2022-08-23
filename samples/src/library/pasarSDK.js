'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ipfsHttpClient = require('ipfs-http-client');

var utils;
(function (utils) {
    utils.testNet = true;
})(utils || (utils = {}));

/**
 * This class initialize the values on sdk
 */
class Initialize {
    /**
     * initialize the values on sdk.
     *
     * @param testnet set the testNet. If true is testNet, else mainNet. default value is true
     */
    init(testnet = true) {
        utils.testNet = testnet;
    }
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var valuesOnTestNet;
(function (valuesOnTestNet) {
    valuesOnTestNet.assistURL = "https://assist-test.pasarprotocol.io";
    valuesOnTestNet.elastos = {
        pasarContract: '0x2652d10A5e525959F7120b56f2D7a9cD0f6ee087',
        stickerContract: '0xed1978c53731997f4DAfBA47C9b07957Ef6F3961',
        pasarV2Contract: '0x19088c509C390F996802B90bdc4bFe6dc3F5AAA7',
        stickerV2Contract: '0x32496388d7c0CDdbF4e12BDc84D39B9E42ee4CB0',
        pasarRegisterContract: '0x2b304ffC302b402785294629674A8C2b64cEF897',
        diaTokenContract: '0x85946E4b6AB7C5c5C60A7b31415A52C0647E3272',
        chainType: 1,
    };
    valuesOnTestNet.urlIPFS = "https://ipfs-test.pasarprotocol.io";
})(valuesOnTestNet || (valuesOnTestNet = {}));
var valuesOnMainNet;
(function (valuesOnMainNet) {
    valuesOnMainNet.assistURL = "https://assist.pasarprotocol.io";
    valuesOnMainNet.elastos = {
        pasarContract: '0x02E8AD0687D583e2F6A7e5b82144025f30e26aA0',
        stickerContract: '0x020c7303664bc88ae92cE3D380BF361E03B78B81',
        pasarV2Contract: '0xaeA699E4dA22986eB6fa2d714F5AC737Fe93a998',
        stickerV2Contract: '0xF63f820F4a0bC6E966D61A4b20d24916713Ebb95',
        pasarRegisterContract: '0x3d0AD66765C319c2A1c6330C1d815608543dcc19',
        diaTokenContract: '0x2C8010Ae4121212F836032973919E8AeC9AEaEE5',
        chainType: 1,
    };
    valuesOnMainNet.urlIPFS = "https://ipfs.pasarprotocol.io";
})(valuesOnMainNet || (valuesOnMainNet = {}));

/**
 * This class is to process the functions on pasar collection.
 */
class PasarCollection {
    mintNFT(image, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            let ipfsURL;
            if (utils.testNet) {
                ipfsURL = valuesOnTestNet.urlIPFS;
            }
            else {
                ipfsURL = valuesOnMainNet.urlIPFS;
            }
            console.log(ipfsURL);
            const client = ipfsHttpClient.create({ url: ipfsURL });
            let image_add = yield client.add(image);
            console.log(image_add);
            return "success";
        });
    }
}

/**
 * This class get the nfts from pasar assist backend
 */
class GetNfts {
    /**
     * get all nfts listed on Pasar marketplace.
     *
     * @param collection the address of collection, default is empty;
     * @param pageNum the page number, default 1;
     * @param pageSize the count of nft per page, default value = 10;
     */
    getNftsOnMarketPlace(collection = '', pageNum = 1, pageSize = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            let baseUrl;
            if (utils.testNet) {
                baseUrl = valuesOnTestNet.assistURL;
            }
            else {
                baseUrl = valuesOnMainNet.assistURL;
            }
            let result = yield fetch(`${baseUrl}/api/v2/sticker/getDetailedCollectibles?collectionType=${collection}&tokenType=&status=All&itemType=All&adult=false&minPrice=&maxPrice=&order=0&marketPlace=0&keyword=&pageNum=${pageNum}&pageSize=${pageSize}`);
            return result;
        });
    }
}

exports.GetNfts = GetNfts;
exports.Initialize = Initialize;
exports.PasarCollection = PasarCollection;
