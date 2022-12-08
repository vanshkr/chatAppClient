import React, { useState, useEffect } from "react";
import queryString from "query-string";
import "./chat.css";
import io from "socket.io-client";
import { useLocation, useHistory } from "react-router-dom";
import InfoBar from "../infobar/infobar";
import Input from "../input/input";
import Messages from "../messages/messages";
// eslint-disable-next-line no-unused-vars
import TextContainer from "../textcontainer/textcontainer";

let socket;

const Chat = (props) => {
  let endpoint = "https://chatappserver-production.up.railway.app/";
  let location = useLocation();
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const [name, setName] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [users, setUsers] = useState("");
  console.log(history);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);
    socket = io(endpoint);

    setName(name);
    setRoom(room);

    socket.emit("join", { name, room }, () => {});
    return () => {
      socket.disconnect();

      socket.off();
    };
  }, [endpoint, location.search]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);
  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Input
          setMessage={setMessage}
          sendMessage={sendMessage}
          message={message}
        />
        <Messages messages={messages} name={name} />
        {/* <TextContainer /> */}
      </div>
    </div>
  );
};
export default Chat;
