export async function fetchUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Erreur lors du chargement des utilisateurs');
  return response.json();
}

export async function createUser(pseudo, code, phone) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pseudo, code, phone })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return response.json();
}

export async function loginUser(pseudo, code) {
  const response = await fetch(`/api/users/${pseudo}?code=${code}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return response.json();
}

export async function updateUserVote(pseudo, code, participants, vote) {
  const response = await fetch(`/api/users/${pseudo}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, participants, vote })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error);
  }
  
  return response.json();
}

export async function fetchVotes() {
  const response = await fetch('/api/votes');
  if (!response.ok) throw new Error('Erreur lors du chargement des votes');
  return response.json();
}

export async function getCodeUser() {
   await fetch(`./api/users/${selectedUser.pseudo}`, {
        method : 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })
}

export async function sendSMS(to, code){
  const response = await fetch('/api/send-sms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({
      to: to,
      message: `Votre code pour le vote est : ${code}`
    })
  });

  const data = await response.json();
  console.log(data);
}