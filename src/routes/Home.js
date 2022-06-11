import React, { useEffect, useState } from 'react';
import Nweet from '../components/Nweet';
import { dbService } from '../fbase';

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState(""); 
    const [nweets, setNweets] = useState([]); 
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

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="what's on your mind?" maxLength={120} />
                <input type="submit" value="Send" />
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