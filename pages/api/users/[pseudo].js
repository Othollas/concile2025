import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const { pseudo } = req.query;
    const client = await clientPromise;
    const db = client.db('restaurant_voting');
    const usersCollection = db.collection('users');

    if (req.method === 'GET') {
      const { code } = req.query;
      
      if (!code) {
        return res.status(400).json({ error: 'Code requis' });
      }

      const user = await usersCollection.findOne({
        pseudo: { $regex: new RegExp(`^${pseudo}$`, 'i') }
      });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }
      
      if (user.code !== code) {
        console.log(user.code)
        return res.status(401).json({ error: 'Code incorrect' });
      }

      return res.status(200).json({
        pseudo: user.pseudo,
        hasVoted: user.hasVoted,
        participants: user.participants,
        vote: user.vote,
        timestamp: user.timestamp
      });
    }

    if (req.method === 'PUT') {
      const { code, participants, vote } = req.body;

      if (!code) {
        return res.status(400).json({ error: 'Code requis' });
      }

      const user = await usersCollection.findOne({
        pseudo: { $regex: new RegExp(`^${pseudo}$`, 'i') }
      });

      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      if (user.code !== code) {
        return res.status(401).json({ error: 'Code incorrect' });
      }

      const updateData = {
        hasVoted: true,
        participants,
        vote,
        lastUpdated: new Date().toISOString()
      };

      await usersCollection.updateOne(
        { pseudo: { $regex: new RegExp(`^${pseudo}$`, 'i') } },
        { $set: updateData }
      );

      return res.status(200).json({
        success: true,
        message: 'Vote mis à jour avec succès'
      });
    }

    return res.status(405).json({ error: 'Méthode non autorisée' });
  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}