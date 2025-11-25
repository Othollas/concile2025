import React, { useState } from 'react';
import { ArrowLeft, UserCircle, CheckCircle, Verified } from 'lucide-react';
import { loginUser, sendSMS } from '@/utils/api';

export default function PseudoPage({ onSubmit, existingUsers, onLoginExisting, onToast, onViewResults }) {
  const [mode, setMode] = useState('choose');
  const [pseudo, setPseudo] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [enteredCode, setEnteredCode] = useState('');
  const [telNumber, setTelNumber] = useState('');

  const handleNewUser = () => setMode('new');

  const handleExistingUser = async (user) => {
    setSelectedUser(user);

    if (localStorage.getItem("user_pseudo") === user.pseudo) {
      try {
        await loginUser(user.pseudo, localStorage.getItem("user_code"))
        const verifiedUSer = { ...user, code: localStorage.getItem("user_code") }
        onLoginExisting(verifiedUSer);

      } catch (error) {
        console.error(error);
        onToast('Code incorrect !', 'bg-red-500', 2000);
      }
    } else {
      setMode('existing');
    }
  };

  const handlePseudoSubmit = () => {
    if (pseudo.trim()) {
      const userExists = existingUsers.some(u => u.pseudo.toLowerCase() === pseudo.toLowerCase());

      if (userExists) {
        onToast('Ce pseudo existe déjà ! Connectez-vous avec votre code ou choisissez un autre pseudo.');
        return;
      }
      const userPhoneExists = existingUsers.some(u => u.phone === telNumber)
      if (userPhoneExists) {
        onToast("L'utilisateur ne dois pas utiliser deux fois son numéro de téléphone");
        return;
      }
      const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
      setCode(generatedCode);
      const phoneNumber = `+33${Number(telNumber)}`;

      // sendSMS(phoneNumber, generatedCode);

      setShowCode(true);
    }
  };

  const handleCodeSubmit = async () => {

    try {

      if (enteredCode === code) {
        await onSubmit(pseudo, code, telNumber);
        await loginUser(pseudo, enteredCode);


      } else {
        onToast('Code incorrect !', 'bg-red-500')

      }
    } catch (error) {
      onToast('Code incorrect !', 'bg-red-500')

    }
  };

  const handleExistingCodeSubmit = async () => {

    try {

      await loginUser(selectedUser.pseudo, enteredCode);

      const verifiedUSer = { ...selectedUser, code: enteredCode }
      onLoginExisting(verifiedUSer);

    } catch (error) {
      console.error(error);
      onToast('Code incorrect !', 'bg-red-500', 2000);
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
                <button
                  onClick={onViewResults}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-lg transition-all duration-300 hover:scale-95"
                >
                  Voir les résultats
                </button>
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
                maxLength={10}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Entrez votre pseudo"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handlePseudoSubmit()}
              />
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Votre Téléphone</h2>
              <input
                type="number"
                value={telNumber}
                onChange={(e) => setTelNumber(e.target.value)}
                placeholder="Entrez votre numéro de téléphone"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors mb-4 "
                onKeyPress={(e) => e.key === 'Enter' && handlePseudoSubmit()}
              />
              <button
                onClick={handlePseudoSubmit}
                disabled={!pseudo.trim() || !telNumber}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Continuer
              </button>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Code de vérification</h2>
              <p className="text-gray-600 mb-6 text-center">
                Votre code a été envoyé par SMS<br />
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