import { ChainType } from "./chaintype";

export class Token {
  public static ELA   = new Token('ELA',    ChainType.ESC,  '0x0000000000000000000000000000000000000000');
  public static DIA   = new Token('DIA',    ChainType.ESC,  '0x2C8010Ae4121212F836032973919E8AeC9AEaEE5');
  public static WELA  = new Token('WELA',   ChainType.ESC,  '0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4');
  public static GLIDE = new Token('GLIDE',  ChainType.ESC,  '0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27');
  public static ELK   = new Token('ELK',    ChainType.ESC,  '0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C');
  public static BUNNY = new Token('BUNNY',  ChainType.ESC,  '0x75740FC7058DA148752ef8a9AdFb73966DEb42a8');
  public static ethUSDC = new Token('ethUSDC',  ChainType.ESC, '0xA06be0F5950781cE28D965E5EFc6996e88a8C141');
  public static bnbBUSD = new Token('bnbBUSD',  ChainType.ESC, '0x9f1d0Ed4E041C503BD487E5dc9FC935Ab57F9a57');
  public static ETH   = new Token('ETH',    ChainType.ETH,  '0x0000000000000000000000000000000000000000');
  public static ethELA  = new Token('ELAOnETH', ChainType.ETH, '0xe6fd75ff38Adca4B97FBCD938c86b98772431867');

  private name: string;
  private address: string;
  private network: string;

  constructor(name: string, network: string, address: string) {
    this.name = name;
    this.network = network;
    this.address = address;
  }

  public getName(): string {
    return this.name;
  }

  public getContractAddress(): string {
    return this.address;
  }

  public getNetwork(): string {
    return this.network;
  }
}
