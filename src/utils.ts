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