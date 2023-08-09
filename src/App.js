// Import necessary modules and styles
import React, { Component } from "react";
import "./App.css";
import Messages from "./Messages";
import Input from "./Input";
import { signInWithGoogle } from "./Firebase";

// Helper function to generate a random color
function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16);
}

// Main App component
class App extends Component {
  // Define initial state
  state = {
    messages: [],
    member: {
      username: localStorage.getItem("name") || "", // Load username from local storage or set as empty string
      color: randomColor(),
    },
  };

  // Component lifecycle method, executed after component is mounted
  componentDidMount() {
    // Initialize Scaledrone with member data
    this.drone = new window.Scaledrone("4KbHtz2O6juiJIb7", {
      data: this.state.member,
    });

    // Add an event listener for when the connection is opened
    this.drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      const member = { ...this.state.member };
      member.id = this.drone.clientId;
      this.setState({ member });
    });

    // Subscribe to a room for messages
    const room = this.drone.subscribe("observable-room");
    room.on("data", (data, member) => {
      const messages = [...this.state.messages];
      messages.push({ member, text: data });
      this.setState({ messages });
    });
  }

  // Handle sign-in with Google
  handleSignIn() {
    signInWithGoogle((username) => {
      // Update the state with the signed-in user's name
      this.setState((prevState) => ({
        member: {
          ...prevState.member,
          username: username,
        },
      }));
    });
  }

  // Render UI components
  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <h1>My Chat App</h1>
          <h2>{this.state.member.username}</h2>
          <button
            className='googlebtn'
            onClick={() => this.handleSignIn()}
          >
            <img
              src='/google2.png'
              alt='Google Logo'
              style={{ verticalAlign: "middle", marginRight: "8px" }}
            />
            Sign In With Google
          </button>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input onSendMessage={this.onSendMessage} />
      </div>
    );
  }

  // Function to send a message
  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message,
    });
  };
}

// Export the App component for use in other modules
export default App;
