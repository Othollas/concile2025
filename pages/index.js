import React, { useState, useEffect } from 'react';
import HomePage from '../components/HomePage';
import PseudoPage from '../components/PseudoPage';
import ParticipantsPage from '../components/ParticipantsPage';
import RestaurantVotePage from '../components/RestaurantVotePage';
import ConfirmationPage from '../components/ConfirmationPage';
import ResultsPage from '../components/ResultsPage';
import Toast from '../components/Toast';
import { fetchUsers, createUser, loginUser, updateUserVote } from '../utils/api';

export default function Home() {
  const [page, setPage] = useState('home');
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [participants, setParticipants] = useState(null);
  const [lastVote, setLastVote] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [isModification, setIsModification] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageToast, setMessageToast] = useState('');
  const [colorToast, setColorToast] = useState('bg-green-500');
  const [timeToast, setTimeToast] = useState(3000);

  // Charger les utilisateurs au démarrage
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleStart = () => {
    setPage('pseudo');
  };

  const handleNewUserSubmit = async (pseudo, code, phone) => {
    try {
      await createUser(pseudo, code, phone);
      
      const newUser = {
        pseudo,
        code,
        phone,
        hasVoted: false,
        participants: null,
        vote: null,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem("user_pseudo", pseudo);
      localStorage.setItem("user_code", code);
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setPage('participants');
    } catch (error) {
      alert(error.message);
    }
  };


  const handleLoginExisting = async (user) => {
    try {
      console.log('user', user)
      const userData = await loginUser(user.pseudo, user.code);
      
      setCurrentUser({ ...user, ...userData });
      setIsModification(true);
      
      //si l'user à deja voté
      if (userData.hasVoted) {
        setParticipants(userData.participants); // si l'user à deja entré des participant
        setPage('participants'); // va à la page participant
      } else {
        setPage('participants');
      }
    } catch (error) {
     setMessageToast(error.message);
     setShowToast(!showToast);
    }
  };

  const handleParticipantsSubmit = (participantsData) => {
    setParticipants(participantsData);
    setPage('vote');
  };

  const handleVote = async (restaurant) => {
    try {
      await updateUserVote(
        currentUser.pseudo,
        currentUser.code,
        participants,
        restaurant
      );

      const vote = {
        pseudo: currentUser.pseudo,
        restaurant,
        participants,
        timestamp: new Date().toISOString()
      };
      
      const updatedUsers = users.map(u => 
        u.pseudo === currentUser.pseudo 
          ? { ...u, hasVoted: true, participants, vote: restaurant }
          : u
      );
      setUsers(updatedUsers);
      
      setLastVote(vote);
      setShowToast(true);
      setPage('confirmation');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBackHome = () => {
    setCurrentUser(null);
    setParticipants(null);
    setLastVote(null);
    setIsModification(false);
    setPage('home');
  };

  const handleViewResults = () => {
    setPage('results');
  };

  const handleModifyVote = () => {
    setIsModification(true);
    setPage('participants');
  };

  const handleToast = (message, color = "bg-red-500", timeToast = 3000 ) =>{
    setMessageToast(message);
    setColorToast(color);
    setTimeToast(timeToast);
    setShowToast(true);
  }


  const votes = users
    .filter(u => u.hasVoted)
    .map(u => ({
      pseudo: u.pseudo,
      restaurant: u.vote,
      participants: u.participants,
      timestamp: u.timestamp
    }));

  const existingUsers = users.map(u => ({
    pseudo: u.pseudo,
    phone: u.phone,
    code: u.code,
    hasVoted: u.hasVoted
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-[spin_1s_ease-in-out_infinite]">🍽️</div>
          <p className="text-xl text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }



  return (
    <>
      {showToast && lastVote && (
        <Toast
          message={`Vous avez voté pour ${lastVote.restaurant.name}`}
          onClose={() => setShowToast(false)}
        />
      )}

{showToast && (
        <Toast
          message={messageToast}
          color={colorToast}
          time={timeToast}
          onClose={() => setShowToast(false)}
        />
      )}

      {page === 'home' && <HomePage onStart={handleStart} />}
      
      {page === 'pseudo' && (
        <PseudoPage
          onSubmit={handleNewUserSubmit}
          existingUsers={existingUsers}
          onLoginExisting={handleLoginExisting}
          onToast={handleToast}
          onViewResults={handleViewResults}
        />
      )}
      
      {page === 'participants' && currentUser && (
        <ParticipantsPage
          pseudo={currentUser.pseudo}
          onSubmit={handleParticipantsSubmit}
          existingData={isModification ? currentUser.participants : null}
        />
      )}
      
      {page === 'vote' && currentUser && participants && (
        <RestaurantVotePage
          pseudo={currentUser.pseudo}
          participants={participants}
          onVote={handleVote}
          existingVote={isModification ? currentUser.vote : null}
        />
      )}
      
      {page === 'confirmation' && lastVote && (
        <ConfirmationPage
          vote={lastVote}
          onViewResults={handleViewResults}
          onBackHome={handleBackHome}
          onModify={handleModifyVote}
          isModification={isModification}
        />
      )}


      {page === 'results' && (
        <ResultsPage votes={votes} onBack={handleBackHome} />
      )}
    </>
  );
}
