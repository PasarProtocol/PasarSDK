
export interface ERC721 {

    totalSupply(): Promise<number>;

    tokenURI(tokenId: string): Promise<string>;

    transfer(to: string, tokenId: string): Promise<boolean>;

    transferFrom(from: string, to: string, tokenId: string): Promise<boolean>;


}