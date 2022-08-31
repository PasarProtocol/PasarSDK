export interface UserDidInfo {
    "did": string,
    "name": string,
    "description": string
}

export interface ImageDidInfo {
    "image": string,
    "kind": string,
    "size": number,
    "thumbnail": string,
}

export interface NFTDidInfo {
    "version": number,
    "type": string,
    "name": string,
    "description": string,
    "creator": UserDidInfo,
    "data": ImageDidInfo,
    "adult": boolean,
    "properties": any,
}

export interface ResultOnIpfs {
    "success": boolean,
    "result": string,
    "tokenId": string,
    "medadata"
}