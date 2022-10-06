import { useState, useEffect } from "react";
import { getCoinType, listItem, listItemonAuction, getListType, isAuction } from "@pasarprotocol/pasar-sdk-development";

const ListNFT = () => {
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
    const [reservePrice, setReservePrice] = useState("");
    const [buyoutPrice, setBuyoutPrice] = useState("");
    const [exipirationTime, setExipirationTime] = useState("")
    const [listPricingToken, setListPricingToken] = useState([]);
    const [pricingToken, setPricingToken] = useState('');
    const [progress, setProgress] = useState(0);
    const [listType, setListType] = useState([]);
    const [currentListType, setCurrentListType] = useState("");
    const [addressCollection, setAddressCollection] = useState("");

    useEffect(() => {
        let listTokens = getCoinType();
        setListPricingToken(listTokens);
        setPricingToken(listTokens[0].address);

        let listType = getListType();
        setListType(listType);
        setCurrentListType(listType[0]);

        setExipirationTime(timestampToDatetimeInputString(Date.now()));
    }, []);

    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleList = async () => {
        try {
            if(isAuction(currentListType)) {
                console.log(exipirationTime);
                let dateTimeParts = exipirationTime.split('T');
                let dateParts = dateTimeParts[0].split("-");
                let timeParts = dateTimeParts[1].split(":");
                let expire = new Date(dateParts[0], dateParts[1], dateParts[2], timeParts[0], timeParts[1], timeParts[2]).getTime();
                await listItemonAuction(addressCollection, tokenId, pricingToken, price, reservePrice, buyoutPrice, expire, setProgress);
            } else {
                await listItem(addressCollection, tokenId, pricingToken, price, setProgress);
            }
        } catch(err) {
            console.log(err);
        }
    }

    function timestampToDatetimeInputString(timestamp) {
        const date = new Date((timestamp + _getTimeZoneOffsetInMs()));
        return date.toISOString().slice(0, 19);
      }
    function _getTimeZoneOffsetInMs() {
        return new Date().getTimezoneOffset() * -60 * 1000;
    }

    return (
        <div>
            <select onChange={(e) => setCurrentListType(e.target.value)}>
                {listType.map((cell) => {
                    return <option key={cell} value={cell}>{cell}</option>
                })}
            </select>

            <div>
                <h3 className="sub_title">Collection Address</h3>
                <input value={addressCollection} onChange={(e) => setAddressCollection(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
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
                    <div>
                        <h3 className="Price">Exipiration Time</h3>
                        <input type="datetime-local" value={exipirationTime} onChange={(e) => setExipirationTime(e.target.value)}/>
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

export default ListNFT;
