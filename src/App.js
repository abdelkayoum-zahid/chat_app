import React, { useEffect, useState } from "react";
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

// Initialize the Stream client
const apiKey = "hb5hhnf5y4n9";
const client = StreamChat.getInstance(apiKey);

const users = [
  { id: "student1", name: "Alice" },
  { id: "student2", name: "Bob" },
];

const App = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);
  const [clientReady, setClientReady] = useState(false);

  useEffect(() => {
    const connectUserAndCreateChannel = async () => {
      try {
        // Reset states
        setError(null);
        setChannel(null);
        setClientReady(false);

        // Disconnect previous user if any
        if (client.userID) {
          await client.disconnectUser();
        }

        console.log('Connecting user:', selectedUser.id);

        // Get token from server
        const response = await fetch("http://localhost:5000/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            userId: selectedUser.id,
            userName: selectedUser.name 
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to get token from server');
        }

        const { token } = await response.json();
        console.log('Token received');

        // Connect user
        await client.connectUser(
          { 
            id: selectedUser.id, 
            name: selectedUser.name 
          },
          token
        );
        console.log('User connected');
        setClientReady(true);

        // Create and watch channel
        const newChannel = client.channel("messaging", "react-chat", {
          name: "React Chat",
          members: users.map(user => user.id)
        });
        
        await newChannel.watch();
        console.log('Channel created and watched');
        setChannel(newChannel);
      } catch (err) {
        console.error('Connection error:', err);
        setError(err.message || 'Failed to connect to chat. Please try again.');
        setChannel(null);
        setClientReady(false);
      }
    };

    connectUserAndCreateChannel();

    return () => {
      client.disconnectUser();
    };
  }, [selectedUser]);

  const handleUserChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedUser(users[index]);
  };

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>
            Select User: {' '}
            <select onChange={handleUserChange} value={users.indexOf(selectedUser)}>
              {users.map((user, index) => (
                <option key={user.id} value={index}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div style={{ padding: '10px', color: 'red', background: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!clientReady || !channel) {
    return (
      <div style={{ padding: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>
            Select User: {' '}
            <select onChange={handleUserChange} value={users.indexOf(selectedUser)}>
              {users.map((user, index) => (
                <option key={user.id} value={index}>
                  {user.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>Connecting to chat...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#f5f5f5' }}>
        <label>
          Select User: {' '}
          <select onChange={handleUserChange} value={users.indexOf(selectedUser)}>
            {users.map((user, index) => (
              <option key={user.id} value={index}>
                {user.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div style={{ flex: 1 }}>
        <Chat client={client} theme="team light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    </div>
  );
};

export default App;
