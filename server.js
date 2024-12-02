const express = require('express');
const { StreamChat } = require('stream-chat');
const cors = require('cors');

const app = express();
const port = 5000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Clés API Stream
const apiKey = "hb5hhnf5y4n9"; // Clé publique
const apiSecret = "um3pqr79d5tcvt39vnqsryakfr8wufcg5qd4z3svvw4enhu8vs5kgt77r8f9bwks"; // Secret API

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// Endpoint pour générer un token
app.post('/token', async (req, res) => {
    const { userId, userName } = req.body;
    try {
        // Create or update the user
        await serverClient.upsertUser({
            id: userId,
            name: userName
        });

        const token = serverClient.createToken(userId);
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Erreur lors de la génération du token' });
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
