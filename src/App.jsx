import React, { useState } from 'react';
import {
  Users,
  Vote,
  Trophy,
  CheckCircle,
  XCircle,
  Search,
  LogOut,
} from 'lucide-react';

export default function App() {
  const [participants, setParticipants] = useState([]);
  const [newName, setNewName] = useState('');
  const [votingPhase, setVotingPhase] = useState(false);
  const [currentVoter, setCurrentVoter] = useState(null);
  const [selectedVotes, setSelectedVotes] = useState([]);
  const [results, setResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Adiciona participante (com regra especial para JORGINHO)
  const addParticipant = () => {
    const trimmedName = newName.trim();

    if (trimmedName && !participants.find((p) => p.name === trimmedName)) {
      const isJorginho = trimmedName.toUpperCase() === 'JORGINHO';

      const newParticipant = {
        id: Date.now(),
        name: trimmedName,
        votes: 0,
        hasVoted: false,
        // Jorginho: pode votar, mas não pode ser votado
        canBeVoted: !isJorginho,
        role: isJorginho ? 'Diretor' : 'Atleta',
      };

      const updated = [...participants, newParticipant].sort((a, b) =>
        a.name.localeCompare(b.name, 'pt-BR')
      );
      setParticipants(updated);
      setNewName('');
    }
  };

  const startVoting = () => {
    if (participants.length >= 5) {
      setVotingPhase(true);
    }
  };

  const selectVoter = (voter) => {
    if (!voter.hasVoted) {
      setCurrentVoter(voter);
      setSelectedVotes([]);
      setSearchTerm('');
    }
  };

  // Não vota em si mesmo nem em quem não pode ser votado (ex: Jorginho)
  const toggleVote = (candidateId) => {
    if (!currentVoter) return;

    const candidate = participants.find((p) => p.id === candidateId);
    if (!candidate) return;

    if (candidate.id === currentVoter.id || candidate.canBeVoted === false) {
      return;
    }

    if (selectedVotes.includes(candidateId)) {
      setSelectedVotes(selectedVotes.filter((id) => id !== candidateId));
    } else if (selectedVotes.length < 5) {
      setSelectedVotes([...selectedVotes, candidateId]);
    }
  };

  // Confirma voto: exatamente 5 participantes obrigatórios
  const confirmVote = () => {
    if (!currentVoter) return;

    if (selectedVotes.length !== 5) {
      alert('Você precisa votar em exatamente 5 pessoas!');
      return;
    }

    const updatedParticipants = participants.map((p) => {
      if (p.id === currentVoter.id) {
        return { ...p, hasVoted: true };
      }
      if (selectedVotes.includes(p.id)) {
        return { ...p, votes: p.votes + 1 };
      }
      return p;
    });

    setParticipants(updatedParticipants);
    setSelectedVotes([]);
    setCurrentVoter(null);
  };

  // Encerrar votação com senha
  const endVoting = () => {
    const inputPassword = prompt('Digite a senha para encerrar a votação:');

    if (inputPassword !== '062881') {
      alert('Senha incorreta! A votação NÃO foi encerrada.');
      return;
    }

    const hasAnyVotes = participants.some((p) => p.hasVoted);
    if (!hasAnyVotes) {
      alert('Nenhum voto foi registrado ainda!');
      return;
    }

    if (
      confirm(
        'Tem certeza que deseja encerrar a votação? Os resultados serão calculados com os votos já registrados.'
      )
    ) {
      showResults(participants);
    }
  };

  const showResults = (finalParticipants) => {
    const sorted = [...finalParticipants].sort((a, b) => b.votes - a.votes);
    const top5 = sorted.slice(0, 5);

    setResults({
      president: top5[0],
      elected: top5,
      all: sorted,
    });
    setVotingPhase(false);
    setCurrentVoter(null);
  };

  const resetSystem = () => {
    setParticipants([]);
    setNewName('');
    setVotingPhase(false);
    setCurrentVoter(null);
    setSelectedVotes([]);
    setResults(null);
    setSearchTerm('');
  };

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ================== TELAS ==================

  // Tela de resultados finais
  if (results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
            <div className="flex justify-center mb-4 sm:mb-6">
              <img
                src="https://i.imgur.com/jyeIqaC.png"
                alt="Grupo União"
                className="h-20 w-20 sm:h-32 sm:w-32 object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-center text-red-700 mb-1 sm:mb-2">
              União 2026
            </h1>
            <p className="text-center text-gray-600 mb-4 sm:mb-8 text-sm sm:text-base">
              Jardim Atlântico
            </p>
            <h2 className="text-xl sm:text-3xl font-bold text-center text-red-700 mb-4 sm:mb-8">
              Resultados Finais
            </h2>

            <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-center">
              <Trophy className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 text-white" />
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                Presidente
              </h2>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {results.president.name}
                {results.president.role === 'Diretor' && ' (Diretor)'}
              </p>
              <p className="text-base sm:text-xl text-white mt-1 sm:mt-2">
                {results.president.votes} votos
              </p>
            </div>

            <div className="mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-red-700 mb-3 sm:mb-4">
                Os 5 Eleitos
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {results.elected.map((person, index) => (
                  <div
                    key={person.id}
                    className="bg-orange-50 border-2 border-orange-500 rounded-lg p-3 sm:p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-2xl font-bold text-red-700">
                        #{index + 1}
                      </span>
                      <span className="text-base sm:text-xl font-semibold text-gray-800">
                        {person.name}
                        {person.role === 'Diretor' && ' (Diretor)'}
                      </span>
                    </div>
                    <span className="text-sm sm:text-lg font-bold text-red-700">
                      {person.votes} votos
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2 sm:mb-3">
                Classificação Completa
              </h3>
              <div className="space-y-1.5 sm:space-y-2 max-h-[380px] sm:max-h-[460px] overflow-y-auto pr-1">
                {results.all.map((person, index) => (
                  <div
                    key={person.id}
                    className={`rounded-lg p-2.5 sm:p-3 flex items-center justify-between ${
                      index < 5 ? 'bg-orange-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="font-bold text-xs sm:text-sm text-gray-600">
                        #{index + 1}
                      </span>
                      <span className="text-sm sm:text-base text-gray-800">
                        {person.name}
                        {person.role === 'Diretor' && ' (Diretor)'}
                      </span>
                    </div>
                    <span className="font-semibold text-xs sm:text-sm text-gray-700">
                      {person.votes} votos
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={resetSystem}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition text-sm sm:text-base"
            >
              Nova Votação
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de votação (escolhendo candidatos)
  if (votingPhase && currentVoter) {
    const votersCount = participants.filter((p) => p.hasVoted).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4 sm:p-8">
        <div className="max-w-xl sm:max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
            <div className="flex justify-center mb-4">
              <img
                src="https://i.imgur.com/jyeIqaC.png"
                alt="Grupo União"
                className="h-16 w-16 sm:h-24 sm:w-24 object-contain"
              />
            </div>
            <div className="text-center mb-6 sm:mb-8">
              <Vote className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-3 text-red-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mb-1 sm:mb-2">
                Votação em Andamento
              </h2>
              <p className="text-base sm:text-xl text-gray-700">
                Votante:{' '}
                <span className="font-bold text-red-600">
                  {currentVoter.name}
                  {currentVoter.role === 'Diretor' && ' (Diretor)'}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Você deve selecionar exatamente{' '}
                <span className="font-semibold">5 candidatos</span> (você não
                pode votar em si mesmo).
              </p>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-0 mb-3 sm:mb-4">
                <span className="text-sm sm:text-lg font-semibold text-gray-700">
                  Votos selecionados: {selectedVotes.length}/5
                </span>
                <span className="text-xs sm:text-sm text-gray-500">
                  Já votaram: {votersCount} / {participants.length}
                </span>
              </div>

              <div className="space-y-2.5 sm:space-y-3 max-h-[420px] sm:max-h-[480px] overflow-y-auto pr-1">
                {participants.map((person) => {
                  const isCurrentVoter =
                    currentVoter && person.id === currentVoter.id;
                  const isSelected = selectedVotes.includes(person.id);
                  const canBeVoted = person.canBeVoted !== false; // padrão true
                  const canSelect =
                    canBeVoted &&
                    !isCurrentVoter &&
                    (selectedVotes.length < 5 || isSelected);

                  return (
                    <button
                      key={person.id}
                      onClick={() => toggleVote(person.id)}
                      disabled={
                        isCurrentVoter ||
                        !canBeVoted ||
                        (!isSelected && selectedVotes.length >= 5)
                      }
                      className={`w-full p-3 sm:p-4 rounded-lg border-2 transition flex items-center justify-between ${
                        isCurrentVoter
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                          : !canBeVoted
                          ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-70'
                          : isSelected
                          ? 'bg-orange-100 border-red-500'
                          : canSelect
                          ? 'bg-white border-gray-300 hover:border-orange-400'
                          : 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <span
                        className={`text-sm sm:text-lg font-semibold ${
                          isCurrentVoter ? 'text-gray-500' : 'text-gray-800'
                        }`}
                      >
                        {person.name}
                        {person.role === 'Diretor' && ' (Diretor - não votado)'}
                        {isCurrentVoter && ' (você)'}
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setCurrentVoter(null)}
                className="w-full sm:flex-1 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmVote}
                disabled={selectedVotes.length !== 5}
                className={`w-full sm:flex-1 py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg transition ${
                  selectedVotes.length !== 5
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                Confirmar Voto
              </button>
            </div>

            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600 text-center">
                Já votaram:{' '}
                {participants.filter((p) => p.hasVoted).length} /{' '}
                {participants.length}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de seleção do votante
  if (votingPhase && !currentVoter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4 sm:p-8">
        <div className="max-w-xl sm:max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
            <div className="flex justify-center mb-4">
              <img
                src="https://i.imgur.com/jyeIqaC.png"
                alt="Grupo União"
                className="h-16 w-16 sm:h-24 sm:w-24 object-contain"
              />
            </div>
            <div className="text-center mb-6 sm:mb-8">
              <Users className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-3 text-red-600" />
              <h2 className="text-2xl sm:text-3xl font-bold text-red-700 mb-1 sm:mb-2">
                Selecione seu Nome
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Procure e clique no seu nome para começar a votar
              </p>
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar seu nome..."
                  className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-sm sm:text-lg"
                />
              </div>
            </div>

            <div className="mb-4 sm:mb-6 max-h-[380px] sm:max-h-96 overflow-y-auto space-y-1.5 sm:space-y-2 pr-1">
              {filteredParticipants.map((person) => (
                <button
                  key={person.id}
                  onClick={() => selectVoter(person)}
                  disabled={person.hasVoted}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 transition text-left ${
                    person.hasVoted
                      ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-50'
                      : 'bg-white border-red-300 hover:border-red-500 hover:bg-orange-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm sm:text-lg font-semibold text-gray-800">
                      {person.name}
                      {person.role === 'Diretor' && ' (Diretor)'}
                    </span>
                    {person.hasVoted && (
                      <span className="text-[11px] sm:text-sm bg-green-100 text-green-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium">
                        ✓ Já votou
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 sm:pt-6 border-t border-gray-200 space-y-2.5 sm:space-y-3">
              <p className="text-xs sm:text-sm text-center text-gray-600">
                Já votaram:{' '}
                {participants.filter((p) => p.hasVoted).length} /{' '}
                {participants.length}
              </p>

              <button
                onClick={endVoting}
                className="w-full py-2.5 sm:py-3 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                Encerrar Votação
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela inicial (cadastro de participantes)
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 p-4 sm:p-8">
      <div className="max-w-md sm:max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
          <div className="flex justify-center mb-4">
            <img
              src="https://i.imgur.com/jyeIqaC.png"
              alt="Grupo União"
              className="h-20 w-20 sm:h-32 sm:w-32 object-contain"
            />
          </div>
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-red-700 mb-1 sm:mb-2">
              União 2026
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Sistema de Votação
            </p>
          </div>

          <div className="mb-6 sm:mb-8">
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
              Adicionar Participante
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                placeholder='Nome do participante (ex: "JORGINHO")'
                className="flex-1 px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none text-sm sm:text-base"
              />
              <button
                onClick={addParticipant}
                className="px-3 sm:px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition text-sm sm:text-base"
              >
                Adicionar
              </button>
            </div>
            <p className="mt-2 text-[11px] sm:text-xs text-gray-500">
              Se adicionar <strong>JORGINHO</strong>, ele será marcado como{' '}
              <strong>Diretor</strong>: pode votar, mas não pode ser votado.
            </p>
          </div>

          {participants.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                Participantes ({participants.length})
              </h3>
              <div className="space-y-1.5 sm:space-y-2 max-h-64 overflow-y-auto pr-1">
                {participants.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm sm:text-base text-gray-800 font-medium">
                      {person.name}
                      {person.role === 'Diretor' && ' (Diretor)'}
                    </span>
                    <button
                      onClick={() =>
                        setParticipants(
                          participants.filter((p) => p.id !== person.id)
                        )
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={startVoting}
            disabled={participants.length < 5}
            className={`w-full py-3 sm:py-4 rounded-lg font-bold text-sm sm:text-lg transition ${
              participants.length < 5
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {participants.length < 5
              ? `Adicione pelo menos 5 participantes (${participants.length}/5)`
              : 'Iniciar Votação'}
          </button>
        </div>
      </div>
    </div>
  );
}
