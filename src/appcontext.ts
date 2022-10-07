import { CollectionAddress } from "./contractaddress";
import { ChainType } from "./chaintype";
import { isTestnetNetwork, NetworkType } from "./networkType";
import { valuesOnTestNet, valuesOnMainNet } from "./constant";
import Web3 from "web3";
import { CallContract } from "./callcontract";
import { CallAssistService } from "./callassistservice";

export class AppContext {
    private appDID: string;
    private appInstanceDID: string;

    private assistNode: string;
    private ipfsNode: string;
    private chainNode: string;

    private suppoertedCollections: CollectionAddress[] = null;
    private callContract: CallContract;
    private callAssistService: CallAssistService = new CallAssistService();
    /**
     * Set the collections that will be interacting with in this SDK.
     *
     * @param collections A list of collection contract address, including chain type.
     * @returns The current object.
     */
    public setSupportedCollections(collections: CollectionAddress[]): AppContext {
        this.suppoertedCollections = collections
        return this
    }

    /**
     * Get the supported collections being interacted with.
     * @returns The list of supported contract collections.
     */
    public getSupportedCollections(): CollectionAddress[] {
        return this.suppoertedCollections;
    }

    /**
     * Customize assist service endpoint.
     * @param assistEndpoint The target assist serivce endpoint
     * @returns The current object of this class.
     */
    public setAssistNode(assistNode: string): AppContext {
        this.assistNode = assistNode;
        return this;
    }

    /**
     * Get the customized assist service endpoint.
     * @returns The customized assist service endpoint.
     */
    public getAssistNode(): string {
        return this.assistNode;
    }

    /**
     * Customize ipfs service endpoint
     * @param ipfsEndpoint The target ipfs service endpoint.
     * @returns
     */
    public setIPFSNode(ipfsNode: string): AppContext {
        this.ipfsNode = ipfsNode;
        return this;
    }

    /**
     * Get the cutomized ipfs service endpoint.
     * @returns The customized ipfs service endpoint.
     */
    public getIPFSNode(): string {
        return this.ipfsNode;
    }

    public setChainNode(chainNode: string): AppContext {
        this.chainNode = chainNode
        return this
    }

    public getChainNode(): string {
        return this.chainNode
    }

    public getWeb3Provider(): Web3 {
        return null
    }

    public getCallContract(): CallContract {
        if(!this.callContract) {
            this.callContract = new CallContract();
        }

        return this.callContract;
    }

    public getCallAssistService(): CallAssistService {
        if(!this.callAssistService) {
            this.callAssistService = new CallAssistService();
        }
        
        return this.callAssistService;
    }
}
