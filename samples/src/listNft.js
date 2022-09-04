import { useState, useEffect } from "react";
import { getCoinType, listItem, getListType, isAuction } from "@pasarprotocol/pasar-sdk-development";

const ListNFT = () => {
    const [tokenId, setTokenId] = useState("");
    const [price, setPrice] = useState("");
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
        console.log(pricingToken);
        let result = await listItem("0x32496388d7c0CDdbF4e12BDc84D39B9E42ee4CB0", tokenId, pricingToken, price, setProgress);
        console.log(result);
        
    }

    return (
        <div>
            <select onChange={(e) => setCurrentListType(e.target.value)}>
                {listType.map((cell) => {
                    return <option key={cell} value={cell}>{cell}</option>
                })}
            </select>

            <div>
                <h3 className="sub_title">tokenId</h3>
                <input value={tokenId} onChange={(e) => setTokenId(e.target.value)}/>
            </div>
            <div>
                <h3 className="Price">price</h3>
                <input value={price} onChange={(e) => setPrice(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">priceingType</h3>
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
