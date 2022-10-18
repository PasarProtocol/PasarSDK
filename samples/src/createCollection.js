import { useState, useEffect } from "react";
import { MyProfile, Category, ERCType, SocialLinks } from "@pasarprotocol/pasar-sdk-development";

const CreateCollection = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [symbol, setSymbol] = useState('');
    const [avatar, setAvatar] = useState();
    const [background, setBackground] = useState();
    const [collectionType, setCollectionType] = useState(Object.keys(ERCType)[0]);
    const [category, setCategory] = useState(Object.keys(Category)[0]);

    // const myProfile = new MyProfile()
    const socialLinks = new SocialLinks();
    console.log(ERCType);
    const progress = {
        onProgress:(stage) => {console.log(stage)}
    }

    const [socialInfo, setSocialInfo] = useState(socialLinks.toJson())
    console.log(socialInfo);
    const handleMint = async () => {
        let user = JSON.parse(localStorage.getItem("user"));
        let royalty = [{address: user['address'], rate: 10}];

        console.log(name);
        console.log(description);
        console.log(collectionType);
        console.log(category);
        console.log(royalty);
        try {
            // let address = await createCollection(name, description, symbol, avatar, background, collectionType, category, null, royalty, progress);
            // console.log(address);
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div>
            <div>
                <h3>Collection Type</h3>
                <select onChange={(e) => setCollectionType(e.target.value)}>
                    {Object.keys(ERCType).map((key)=> {
                        return <option key={ERCType[key]} value={ERCType[key]}>{ERCType[key]}</option>
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
                    {Object.keys(Category).map((key) => {
                        return <option key={Category[key]} value={Category[key]}>{Category[key]}</option>
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
