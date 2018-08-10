import React, { Component, Fragment } from "react";
import MessageList from "./MessageList.jsx";
import Chatbar from "./Chatbar.jsx";

const uuidv = require("uuid/v4");

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: { name: "anonymous" },
      userColor: '',
      numberOfUsersOnline: 0,
      messages: []
    };
    this.newMessage = this.newMessage.bind(this);
    this.onMessage = this.onMessage.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  componentDidMount() {
    this.socket = new WebSocket("ws://localhost:3001");

    this.socket.onopen = event => {
      console.log("Connected to server");
      console.log(this.socket.userColor);
      this.setState({userColor: this.socket.userColor});
    };

    this.socket.onmessage = this.onMessage;
  }

  // upon recieving a new message, it will update the messages array
  onMessage(event) {
    console.log(event);
    const _message = JSON.parse(event.data);
    // this.setState({ messages: [...this.state.messages, _message] });

    // The socket event data is encoded as a JSON string.
    // This line turns it into an object
    const message = JSON.parse(event.data);
    console.log(message.type);
    switch (message.type) {
      case "incomingMessage":
        // handle incoming message
        this.setState({ messages: [...this.state.messages, message] });
        break;
      case "incomingNotification":
        // handle incoming notification
        this.setState({ messages: [...this.state.messages, message] });
        break;
      case "numberOfUsers":
        // handle incoming notification
        console.log('Number of users is being updated...');
        this.setState({ numberOfUsersOnline: message.numberOfUsers });
        break;
      default:
        // show an error in the console if the message type is unknown
        throw new Error("Unknown event type " + message.type);
    }
  }

  // sends new message to server
  newMessage(messageContent) {
    const message = {
      id: uuidv(),
      username: this.state.currentUser.name,
      content: messageContent,
      color: '',
      type: "postMessage"
    };

    this.socket.send(JSON.stringify(message));
  }

  // sends a message when a user changes their name
  changeUser(newUser) {
    let oldUser = this.state.currentUser.name;

    const notification = {
      id: uuidv(),
      newUser: newUser,
      oldUser: oldUser,
      content: `${oldUser} changed their name to ${newUser}!`,
      type: "postNotification"
    };

    this.socket.send(JSON.stringify(notification));
    this.setState({ currentUser: { name: newUser } });
  }

  render() {
    return (
      <Fragment>
        <nav className="navbar">
          <a href="/" className="navbar-brand">
            Chatty
          </a>
          <span className="counter">
            {this.state.numberOfUsersOnline} Users online
          </span>
        </nav>
        <MessageList messages={this.state.messages} />
        <Chatbar
          currentUser={this.state.currentUser.name}
          newMessage={this.newMessage}
          changeUser={this.changeUser}
        />
      </Fragment>
    );
  }
}
export default App;
