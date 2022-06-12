import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Nweet from '../components/Nweet';
import { dbService, sotrageService } from '../fbase';

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState(""); 
    const [nweets, setNweets] = useState([]); 
    const [attachment, setAttachment] = useState();

    useEffect(()=> {
       dbService.collection("nweets").onSnapshot((snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(), 
        })); 
        setNweets(nweetArray);
       })
    }, []);
    const onSubmit = async (event) => {
        event.preventDefault(); 
        const fileRef = sotrageService.ref().child(`${userObj.uid}/${uuidv4()}`); 
        const response = await fileRef.putString(attachment, "data_url"); 
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid
        });
        setNweet("");
    };
    const onChange = (event) => {
        const {target : { value }} = event;
        setNweet(value); 
    };
    const onFileChange = (event) => {
        const {target: { files }} = event; 
        const theFile = files[0]; 
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const { currentTarget: { result }} = finishedEvent; 
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    const onClearAttachmentClick = () => setAttachment(null); 

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Send" />
                {attachment && (
                <div>
                    <img src={attachment}  width="50px" height="50" alt="myphoto" />
                    <button onClick={onClearAttachmentClick}>Clear</button>
                </div>
                )}
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid}/>
                ))}
            </div>
        </div>
    )
};

export default Home; 