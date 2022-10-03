import { useState, useEffect } from "react";
import { createCollection, getCollectionType, getCollectionCategories, getAccountInfo } from "@pasarprotocol/pasar-sdk-development";

const CreateCollection = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [symbol, setSymbol] = useState('');
    const [avatar, setAvatar] = useState();
    const [background, setBackground] = useState();
    const [collectionType, setCollectionType] = useState(getCollectionType()[0]);
    const [category, setCategory] = useState(getCollectionCategories()[0]);
    const [progress, setProgress] = useState(0);
    useEffect(() => {

    }, [])
    useEffect(() => {
        console.log(progress);
    }, [progress]);

    const handleMint = async () => {
        let royalty = [{address: getAccountInfo().address, rate: 10}];

        console.log(name);
        console.log(description);
        console.log(collectionType);
        console.log(category);
        console.log(royalty);
        try {
            let result = await createCollection(name, description, symbol, avatar, background, collectionType, category, null, royalty, setProgress);
            console.log(result);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h3>Collection Type</h3>
                <select onChange={(e) => setCollectionType(e.target.value)}>
                    {getCollectionType().map((cell) => {
                        return <option key={cell} value={cell}>{cell}</option>
                    })}
                </select>
            </div>
            
            <div>
                <h3 className="sub_title">Avatar</h3>
                <input type="file" onChange={e => setAvatar(e.target.files[0])}/>
            </div>
            <div>
                <h3 className="sub_title">Background</h3>
                <input type="file" onChange={e => setBackground(e.target.files[0])}/>
            </div>
            <div>
                <h3 className="sub_title">Name</h3>
                <input value={name} onChange={(e) => setName(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Description</h3>
                <input value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>
            <div>
                <h3 className="sub_title">Symbol</h3>
                <input value={symbol} onChange={(e) => setSymbol(e.target.value)}/>
            </div>
            <div>
                <h3>Category</h3>
                <select onChange={(e) => setCategory(e.target.value)}>
                    {getCollectionCategories().map((cell) => {
                        return <option key={cell} value={cell}>{cell}</option>
                    })}
                </select>
            </div>
            <div>
            <button onClick={handleMint}>Create Collection</button>                
            </div>
        </div>
    );
}

export default CreateCollection;
