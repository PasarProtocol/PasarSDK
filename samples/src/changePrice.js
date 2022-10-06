import { useState, useEffect } from "react";
import { getCoinType, changePrice, changePriceOnAuction, getListType, isAuction } from "@pasarprotocol/pasar-sdk-development";

const ChangePrice = () => {
    const [tokenId, setTokenId] = useState("");
    const [baseToken, setBaseToken] = useState("");
    const [price, setPrice] = useState("");
    const [reservePrice, setReservePrice] = useState("");
    const [buyoutPrice, setBuyoutPrice] = useState("");
    const [listPricingToken, setListPricingToken] = useState([]);
    const [pricingToken, setPricingToken] = useState('');
    const [progress, setProgress] = useState(0);
    const [listType, setListType] = useState([]);
    const [currentListType, setCurrentListType] = useState("");

    useEffect(() => {
        let listTokens = getCoinType();
        setListPricingToken(listTokens);
        setPricingToken(listTokens[0].address);

        let listType = getListType();
        setListType(listType);
        setCurrentListType(listType[0]);

    }, []);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleList = async () => {
        try {
            let orderId;
            if(isAuction(currentListType)) {
                orderId = await changePriceOnAuction(tokenId, baseToken, price, reservePrice, buyoutPrice, pricingToken, setProgress);
            } else {
                orderId = await changePrice(tokenId, baseToken, price, pricingToken, setProgress);
            }
            console.log(orderId);
        } catch(err) {
            console.log(err);  
        }
    }

    return (
        <div>
            <select onChange={(e) => setCurrentListType(e.target.value)}>
                {listType.map((cell) => {
                    return <option key={cell} value={cell}>{cell}</option>
                })}
            </select>

            <div>
                <h3 className="sub_title">TokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Collection Address</h3>
                <input value={baseToken} onChange={(e) => setBaseToken(e.target.value)}/>
            </div>
            {!isAuction(currentListType) ? <div>
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
            }
            <div>
                <h3 className="sub_title">Pricing Type</h3>
                <select onChange={(e) => setPricingToken(e.target.value)}>
                    {listPricingToken.map((cell) => {
                        return <option key={cell.address} value={cell.address}>{cell.name}</option>
                    })}
                </select>
            </div>
            <button className="button" onClick={handleList}>List</button>
        </div>
    );
}

export default ChangePrice;
