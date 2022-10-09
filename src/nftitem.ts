import { ListTypes } from './listtype';
import { ChainType } from './chaintype';

export class NftItem {
    private tokenId: string;
    private tokenIdHex: string;
    private name: string;
    private description: string;
    private thumbnail: string;
    private image: string;
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
    private orderType: string;

    constructor(id: string, tokenIdHex: string,  name: string, description: string, thumbnail: string, image:string, sesitive: boolean, properties: any,
        tokenVersion: number, marketPlace: number, holder: string, royaltyOwner: string, createTime: number, marketTime: number, endTime: number,
        orderId: any = null, quoteToken: any = null, price: any = null, buyoutPrice: any = null, reservePrice: any = null, minPrice: any = null, orderState: any = null, orderType: any = null) {

        this.tokenId = id;
        this.tokenIdHex = tokenIdHex;
        this.name = name;
        this.description = description;
        this.thumbnail = thumbnail;
        this.image = image;
        this.sensitive = sesitive;
        this.properties = properties;
        this.tokenVersion = tokenVersion;
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

        if(orderType == null || orderType == "") {
            this.orderType = null;
        } else if(parseInt(orderType) == 1) {
            this.orderType = ListTypes.fixedPrice;
        } else if(parseInt(orderType) == 2) {
            this.orderType = ListTypes.onAuction;
        }

        switch(marketPlace) {
            case 1:
                this.marketPlace = ChainType.ESC;
                break;
            case 2:
                this.marketPlace = ChainType.ETH;
                break;
            case 3:
                this.marketPlace = ChainType.FSN;
                break;
            default:
                this.marketPlace = ChainType.ESC;
                break;
        }
    }

    public getTokenId(): string {
        return this.tokenId.toString();
    }

    public getCollectionAddress(): string {
        return this.baseToken.toString();
    }

    public getOrderId(): string {
        return this.orderId.toString();
    }

    public getQuoteToken(): string {
        return this.quoteToken.toString();
    }

    public getPrice(): string {
        return this.price.toString();
    }

    public getOrderType(): string {
        return this.orderType.toString();
    }

    public getOrderState(): string {
        return this.orderState.toString();
    }

    public getBuyoutPrice(): string {
        return this.buyoutPrice ? this.buyoutPrice.toString() : null;
    }
}