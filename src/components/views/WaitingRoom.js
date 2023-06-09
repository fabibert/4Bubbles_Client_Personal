import 'styles/views/WaitingRoom.scss';
import React, {useEffect, useMemo, useState} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Bubble } from 'components/ui/Bubble';
import {format} from "react-string-format";
import io from "socket.io-client";
import {getDomainSocket} from "../../helpers/getDomainSocket";
import {Button} from "../ui/Button";
import {api, headers, handleError} from 'helpers/api';




// establish a websocket connection (joins namespace for only the sender client)
const url = format(getDomainSocket() );
const socket = io.connect(url,{transports: ['websocket'], upgrade: false});

const WaitingRoom = (props) => {
    const history = useHistory();
    const data = useLocation();
    const [members, setMembers] = useState(data.state.members)
    console.log("data:", data);


    // join websocket connection again, since there was a disconnect when the push to /waitingroom happened
    const roomCode = data.state.roomCode
    
    // const url = format(getDomainSocket() + "?roomCode={0}", roomCode);
    // const socket = useMemo(() => io.connect(url, { transports: ['websocket'], upgrade: false, roomCode: roomCode }), []);



    const startGame = async () => {
        console.log("socket acknowledged as connected pressing start:", socket.connected);
        //const response2 = await api.get('/questions/?roomCode={roomCode}', headers())
        //console.log("Response for api call /questions: ",response2.data)
        // add a condition that only the leader can click this
        // socket.emit('start_game',{
        //     message : "",
        //     roomCode: roomCode,
        //     type: "CLIENT"})
        
        // socket.emit('get_Question',{
        //     message : "",
        //     roomCode: roomCode,
        //     type: "CLIENT"})
        history.push(`/question`);
    }


    useEffect(async () =>{
        console.log("socket acknowledged as connected:", socket.connected);
        // const response2 = await api.get('/questions/?roomCode={roomCode}', headers())
        // console.log("Response for api call /questions: ",response2.data)
        //infos oming from backend
        //returns a list of members since that is the only thing in the state that changes
        socket.on("joined_players", (incomingData) => {
            console.log("new_player_joined")
            console.log("new member player list: ", incomingData);
            setMembers(incomingData);
            data.state.members = incomingData;
        })

        // socket.on("game_started", (incomingData) =>{
        //     console.log("game_started received");
        //     history.push(`/question`);
        // })

        socket.on("get_question", (incomingData) =>{
            console.log("question arrived", incomingData);
            history.push(`/question`);
        })

    })

    return (
        <div className="waiting-room-wrapper">

            <div className="player-info">
                already joined:
                <div className="player-list">
                    {members.map((member) => {
                        return (
                            <div key={member.username} className="player">{member.username}</div>
                        )})}
                </div>
            </div>

            <div className="bubble-item">
                <div className = "bubble-container">
                    <Bubble onClick={startGame} className="bubble-button--waitingroom">Wait for players: Press to start!</Bubble>
                </div>
            </div>

            <div className="room-code">
                room code:
                <br/>
                {data.state.roomCode}
            </div>

            <div className="game-info">
                number of questions: {data.state.numOfQuestions}
                <br/>
                question topic: {data.state.questionTopic}
                <br/>
                game mode: {data.state.gameMode}
            </div>

            <div className="exit-button">
                <a href = "/welcomepage"> exit </a>
            </div>
        </div>
    );
};

export default WaitingRoom;
