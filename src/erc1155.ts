
export interface ERC1155Contract {
    mint(tokenId: BigInteger, supply: BigInteger, tokenUri: string): Promise<boolean>;
}
