import React, { useState } from 'react';
import { ArrowLeft, UserCircle, CheckCircle, Verified } from 'lucide-react';
import { loginUser } from '@/utils/api';

export default function PseudoPage({ onSubmit, existingUsers, onLoginExisting, onShowToast, onMessageToast }) {
  const [mode, setMode] = useState('choose');
  const [pseudo, setPseudo] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [enteredCode, setEnteredCode] = useState('');

  const handleNewUser = () => setMode('new');

  const handleExistingUser = (user) => {
    setSelectedUser(user);
    setMode('existing');
  };

  const handlePseudoSubmit = () => {
    if (pseudo.trim()) {
      const userExists = existingUsers.some(u => u.pseudo.toLowerCase() === pseudo.toLowerCase());
      if (userExists) {
        onMessageToast('Ce pseudo existe déjà ! Connectez-vous avec votre code ou choisissez un autre pseudo.');
        onShowToast(true);
        return;
      }
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setCode(generatedCode);
      setShowCode(true);
      console.log(`Code SMS envoyé à ${pseudo}: ${generatedCode}`);
    }
  };

  const handleCodeSubmit = async ({ selectedUser }) => {
    try {
      const userResponse = loginUser(selectedUser.pseudo, enteredCode)
      console.log(userResponse)
      if (enteredCode === code) {
        console.log(enteredCode)
        onSubmit(pseudo, code);
      } else {
        onMessageToast('Code incorrect !');
        onShowToast(true);
        // alert('Code incorrect !');
      }
    } catch (error) {
      console.error(error)
    }
  };

  const handleExistingCodeSubmit = async () => {
    
    try {

      await loginUser(selectedUser.pseudo, enteredCode);

      const verifiedUSer = { ...selectedUser, code: enteredCode }
      console.log(verifiedUSer)
      onLoginExisting(verifiedUSer);

    } catch (error) {
      console.error(error)
      onMessageToast('Code incorrect !');
      onShowToast(true);
    }

  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Bienvenue !</h2>

          <button
            onClick={handleNewUser}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-4 rounded-lg transition-all duration-300 hover:scale-105 mb-4 flex items-center justify-center gap-2"
          >
            <UserCircle size={24} />
            Nouveau vote
          </button>

          {existingUsers.length > 0 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Ou se reconnecter</span>
                </div>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                <p className="text-sm text-gray-600 mb-2">Utilisateurs déjà inscrits :</p>
                {existingUsers.map((user) => (
                  <button
                    key={user.pseudo}
                    onClick={() => handleExistingUser(user)}
                    className="w-full bg-gray-50 hover:bg-orange-50 border-2 border-gray-200 hover:border-orange-300 text-gray-700 font-medium px-4 py-3 rounded-lg transition-all duration-300 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <UserCircle size={20} />
                      {user.pseudo}
                    </span>
                    {user.hasVoted && (
                      <span className="text-green-500 text-sm flex items-center gap-1">
                        <CheckCircle size={16} />
                        A voté
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'new') {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in">
          <button
            onClick={() => setMode('choose')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour
          </button>

          {!showCode ? (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Votre pseudo</h2>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Entrez votre pseudo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handlePseudoSubmit()}
              />
              <button
                onClick={handlePseudoSubmit}
                disabled={!pseudo.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Continuer
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Code de vérification</h2>
              <p className="text-gray-600 mb-6 text-center">
                Un code a été envoyé par SMS<br />
                <span className="text-sm text-gray-500">(Demo: {code})</span>
              </p>
              <input
                type="text"
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
                placeholder="Entrez le code"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors mb-4 text-center text-2xl tracking-widest"
                maxLength={4}
                onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit()}
              />
              <button
                onClick={handleCodeSubmit}
                disabled={enteredCode.length !== 4}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Valider
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  if (mode === 'existing') {
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fade-in">
          <button
            onClick={() => {
              setMode('choose');
              setSelectedUser(null);
              setEnteredCode('');
            }}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} />
            Retour
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Bonjour {selectedUser.pseudo} !
          </h2>
          <p className="text-gray-600 mb-6 text-center">Entrez votre code de vérification</p>
          <input
            type="text"
            value={enteredCode}
            onChange={(e) => setEnteredCode(e.target.value)}
            placeholder="Entrez votre code"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors mb-4 text-center text-2xl tracking-widest"
            maxLength={4}
            onKeyPress={(e) => e.key === 'Enter' && handleExistingCodeSubmit()}
          />
          <button
            onClick={handleExistingCodeSubmit}
            disabled={enteredCode.length !== 4}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }
}