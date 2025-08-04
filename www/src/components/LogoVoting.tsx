import React from 'react';
import { useLogoVoting } from '../contexts/LogoVotingContext';
import { useWallet } from '../contexts/WalletContext';

const LogoVoting: React.FC = () => {
  const { round, designs, hasVoted, vote, canProgressRound, progressRound, threshold } = useLogoVoting();
  const { address, isConnected } = useWallet();

  return (
    <div>
      <div className="mb-4 text-white" style={{ fontWeight: 100 }}>
        <span>Round {round}</span>
        <span className="ml-4 text-white/60">Threshold: {threshold} votes</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {designs.map(design => (
          <div key={design.id} className="border border-white/10 p-4 flex flex-col items-center" style={{ borderRadius: 0 }}>
            <img src={design.image} alt={`Logo ${design.id}`} className="mb-4" style={{ width: 96, height: 96, objectFit: 'contain', borderRadius: 0, background: '#222' }} />
            <div className="text-white mb-2" style={{ fontWeight: 100 }}>By: {design.submitter}</div>
            <div className="text-white/60 mb-2" style={{ fontWeight: 100 }}>Votes: {design.votes}</div>
            <button
              disabled={!isConnected || hasVoted}
              onClick={() => vote(design.id)}
              className="px-6 py-2 border border-white/20 text-white bg-black hover:bg-white/10 transition-colors duration-200 disabled:opacity-50"
              style={{ borderRadius: 0, fontWeight: 100 }}
            >
              {hasVoted ? 'Vote Submitted' : 'Vote for this Logo'}
            </button>
          </div>
        ))}
      </div>
      {canProgressRound && (
        <div className="mt-8">
          <button
            onClick={progressRound}
            className="px-8 py-3 border border-white/20 text-white bg-black hover:bg-white/10 transition-colors duration-200"
            style={{ borderRadius: 0, fontWeight: 100 }}
          >
            Progress to Next Round
          </button>
        </div>
      )}
      {hasVoted && (
        <div className="mt-4 text-green-400" style={{ fontWeight: 100 }}>
          Your vote has been recorded for this round.
        </div>
      )}
    </div>
  );
};

export default LogoVoting;
