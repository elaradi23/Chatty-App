import React, {Component} from 'react';

class ChatBar  extends Component {
  handleSubmit = event => {
    if (event.key === 'Enter') {
      const messageContent = event.target.value;
      this.props.addMessage(messageContent);
      event.target.value = '';
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder={this.props.currentUser} />
        <input className="chatbar-message" placeholder="Type a message and hit ENTER" onKeyPress={this.handleSubmit}/>
      </footer>
      );
  }
}
export default ChatBar;