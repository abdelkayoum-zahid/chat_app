import React, { useEffect, useState } from "react";
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import "stream-chat-react/dist/css/v2/index.css";

const client = StreamChat.getInstance("hb5hhnf5y4n9"); // Utiliser votre clé API publique

const users = [
  { id: "student1", name: "Alice" },
  { id: "student2", name: "Bob" },
];

const App = () => {
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const connectUserAndCreateChannel = async () => {
      // Se connecter à l'utilisateur via l'API backend
      const response = await fetch("http://localhost:5000/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: selectedUser.id }),
      });

      const { token } = await response.json();

      // Connecter l'utilisateur
      await client.connectUser(
        { id: selectedUser.id, name: selectedUser.name },
        token
      );

      // Créer un canal après que l'utilisateur soit connecté
      const newChannel = client.channel("messaging", "react-chat", {
        name: "React Chat",
      });
      setChannel(newChannel);
    };

    connectUserAndCreateChannel();

    // Nettoyer la connexion utilisateur
    return () => {
      client.disconnectUser();
      setChannel(null);
    };
  }, [selectedUser]);

  return (
    <div>
      {/* Sélection de l'utilisateur */}
      <select onChange={(e) => setSelectedUser(users[e.target.value])}>
        {users.map((user, index) => (
          <option key={user.id} value={index}>
            {user.name}
          </option>
        ))}
      </select>

      {/* Chat UI */}
      {channel && (
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
      )}
    </div>
  );
};

export default App;
