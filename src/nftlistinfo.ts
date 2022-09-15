import { NftItem } from "./nftitem";


export class NftListInfo {
    private totalCount: number;
    private listNFT: NftItem[];

    constructor(total_count: number, list_nft: NftItem[]) {
        this.totalCount = total_count;
        this.listNFT = list_nft;
    }

    public getListNfts() {
        return {
            total: this.totalCount,
            nfts: this.listNFT
        }
    }

}