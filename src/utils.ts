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
    "version": string,
    "type": string,
    "name": string,
    "description": string,
    "creator": UserDidInfo,
    "data": ImageDidInfo,
    "adult": boolean,
    "properties": any,
}

export interface UserInfo {
    name:string,
    bio:string,
    did:string,
    address:string,
}