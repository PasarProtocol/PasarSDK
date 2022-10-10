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

export interface ResultOnIpfs {
    "success": boolean,
    "result": string,
    "medadata": string
}

export interface TransactionParams {
    'from': string,
    'gasPrice': string,
    'gas': number,
    'value': number
}

export interface NormalCollectionInfo {
    "name": string,
    "symbol": string,
    "owner": string
}

export interface CollectionSocialField {
    "website": string,
    "profile": string,
    "feeds": string,
    "twitter": string,
    "discord": string,
    "telegram": string,
    "medium": string
}

export interface UserInfo {
    name:string,
    bio:string,
    did:string,
    address:string,
}