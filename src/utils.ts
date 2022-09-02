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
    "medadata": string
}

export interface TransactionParams {
    'from': string,
    'gasPrice': string,
    'gas': number,
    'value': number
}

export interface ResultCallContract {
    "success": boolean;
    "data": any
}

export interface ResultApi {
    "success": boolean,
    "data": any
}