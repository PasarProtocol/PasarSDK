import { DID as ConnDID} from "@elastosfoundation/elastos-connectivity-sdk-js";
import { EssentialsConnector } from "@elastosfoundation/essentials-connector-client-browser";
import { ChainType } from "./chaintype";
import { valuesOnMainNet, valuesOnTestNet } from "./constant";
import { isTestnetNetwork } from "./networkType";

/**
 * get new width and height of resizing image.
 *
 * @param imgWidth the width of currnet image
 * @param imgHeight the height of currnet image
 * @param maxWidth the max width of resizing image
 * @param maxHeight the max height of resizing image
 */
const zoomImgSize = (imgWidth, imgHeight, maxWidth, maxHeight) => {
    let newWidth = imgWidth;
    let newHeight = imgHeight;
    if (imgWidth / imgHeight >= maxWidth / maxHeight) {
        if (imgWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = (imgHeight * maxWidth) / imgWidth;
        }
    } else if (imgHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = (imgWidth * maxHeight) / imgHeight;
    }
    if (newWidth > maxWidth || newHeight > maxHeight) {
        return zoomImgSize(newWidth, newHeight, maxWidth, maxHeight);
    }
    return [newWidth, newHeight];
}

/**
 * resize the image.
 *
 * @param file the image file for resize
 * @param maxWidth the max width of resizing image
 * @param maxHeight the max height of resizing image
 * @param qualtiy the quality of resizing image; default=1
 */
const resizeImage = (file, maxWidth, maxHeight, quality = 1) => {
    return new Promise((resolve, reject) => {
        if(!file.name) {
          resolve({success: 1})
          return
        }
        const imageType = file.name.split(".").reverse()[0].toLowerCase()
        const allow = ['jpg', 'gif', 'bmp', 'png', 'jpeg', 'svg'];
        try {
            if (!imageType || !allow.includes(imageType) || !file.size || !file.type) {
              resolve({success: 1})
              return
            }
            if(file.size < 10*1000*1000 && imageType === "gif") {
              resolve({success: 2})
              return
            }
              
            const fileName = file.name;
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = event => {
                const img = new Image();
                img.src = event.target.result as string;
                img.onload = () => {
                    if(img.src.length < maxWidth * maxHeight) {
                      resolve({success: 2})
                      return
                    }
  
                    const imgWidth = img.width;
                    const imgHeight = img.height;
  
                    if (imgWidth <= 0 || imgHeight <= 0) {
                      resolve({success: 2})
                      return
                    }
  
                    const canvasSize = zoomImgSize(imgWidth, imgHeight, maxWidth, maxHeight);
                    
                    const canvas = document.createElement('canvas');
                    [canvas.width, canvas.height] = canvasSize;
  
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    ctx.canvas.toBlob((blob) => {
                        const file = new File([blob], fileName, {
                            type: `image/${imageType}`,
                            lastModified: Date.now()
                        });
  
                        const reader = new window.FileReader();
                        reader.readAsArrayBuffer(file);
                        reader.onloadend = () => {
                            try {
                                const fileContent = Buffer.from(reader.result as ArrayBuffer)
                                resolve({success: 0, fileContent})
                            } catch (error) {
                                reject(error);
                            }
                        }
                    }, file.type, quality);
                }
            }
            reader.onerror = error => reject(error);
        } catch (error) {
            console.log("Error while image resize: ", error);
            reject(error)
        }
    })
}

const requestSigndataOnTokenID = async (tokenId:string) =>  {
    const didAccess = new ConnDID.DIDAccess();
    const signedData = await didAccess.signData(tokenId, { extraField: 0 }, "signature");
    return signedData
}

const checkFeedsCollection = (address) => {
    let chainId = getCurrentChainId();

    if(getCurrentChainType(chainId) == ChainType.ESC && (address == valuesOnMainNet.elastos.stickerContract || address == valuesOnTestNet.elastos.stickerContract)) {
        return true;
    } else {
        return false;
    }
}

const checkPasarCollection = (address) => {
    let chainId = getCurrentChainId();

    if(getCurrentChainType(chainId) == ChainType.ESC) {
        if(address == valuesOnMainNet.elastos.stickerV2Contract || address == valuesOnTestNet.elastos.stickerV2Contract) {
            return true;
        } else {
            return false;
        }
    } else if(getCurrentChainType(chainId) == ChainType.ETH) {
        if(address == valuesOnMainNet.ethereum.stickerV2Contract || address == valuesOnTestNet.ethereum.stickerV2Contract) {
            return true;
        } else {
            return false;
        }
    } else if(getCurrentChainType(chainId) == ChainType.FSN) {
        if(address == valuesOnMainNet.fusion.stickerV2Contract || address == valuesOnTestNet.fusion.stickerV2Contract) {
            return true;
        } else {
            return false;
        }
    }
    
}

const getCurrentChainType = (chainId) => {
    if (chainId===20 || chainId===21)
    return ChainType.ESC;
    if (chainId===1 || chainId===3)
        return ChainType.ETH;
    if (chainId===32659 || chainId===46688)
        return ChainType.FSN;
    return ''
}

const getCurrentMarketAddress = () => {
    let chainId = getCurrentChainId();

    if(getCurrentChainType(chainId) == ChainType.ESC) {
        if(isTestnetNetwork()) {
            return valuesOnTestNet.elastos.pasarMarketPlaceContract;
        } else {
            return valuesOnMainNet.elastos.pasarMarketPlaceContract;
        }
    } else if(getCurrentChainType(chainId) == ChainType.ETH) {
        if(isTestnetNetwork()) {
            return valuesOnTestNet.ethereum.pasarMarketPlaceContract;
        } else {
            return valuesOnMainNet.ethereum.pasarMarketPlaceContract;
        }
    } else if(getCurrentChainType(chainId) == ChainType.FSN) {
        if(isTestnetNetwork()) {
            return valuesOnTestNet.fusion.pasarMarketPlaceContract;
        } else {
            return valuesOnMainNet.fusion.pasarMarketPlaceContract;
        }
    }   
}

const getCurrentImportingContractAddress = () => {
    let chainId = getCurrentChainId();
    if(getCurrentChainType(chainId) == ChainType.ESC) {
        if(isTestnetNetwork()) {
            return valuesOnTestNet.elastos.pasarRegisterContract;
        } else {
            return valuesOnMainNet.elastos.pasarRegisterContract;
        }
    } else if(getCurrentChainType(chainId) == ChainType.ETH) {
        if(isTestnetNetwork()) {
            return valuesOnTestNet.ethereum.pasarRegisterContract;
        } else {
            return valuesOnMainNet.ethereum.pasarRegisterContract;
        }
    } else if(getCurrentChainType(chainId) == ChainType.FSN) {
        if(isTestnetNetwork()) {
            return valuesOnTestNet.fusion.pasarRegisterContract;
        } else {
            return valuesOnMainNet.fusion.pasarRegisterContract;
        }
    }   
}

const getCurrentChainId = () => {
    let essentialsConnector: EssentialsConnector = new EssentialsConnector();
    let chainId: number = essentialsConnector.getWalletConnectProvider().wc.chainId;
}

const isInAppBrowser = () => window['elastos'] !== undefined && window['elastos'].name === 'essentialsiab';
const getFilteredGasPrice = (_gasPrice) => _gasPrice*1 > 20*1e9 ? (20*1e9).toString() : _gasPrice;

const StringIsNumber = value => isNaN(Number(value)) === true;

const getChainTypeNumber = (chaintype:ChainType) => {
    if(chaintype == ChainType.ESC) {
        return 1;
    } else if(chaintype == ChainType.ETH) {
        return 2;
    } else if(chaintype ==  ChainType.FSN) {
        return 3;
    }
}

const getChainTypeString = (chaintype: number) => {
    if(chaintype == 1) {    
        return ChainType.ESC;
    } else if(chaintype == 2) {
        return ChainType.ETH;
    } else if(chaintype == 3) {
        return ChainType.FSN;
    }
    
}

export {
    resizeImage,
    isInAppBrowser,
    getFilteredGasPrice,
    requestSigndataOnTokenID,
    StringIsNumber,
    checkPasarCollection,
    checkFeedsCollection,
    getChainTypeNumber,
    getChainTypeString,
    getCurrentChainType,
    getCurrentMarketAddress,
    getCurrentImportingContractAddress,
}