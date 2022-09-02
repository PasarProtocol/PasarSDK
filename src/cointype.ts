export class CoinType {
  private coinTypesOnELA = [
    {
      name: 'ELA',
      address: "0x0000000000000000000000000000000000000000"
    },
    {
      name: 'DIA',
      address: "0x2C8010Ae4121212F836032973919E8AeC9AEaEE5"
    },
    {
      name: 'WELA',
      address: "0x517E9e5d46C1EA8aB6f78677d6114Ef47F71f6c4"
    },
    {
      name: 'GLIDE',
      address: "0xd39eC832FF1CaaFAb2729c76dDeac967ABcA8F27"
    },
    {
      name: 'ELK',
      address: "0xE1C110E1B1b4A1deD0cAf3E42BfBdbB7b5d7cE1C"
    },
    {
      name: 'ethUSDC',
      address: "0xA06be0F5950781cE28D965E5EFc6996e88a8C141"
    },
    {
      name: 'BUNNY',
      address: "0x75740FC7058DA148752ef8a9AdFb73966DEb42a8"
    },
    {
      name: 'bnbBUSD',
      address: "0x9f1d0Ed4E041C503BD487E5dc9FC935Ab57F9a57"
    }
  ];

  private coinTypesOnEth = [
    {
      name: 'ETH',
      address: "0x0000000000000000000000000000000000000000"
    },
    {
      name: 'ELA on ETH',
      address: "0xe6fd75ff38Adca4B97FBCD938c86b98772431867"
    }
  ];
  
  public getCoinTypeList(chainType=1) {
    switch(chainType) {
      case 1:
        return this.coinTypesOnELA;
      case 2:
        return this.coinTypesOnEth;
      default:
        return this.coinTypesOnELA;
    }
  }
}