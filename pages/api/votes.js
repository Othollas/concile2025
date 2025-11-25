import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const client = await clientPromise;
    const db = client.db('restaurant_voting');
    const usersCollection = db.collection('users');

    const users = await usersCollection
      .find({ hasVoted: true })
      .toArray();

    const votes = users.map(u => ({
      pseudo: u.pseudo,
      restaurant: u.vote,
      participants: u.participants,
      timestamp: u.timestamp
    }));
    console.log(votes)
    return res.status(200).json(votes);
  } catch (error) {
    console.error('Erreur API:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}