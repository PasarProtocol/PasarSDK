import Web3 from "web3";
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { getChainTypeById } from "./chaintype";
import WalletConnectProvider  from "@walletconnect/web3-provider";

export class AppContext {
    private appDID: string;

    private env: any;
    private assistUrl: string;
    private ipfsUrl: string;
    private didResover: string;

    private web3: Web3;
    private walletConnector: WalletConnectProvider;

    static appContext: AppContext;

    private constructor(env: any) {
        this.env = env;
        this.assistUrl  = this.env['assistUrl'];
        this.ipfsUrl    = this.env['ipfsUrl'];
        this.didResover = this.env['didResover'];
        this.appDID     = this.env['appDid'];
        this.walletConnector = new EssentialsConnector().getWalletConnectProvider();
        this.web3 =  new Web3(this.isInAppBrowser() ? window['elastos'].getWeb3Provider(): this.walletConnector);
    }

    static createAppContext(testnet: boolean) {
        if(!this.appContext) {
            this.appContext = new AppContext(
                testnet ? require("./contracts/deploy/testnet.json"): require("./contracts/deploy/mainnet.json")
            );
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
        return this.web3;
    }

    public getRegistryContract(): string {
        let chainName = getChainTypeById(this.walletConnector.wc.chainId).toLowerCase();
        return this.env["contracts"][chainName]["registry"];
    }

    public getMarketContract(): string {
        let chainName = getChainTypeById(this.walletConnector.wc.chainId).toLowerCase();
        return this.env["contracts"][chainName]["marketv2"];
    }
}
