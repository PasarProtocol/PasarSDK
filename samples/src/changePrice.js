import { useState, useEffect } from "react";
import { ListType, MyProfile, Token } from "@pasarprotocol/pasar-sdk-development";

const ChangePrice = () => {
    const [orderId, setOrderId] = useState("");
    const [price, setPrice] = useState("");
    const [reservePrice, setReservePrice] = useState("");
    const [buyoutPrice, setBuyoutPrice] = useState("");
    const [listPricingToken, setListPricingToken] = useState(Token.getToken());
    const [pricingToken, setPricingToken] = useState('');
    const [listType, setListType] = useState([]);
    const [currentListType, setCurrentListType] = useState(Object.keys(ListType)[0]);

    const handleList = async () => {
        try {
            let user = JSON.parse(localStorage.getItem("user"));
            const myProfile = new MyProfile(user['did'], user['address'], user['name'], user['bio'], null);
            // if(isAuction(currentListType)) {
            //     orderId = await changePriceOnAuction(tokenId, baseToken, price, reservePrice, buyoutPrice, pricingToken, setProgress);
            // } else {
                console.log(orderId);
                console.log(price);
                console.log(pricingToken);
                await myProfile.changePrice(orderId, pricingToken, price);
            // }
            console.log(orderId);
        } catch(err) {
            console.log(err);  
        }
    }

    return (
        <div>
            <select onChange={(e) => setCurrentListType(e.target.value)}>
                {Object.keys(ListType).map((key) => {
                    return <option key={ListType[key]} value={ListType[key]}>{ListType[key]}</option>
                })}
            </select>

            <div>
                <h3 className="sub_title">OrderId</h3>
                <input value={orderId} onChange={(e) => setOrderId(e.target.value)}/>
            </div>
            <div>
                <h3 className="Price">price</h3>
                <input value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
            {/* {!isAuction(currentListType) ? <div>
                <h3 className="Price">price</h3>
                    <input value={price} onChange={(e) => setPrice(e.target.value)}/>
                </div> : <div>
                <div>
                    <h3 className="Price">Min Price</h3>
                        <input value={price} onChange={(e) => setPrice(e.target.value)}/>
                    </div> 
                    <div>
                        <h3 className="Price">Reserve Price</h3>
                        <input value={reservePrice} onChange={(e) => setReservePrice(e.target.value)}/>
                    </div> 
                    <div>
                        <h3 className="Price">Buyout Price</h3>
                        <input value={buyoutPrice} onChange={(e) => setBuyoutPrice(e.target.value)}/>
                    </div>
                </div>
            } */}
            <div>
                <h3 className="sub_title">Pricing Type</h3>
                <select onChange={(e) => setPricingToken(e.target.value)}>
                    {Object.keys(listPricingToken).map((key) => {
                        return <option key={listPricingToken[key]} value={listPricingToken[key]}>{key}</option>
                    })}
                </select>
            </div>
            <button className="button" onClick={handleList}>List</button>
        </div>
    );
}

export default ChangePrice;
