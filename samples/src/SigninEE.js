
import React, {useEffect, useState} from 'react'
import { signin, signout, checkSign, getListedItem, getOwnedCollection, getOwnedListedItem, getOwnedItem, getCreatedItem, getBiddingItem } from '@pasarprotocol/pasar-sdk-development';
import {
  useNavigate
} from "react-router-dom";

function SigninEE() {
  const navigate = useNavigate();
  const [login, setLogin] = useState(checkSign());

  const handleGetListedItem = async () => {
    let result = await getListedItem();
    console.log(result);
  }

  const handleGetOwnedCollection = async () => {
    let result = await getOwnedCollection("0xD47e14d54C6B3C5993b7074e6Ec50aBee7C7Fc10");
    console.log(result);
  }

  const handleGetOwnedListedNft = async () => {
    let result = await getOwnedListedItem("0xD47e14d54C6B3C5993b7074e6Ec50aBee7C7Fc10");
    console.log(result);
  }

  const handleGetOwnedNft = async () => {
    let result = await getOwnedItem("0xD47e14d54C6B3C5993b7074e6Ec50aBee7C7Fc10");
    console.log(result);
  }

  const handleGetCreatedNft = async () => {
    let result = await getCreatedItem("0xD47e14d54C6B3C5993b7074e6Ec50aBee7C7Fc10");
    console.log(result);
  }

  const handleGetBiddingNft = async () => {
    let result = await getBiddingItem("0x31334831f575b3c847bBEb92f8692cf26fbfADdA");
    console.log(result);
  }

  const handleSigninEE1 = async () => {
    let result = await signin();
    setLogin(checkSign());
  }

  const handleSignout = async () => {
    await signout();
    setLogin(checkSign());
  }

  const handleClickButton = (path) => {
    navigate(path);
  }

  return (
    !login ?
    <div>
        <button onClick={handleSigninEE1}>Sign in with EE</button>
        {/* <button onClick={handleSigninMM}>Sign in with MM</button> */}
        <button onClick={handleGetListedItem}>Get Listed Nfts</button>
        <button onClick={handleGetOwnedCollection}>Get Owned Collection</button>
        <button onClick={handleGetOwnedListedNft}>Get Owned Listed Nft</button>
        <button onClick={handleGetOwnedNft}>Get Owned Nft</button>
        <button onClick={handleGetCreatedNft}>Get Created Nft</button>
        <button onClick={handleGetBiddingNft}>Get Bidding Nft</button>
    </div> :
    <div>
        <button onClick={handleSignout}>Sign out</button>

        <div>
          <button onClick={()=> handleClickButton('/mint')}>Add New NFT</button>
          <button onClick={()=> handleClickButton('/burn')}>Burn NFT</button>
          <button onClick={()=> handleClickButton('/transfer')}>Transfer NFT</button>
          <button onClick={()=> handleClickButton('/list')}>List NFT</button>
          <button onClick={()=> handleClickButton('/changeprice')}>Change Price</button>
          <button onClick={()=> handleClickButton('/buy')}>Buy NFT</button>
          <button onClick={()=> handleClickButton('/bid')}>Bid NFT</button>
          <button onClick={()=> handleClickButton('/settle')}>Settle Auction</button>
          <button onClick={()=> handleClickButton('/unlist')}>Unlist NFT</button>
          <button onClick={()=> handleClickButton('/createcollection')}>Create Collection</button>
          <button onClick={()=> handleClickButton('/updatecollectioninfo')}>Update Collection Info</button>
          
        </div>
        
    </div>

    
  );
}

export default SigninEE;
