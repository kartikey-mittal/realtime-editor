import React, {useState} from 'react';
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';

function Home() {

    const navigate = useNavigate();

    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidV4();
        setRoomId(id);
        alert(id);
      
        toast.success("Created a new room");
        console.log(id);
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error("Room ID & username is required!");
            return;
        }

        // redirect
        navigate(`/editor/${roomId}`, {
            state: {
                username
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === "Enter") {
            joinRoom();
        }
    };

    return (
        <div className="homePageWrapper">

            <div className="formWrapper">
                {/* <img className="homePageLogo" src="/logo.png" alt="code-sync-logo" /> */}
                <h4 className="mainLabel">Paste invitation ROOM ID</h4>

                <div className="inputGroup">
                    <input
                        type="text"
                        className="inputBox"
                        placeholder="RoomID"
                        onChange={(e) => {setRoomId(e.target.value)}}
                        value={roomId}
                        onKeyUp={handleInputEnter}
                    />

                    <input
                        type="text"
                        className="inputBox"
                        placeholder="Name"
                        onChange={(e) => {setUsername(e.target.value)}}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />

                    <button className="btn joinBtn" onClick={joinRoom}>JOIN</button>

                    <span className="createInfo">&nbsp;
                        <a
                            onClick={createNewRoom}
                            href="/"
                            className="createNewBtn">Create new room
                        </a>
                    </span>
                </div>
            </div>


          

        </div>
    )
}

export default Home;