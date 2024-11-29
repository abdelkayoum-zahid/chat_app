const express = require('express');
const { StreamChat } = require('stream-chat');

const app = express();
const port = 3000;

// Clés API Stream
const apiKey = "hb5hhnf5y4n9"; // Clé publique
const apiSecret = "um3pqr79d5tcvt39vnqsryakfr8wufcg5qd4z3svvw4enhu8vs5kgt77r8f9bwks"; // Secret API

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

// Endpoint pour générer un token
app.get('/token/:userId', (req, res) => {
    const userId = req.params.userId;
    try {
        const token = serverClient.createToken(userId);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la génération du token' });
    }
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
