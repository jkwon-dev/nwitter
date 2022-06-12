import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from '../fbase';

const Profile = ({ userObj, refreshUser }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName); 
    const onLogOutClick = () => {
        authService.signOut()
        history.push("/");
    }; 
    const onChange = (event) => {
        const { target: {value} } = event; 
        setNewDisplayName(value); 
    }; 
    const onSubmit = async (event) => {
        event.preventDefault(); 
        if (userObj.displayName !== newDisplayName) {
             await userObj.updateProfile({
                displayName : newDisplayName,
            });
            refreshUser();
        }
    }

    return (
        <>
       <form onSubmit={onSubmit}>
        <input onChange={onChange} type="text" placeholder="Diaplya Name" vlaue={newDisplayName} />
        <input type="submit" value="Update Profile" />
       </form>
        <button onClick={onLogOutClick}>Log Out</button>
        </>
    )
};

export default Profile; 