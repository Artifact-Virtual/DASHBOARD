import React, { useState, useEffect } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../contexts/ToastContext';

interface SmartAirdropProps {
  airdropAddress: string;
  className?: string;
}

interface MeritCriteria {
  id: string;
  name: string;
  description: string;
  weight: number;
  points: number;
  maxPoints: number;
  verified: boolean;
  category: 'community' | 'technical' | 'governance' | 'ecosystem';
}

interface AirdropAllocation {
  totalTokens: number;
  claimableTokens: number;
  meritScore: number;
  qualificationTier: 'Genesis' | 'Core' | 'Community' | 'Unqualified';
  multiplier: number;
  lockupPeriod: number; // months
  vestingSchedule: string;
}

const SmartAirdrop: React.FC<SmartAirdropProps> = ({ 
  airdropAddress, 
  className = "" 
}) => {
  const { isConnected, address } = useWallet();
  const { showToast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedEligibility, setHasCheckedEligibility] = useState(false);
  const [allocation, setAllocation] = useState<AirdropAllocation | null>(null);
  
  // Merit-based criteria for ARCx Smart Airdrop
  const [meritCriteria, setMeritCriteria] = useState<MeritCriteria[]>([
    {
      id: 'early_support',
      name: 'Early Protocol Support',
      description: 'Participated in protocol development, testing, or early governance',
      weight: 0.25,
      points: 0,
      maxPoints: 100,
      verified: false,
      category: 'community'
    },
    {
      id: 'github_contributions',
      name: 'Technical Contributions',
      description: 'Code contributions, bug reports, or technical documentation',
      weight: 0.30,
      points: 0,
      maxPoints: 100,
      verified: false,
      category: 'technical'
    },
    {
      id: 'governance_participation',
      name: 'Governance Engagement',
      description: 'Voting participation, proposal creation, or community leadership',
      weight: 0.20,
      points: 0,
      maxPoints: 100,
      verified: false,
      category: 'governance'
    },
    {
      id: 'ecosystem_building',
      name: 'Ecosystem Development',
      description: 'Building tools, integrations, or educational content',
      weight: 0.15,
      points: 0,
      maxPoints: 100,
      verified: false,
      category: 'ecosystem'
    },
    {
      id: 'constitutional_knowledge',
      name: 'Constitutional Intelligence',
      description: 'Understanding of ARCx constitutional principles and ADAM Protocol',
      weight: 0.10,
      points: 0,
      maxPoints: 100,
      verified: false,
      category: 'governance'
    }
  ]);

  // Calculate total merit score
  const calculateMeritScore = () => {
    return meritCriteria.reduce((total, criteria) => {
      return total + (criteria.points * criteria.weight);
    }, 0);
  };

  // Determine qualification tier based on merit score
  const getQualificationTier = (score: number): AirdropAllocation['qualificationTier'] => {
    if (score >= 80) return 'Genesis';
    if (score >= 60) return 'Core';
    if (score >= 30) return 'Community';
    return 'Unqualified';
  };

  // Get tier multiplier
  const getTierMultiplier = (tier: AirdropAllocation['qualificationTier']) => {
    switch (tier) {
      case 'Genesis': return 3.0;
      case 'Core': return 2.0;
      case 'Community': return 1.0;
      case 'Unqualified': return 0;
    }
  };

  // Get tier color
  const getTierColor = (tier: AirdropAllocation['qualificationTier']) => {
    switch (tier) {
      case 'Genesis': return 'text-purple-400';
      case 'Core': return 'text-blue-400';
      case 'Community': return 'text-green-400';
      case 'Unqualified': return 'text-red-400';
    }
  };

  // Check eligibility and calculate allocation
  const checkEligibility = async () => {
    if (!isConnected || !address) {
      showToast('error', 'Wallet Required', 'Please connect your wallet to check eligibility');
      return;
    }

    setIsLoading(true);
    setHasCheckedEligibility(true);

    try {
      // Simulate checking eligibility with blockchain and off-chain data
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate merit scoring (in production, this would call actual APIs/contracts)
      const simulatedScores = {
        early_support: Math.floor(Math.random() * 60 + 20), // 20-80
        github_contributions: Math.floor(Math.random() * 70 + 10), // 10-80
        governance_participation: Math.floor(Math.random() * 50 + 10), // 10-60
        ecosystem_building: Math.floor(Math.random() * 40 + 5), // 5-45
        constitutional_knowledge: Math.floor(Math.random() * 30 + 10) // 10-40
      };

      // Update criteria with simulated scores
      const updatedCriteria = meritCriteria.map(criteria => ({
        ...criteria,
        points: simulatedScores[criteria.id as keyof typeof simulatedScores] || 0,
        verified: simulatedScores[criteria.id as keyof typeof simulatedScores] > 20
      }));

      setMeritCriteria(updatedCriteria);

      // Calculate final allocation
      const totalScore = updatedCriteria.reduce((total, criteria) => {
        return total + (criteria.points * criteria.weight);
      }, 0);

      const tier = getQualificationTier(totalScore);
      const multiplier = getTierMultiplier(tier);
      const baseAllocation = 100; // Base allocation of 100 ARCx tokens
      const claimableTokens = baseAllocation * multiplier;

      setAllocation({
        totalTokens: 50000, // 50K total airdrop pool
        claimableTokens,
        meritScore: totalScore,
        qualificationTier: tier,
        multiplier,
        lockupPeriod: tier === 'Genesis' ? 6 : tier === 'Core' ? 9 : 12,
        vestingSchedule: tier === 'Genesis' ? 'Linear over 18 months' : 
                        tier === 'Core' ? 'Linear over 24 months' : 
                        'Linear over 36 months'
      });

      if (tier === 'Unqualified') {
        showToast('info', 'Not Qualified', 'Your current merit score doesn\'t qualify for the airdrop. Keep contributing to the ecosystem!');
      } else {
        showToast('success', 'Qualified!', `You qualify for ${tier} tier with ${claimableTokens} ARCx tokens`);
      }

    } catch (error) {
      console.error('Eligibility check failed:', error);
      showToast('error', 'Check Failed', 'Failed to check eligibility. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Claim airdrop tokens
  const claimAirdrop = async () => {
    if (!allocation || allocation.qualificationTier === 'Unqualified') return;

    setIsLoading(true);
    try {
      // Simulate claim transaction
      showToast('info', 'Processing Claim', 'Your airdrop claim is being processed...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      showToast('success', 'Claim Successful!', 
        `Successfully claimed ${allocation.claimableTokens} ARCx tokens. Vesting starts immediately.`);
      
    } catch (error) {
      console.error('Claim failed:', error);
      showToast('error', 'Claim Failed', 'Failed to claim airdrop. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalMeritScore = calculateMeritScore();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="border border-indigo-500/30 bg-indigo-500/10 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse"></div>
          <h2 className="text-2xl font-light tracking-wide text-indigo-400">
            Smart Airdrop
          </h2>
          <div className="text-sm text-white/60 bg-black/30 px-2 py-1 rounded">
            Merit-Based
          </div>
        </div>
        
        <p className="text-white/70 font-light tracking-wide mb-4">
          ARCx Smart Airdrop uses constitutional intelligence to evaluate community contributions 
          and technical merit. Allocations are based on verifiable on-chain and off-chain activities.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Total Pool</div>
            <div className="text-white font-light">50,000 ARCx</div>
          </div>
          <div className="text-center">
            <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Method</div>
            <div className="text-indigo-400 font-light">Merit-Based</div>
          </div>
          <div className="text-center">
            <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Criteria</div>
            <div className="text-white font-light">5 Categories</div>
          </div>
          <div className="text-center">
            <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Status</div>
            <div className="text-green-400 font-light">LIVE</div>
          </div>
        </div>
      </div>

      {/* Eligibility Check */}
      {!hasCheckedEligibility && (
        <div className="text-center p-8 border border-white/10">
          <h3 className="text-xl font-light tracking-wide mb-4">
            Check Your Eligibility
          </h3>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Connect your wallet to evaluate your merit score based on community contributions, 
            technical work, governance participation, and constitutional intelligence understanding.
          </p>
          
          <button
            onClick={checkEligibility}
            disabled={!isConnected || isLoading}
            className="px-8 py-3 border border-indigo-500/50 bg-indigo-500/20 hover:bg-indigo-500/30 
                     transition-all text-indigo-400 font-light tracking-wide disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                Analyzing Merit...
              </span>
            ) : (
              'Check Eligibility'
            )}
          </button>
        </div>
      )}

      {/* Merit Criteria Results */}
      {hasCheckedEligibility && (
        <div className="space-y-4">
          <h3 className="text-xl font-light tracking-wide">Merit Evaluation Results</h3>
          
          {/* Overall Score */}
          <div className="bg-black/20 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70">Overall Merit Score</span>
              <span className="text-xl font-light text-white">
                {totalMeritScore.toFixed(1)}/100
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(totalMeritScore, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Individual Criteria */}
          <div className="grid gap-3">
            {meritCriteria.map((criteria) => (
              <div key={criteria.id} className="border border-white/10 p-4 bg-black/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      criteria.verified ? 'bg-green-500' : 'bg-gray-500'
                    }`}></div>
                    <span className="font-light">{criteria.name}</span>
                    <span className="text-xs text-white/50 bg-black/30 px-2 py-1 rounded">
                      {criteria.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-light">
                      {criteria.points}/{criteria.maxPoints}
                    </div>
                    <div className="text-xs text-white/50">
                      Weight: {(criteria.weight * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-2">{criteria.description}</p>
                <div className="w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-500 ${
                      criteria.verified ? 'bg-green-500' : 'bg-gray-500'
                    }`}
                    style={{ width: `${(criteria.points / criteria.maxPoints) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Allocation Results */}
          {allocation && (
            <div className="border-2 border-purple-500/50 bg-purple-500/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h3 className="text-xl font-light tracking-wide">
                  Allocation Results
                </h3>
                <div className={`text-sm px-3 py-1 rounded border ${
                  allocation.qualificationTier === 'Genesis' ? 'border-purple-500/50 bg-purple-500/20 text-purple-400' :
                  allocation.qualificationTier === 'Core' ? 'border-blue-500/50 bg-blue-500/20 text-blue-400' :
                  allocation.qualificationTier === 'Community' ? 'border-green-500/50 bg-green-500/20 text-green-400' :
                  'border-red-500/50 bg-red-500/20 text-red-400'
                }`}>
                  {allocation.qualificationTier} Tier
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Claimable</div>
                  <div className="text-2xl font-light text-white">
                    {allocation.claimableTokens.toLocaleString()}
                  </div>
                  <div className="text-xs text-white/60">ARCx tokens</div>
                </div>
                <div className="text-center">
                  <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Multiplier</div>
                  <div className="text-xl font-light text-purple-400">
                    {allocation.multiplier}x
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Lockup</div>
                  <div className="text-xl font-light text-white">
                    {allocation.lockupPeriod}m
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-white/50 text-xs uppercase tracking-wide mb-1">Vesting</div>
                  <div className="text-sm font-light text-white/70">
                    {allocation.vestingSchedule}
                  </div>
                </div>
              </div>

              {allocation.qualificationTier !== 'Unqualified' ? (
                <div className="text-center">
                  <button
                    onClick={claimAirdrop}
                    disabled={isLoading}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 
                             border border-purple-500/50 hover:from-purple-500/30 hover:to-indigo-500/30 
                             transition-all text-purple-400 font-light tracking-wide 
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                        Processing Claim...
                      </span>
                    ) : (
                      `Claim ${allocation.claimableTokens} ARCx Tokens`
                    )}
                  </button>
                  
                  <p className="text-xs text-white/60 mt-2 max-w-md mx-auto">
                    Claiming will initiate your vesting schedule. Tokens will be locked for {allocation.lockupPeriod} months, 
                    then vest {allocation.vestingSchedule.toLowerCase()}.
                  </p>
                </div>
              ) : (
                <div className="text-center p-4 border border-red-500/20 bg-red-500/5">
                  <h4 className="text-red-400 font-light mb-2">Not Qualified</h4>
                  <p className="text-sm text-white/60">
                    Your current merit score of {totalMeritScore.toFixed(1)} doesn't meet the minimum 
                    threshold of 30 points. Keep contributing to the ARCx ecosystem to improve your score!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Info Footer */}
      <div className="text-center text-xs text-white/40 border-t border-white/10 pt-4">
        <p>
          Smart Airdrop allocations are determined by the ADAM Protocol's constitutional intelligence engine. 
          Merit scores are calculated using verifiable on-chain and off-chain data sources.
        </p>
      </div>
    </div>
  );
};

export default SmartAirdrop;
