import { CollectionAddress } from "./contractaddress";
import { ChainType } from "./chaintype";
import { NetworkType } from "./networkType";

export class AppContext {
    private network: NetworkType;
    private appDID: string;
    private appInstanceDID: string;

    private assistEndpoint: string;
    private ipfsEndpoint: string;

    private collections: Array<CollectionAddress>;

    /**
     * Get the network enviroment like Testnet or Mainnet.
     * @returns The network type.
     */
    public getNetworkType(): NetworkType {
        return this.network;
    }

    /**
     * Append a remote collection contract address to interact with.
     *
     * @param address The collection contract address
     * @param chain The chain network, like ESC or FUSION.
     * @returns The current object of this class.
     */
    public addCollection(address: string, chain: ChainType): AppContext {
        this.collections.push(new CollectionAddress(address, chain));
        return this;
    }

    /**
     * Get the list of collection contract addresses.
     * @returns A list of collection contract addresses.
     */
    public getCollections(): Array<CollectionAddress> {
        return this.collections;
    }

    /**
     * Customize assist service endpoint.
     * @param assistEndpoint The target assist serivce endpoint
     * @returns The current object of this class.
     */
    public setAssistEndpoint(assistEndpoint: string): AppContext {
        this.assistEndpoint = assistEndpoint;
        return this;
    }

    /**
     * Get the customized assist service endpoint.
     * @returns The customized assist service endpoint.
     */
    public getAssistEndpoint(): string {
        return this.assistEndpoint;
    }

    /**
     * Customize ipfs service endpoint
     * @param ipfsEndpoint The target ipfs service endpoint.
     * @returns
     */
    public setIpfsEndpoint(ipfsEndpoint: string): AppContext {
        this.ipfsEndpoint = ipfsEndpoint;
        return this;
    }

    /**
     * Get the cutomized ipfs service endpoint.
     * @returns The customized ipfs service endpoint.
     */
    public getIpfsEndpint(): string {
        return this.ipfsEndpoint;
    }
}
