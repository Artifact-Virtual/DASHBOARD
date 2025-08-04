import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useWallet } from './WalletContext';

export interface LogoDesign {
  id: string;
  image: string; // URL or base64
  submitter: string;
  votes: number;
}

interface LogoVotingContextType {
  round: number;
  designs: LogoDesign[];
  hasVoted: boolean;
  vote: (logoId: string) => void;
  canProgressRound: boolean;
  progressRound: () => void;
  threshold: number;
}

const LogoVotingContext = createContext<LogoVotingContextType | undefined>(undefined);

export const useLogoVoting = () => {
  const ctx = useContext(LogoVotingContext);
  if (!ctx) throw new Error('useLogoVoting must be used within LogoVotingProvider');
  return ctx;
};

interface LogoVotingProviderProps {
  children: ReactNode;
  adminWallets?: string[];
}

const initialDesigns: LogoDesign[] = [
  { id: '1', image: '/logos/logo1.png', submitter: 'team', votes: 0 },
  { id: '2', image: '/logos/logo2.png', submitter: 'community', votes: 0 },
  { id: '3', image: '/logos/logo3.png', submitter: 'community', votes: 0 },
];

export const LogoVotingProvider: React.FC<LogoVotingProviderProps> = ({ children, adminWallets = [] }) => {
  const { address } = useWallet();
  const [round, setRound] = useState(1);
  const [designs, setDesigns] = useState<LogoDesign[]>(initialDesigns);
  const [votes, setVotes] = useState<{ [round: number]: { [wallet: string]: string } }>({});
  const threshold = 2; // Example: 2 votes to progress

  const hasVoted = !!(address && votes[round]?.[address.toLowerCase()]);

  const vote = (logoId: string) => {
    if (!address || hasVoted) return;
    setDesigns(ds => ds.map(d => d.id === logoId ? { ...d, votes: d.votes + 1 } : d));
    setVotes(vs => ({
      ...vs,
      [round]: {
        ...(vs[round] || {}),
        [address.toLowerCase()]: logoId,
      },
    }));
  };

  const canProgressRound = !!(address && adminWallets.includes(address.toLowerCase()));

  const progressRound = () => {
    if (!canProgressRound) return;
    // Only designs above threshold move to next round
    const nextDesigns = designs.filter(d => d.votes >= threshold).map(d => ({ ...d, votes: 0 }));
    setDesigns(nextDesigns);
    setRound(r => r + 1);
    setVotes(vs => ({ ...vs, [round + 1]: {} }));
  };

  return (
    <LogoVotingContext.Provider value={{ round, designs, hasVoted, vote, canProgressRound, progressRound, threshold }}>
      {children}
    </LogoVotingContext.Provider>
  );
};
