import React, { Component } from "react";

class ChatBar extends Component {
  handleMessage = event => {
    if (event.key === "Enter") {
      console.log("ENTER 1");
      const messageContent = event.target.value;
      this.props.newMessage(messageContent);
      event.target.value = "";
    }
  };

  handleUser = event => {
    if (event.key === "Enter") {
      const messageUser = event.target.value;
      this.props.changeUser(messageUser);
    }
  };

  render() {
    return (
      <footer className="chatbar">
        <input
          className="chatbar-username"
          placeholder="Enter name"
          defaultValue={this.props.currentUser}
          onKeyPress={this.handleUser}
        />
        <input
          className="chatbar-message"
          placeholder="Type a message and hit ENTER"
          onKeyPress={this.handleMessage}
        />
      </footer>
    );
  }
}
export default ChatBar;
