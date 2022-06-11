import React, { useState } from 'react';
import { dbService } from '../fbase';

const Home = () => {
    const [nweet, setNweet] = useState(""); 
    const onSubmit = (event) => {
        event.preventDefault(); 
        dbService.collection("nweets").add({
            nweet,
            createdAt: Date.now(),
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
        </div>
    )
};

export default Home; 