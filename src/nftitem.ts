import { ListType } from './listtype';
import { ChainType } from './chaintype';

export class NftItem {
    private tokenId: string;
    private tokenIdHex: string;
    private name: string;
    private description: string;
    private thumbnail: string;
    private asset: string;
    private baseToken: string;
    private sensitive: boolean;
    private properties: any;
    private tokenVersion: number;
    private marketPlace: ChainType;
    private holder: string;
    private royaltyOwner: string;
    private createTime: number;
    private marketTime: number;
    private endTime: number;
    private orderId: any;
    private quoteToken: any;
    private price: any;
    private buyoutPrice: any;
    private reservePrice: any;
    private minPrice: any;
    private orderState: any;
    private orderType: any;

    constructor(id: string, tokenIdHex: string,  name: string, description: string, thumbnail: string, sesitive: boolean, properties: any,
        tokenVersion: number, marketPlace: ChainType, holder: string, royaltyOwner: string, createTime: number, marketTime: number, endTime: number,
        orderId: any = null, quoteToken: any = null, price: any = null, buyoutPrice: any = null, reservePrice: any = null, minPrice: any = null, orderState: any = null, orderType: any = null) {
        
        this.tokenId = id;
        this.tokenIdHex = tokenIdHex;
        this.name = name;
        this.description = description;
        this.thumbnail = thumbnail;
        this.sensitive = sesitive;
        this.properties = properties;
        this.tokenVersion = tokenVersion;
        this.marketPlace = marketPlace;
        this.holder = holder;
        this.royaltyOwner = royaltyOwner;
        this.createTime = createTime;
        this.marketTime = marketTime;
        this.endTime = endTime;
        this.orderId = orderId;
        this.quoteToken = quoteToken;
        this.price = price;
        this.buyoutPrice = buyoutPrice;
        this.reservePrice = reservePrice;
        this.minPrice = minPrice;
        this.orderState = orderState;
        this.orderType = orderType;
    }
}