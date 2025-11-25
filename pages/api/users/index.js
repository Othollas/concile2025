import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('restaurant_voting');
    const usersCollection = db.collection('users');

    if (req.method === 'GET') {
      const users = await usersCollection.find({}).toArray();
      const safeUsers = users.map(u => ({
        pseudo: u.pseudo,
        vote: u.vote,
        phone: u.phone,
        participants: u.participants,
        hasVoted: u.hasVoted,
        timestamp: u.timestamp
      }));

      return res.status(200).json(safeUsers);
    }

    if (req.method === 'POST') {
      const { pseudo, code, phone } = req.body;

      if (!pseudo || !code || !phone) {
        return res.status(400).json({ error: 'Pseudo, code et téléphone requis' });
      }
     

      const existingUser = await usersCollection.findOne({
        pseudo: { $regex: new RegExp(`^${pseudo}$`, 'i') }
      });
      if (existingUser) {
        return res.status(409).json({ error: 'Ce pseudo existe déjà' });
      }

      const existingPhone = await usersCollection.findOne({ phone: phone });
      if (existingPhone) {
        return res.status(409).json({ error: 'Ce numéro de téléphone existe déjà' });
      }

      const newUser = {
        pseudo,
        code,
        phone,
        hasVoted: false,
        participants: null,
        vote: null,
        timestamp: new Date().toISOString()
      };

      const result = await usersCollection.insertOne(newUser);

      return res.status(201).json({
        success: true,
        userId: result.insertedId,
        pseudo: newUser.pseudo
      });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}

