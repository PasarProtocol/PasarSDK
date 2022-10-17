import Web3 from "web3";
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { getChainTypeById } from "./chaintype";

export class AppContext {
    private appDID: string;

    private env: any;

    private assistUrl: string;
    private ipfsUrl: string;
    private didResover: string;

    private web3: Web3;
    private essenitalConnector: EssentialsConnector;

    static appContext: AppContext;

    private constructor(testnet: boolean) {
        if (testnet)
            this.env = require("./contracts/deploy/testnet.json");
        else
            this.env = require("./contracts/deploy/mainnet.json");

        this.assistUrl  = this.env['assistUrl'];
        this.ipfsUrl    = this.env['ipfsUrl'];
        this.didResover = this.env['didResover'];
        this.appDID     = this.env['appDid'];
    }

    static createAppContext(testnet: boolean) {
        if(!this.appContext) {
            this.appContext = new AppContext(testnet);
        }
    }

    static getAppContext(): AppContext {
       return this.appContext;
    }

    public getAssistNode(): string {
        return this.assistUrl;
    }

    public getIPFSNode(): string {
        return this.ipfsUrl;
    }

    public getDidResolver(): string {
        return this.didResover
    }

    public isInAppBrowser(): boolean {
        return window['elastos'] !== undefined && window['elastos'].name === 'essentialsiab';
    }

    public getWeb3(): Web3 {
        if(!this.web3) {
            let essentialsConnector = new EssentialsConnector();
            this.web3 = new Web3(this.isInAppBrowser() ? window['elastos'].getWeb3Provider() : essentialsConnector.getWalletConnectProvider())
        }
        return this.web3;
    }

    public getRegistryContract(): string {
        let chainName = getChainTypeById(
            this.essenitalConnector.getWalletConnectProvider().wc.chainId
        ).toString().toLowerCase();
        return this.env["contracts"][chainName]["registry"];
    }

    public getMarketContract(): string {
        let chainName = getChainTypeById(
            this.essenitalConnector.getWalletConnectProvider().wc.chainId
        ).toString().toLowerCase();
        return this.env["contracts"][chainName]["marketv2"];
    }
}
