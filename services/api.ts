
import { supabase } from './supabase';
import { PoolType } from '../types';

export interface PoolCreationData {
  name: string;
  type: PoolType | string;
  contributionAmount: number;
  members: string[];
}

/**
 * Validates Trust Scores via Supabase RPC.
 */
export const validateTrustScores = async (memberEmails: string[]) => {
  try {
    const { data, error } = await supabase
      .rpc('validate_trust_scores', { member_emails: memberEmails });

    if (error) {
      console.error('Database RPC error:', error.message);
      return {}; 
    }
    
    if (!data || data.length === 0) return {};

    return data.reduce((acc: any, curr: any) => {
      acc[curr.email] = curr.score;
      return acc;
    }, {} as Record<string, number>);
  } catch (err) {
    console.error('Trust validation unreachable:', err);
    return {};
  }
};

/**
 * Currency Conversion Mock for Diaspora Members
 * In production, this would fetch from an FX API like ExchangeRate-API
 */
export const getExchangeRates = async () => {
  // Simulating an API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    ZAR: 1,
    USD: 0.053, // R 1 = $ 0.053
    GBP: 0.042, // R 1 = £ 0.042
    EUR: 0.049  // R 1 = € 0.049
  };
};

export const formatCurrency = (amount: number, currency: string = 'ZAR', rates: Record<string, number> = { ZAR: 1 }) => {
  const rate = rates[currency] || 1;
  const converted = amount * rate;
  
  const symbols: Record<string, string> = { ZAR: 'R ', USD: '$ ', GBP: '£ ', EUR: '€ ' };
  const symbol = symbols[currency] || 'R ';

  return `${symbol}${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const createPoolRecord = async (poolData: PoolCreationData) => {
  const { data, error } = await supabase
    .from('pools')
    .insert([
      {
        name: poolData.name,
        type: poolData.type,
        contribution_amount: poolData.contributionAmount,
        members: poolData.members,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create pool: ${error.message}`);
  }
  return data;
};

export const saveSignedConstitution = async (signatureData: {
  poolId: string;
  legalName: string;
  constitutionText: string;
  trustScores?: any;
}) => {
  const { data, error } = await supabase
    .from('pool_constitutions')
    .insert([
      {
        pool_id: signatureData.poolId,
        constitution_text: signatureData.constitutionText,
        signer_name: signatureData.legalName,
        trust_data: signatureData.trustScores,
        signature_date: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw new Error(`Agreement signing failed: ${error.message}`);
  return data;
};

export const calculatePenalty = (dueDate: string, amount: number): number => {
  const due = new Date(dueDate);
  const now = new Date();
  if (now > due) {
    const daysLate = Math.ceil((now.getTime() - due.getTime()) / (1000 * 3600 * 24));
    const penaltyRate = daysLate > 3 ? 0.10 + (daysLate * 0.01) : 0.10;
    return amount * penaltyRate;
  }
  return 0;
};

/**
 * Process Contribution with simulated Webhook Handshake
 */
export const processContribution = async (poolId: string, amount: number, proofUrl: string, method: string = 'Bank') => {
  let delay = 2000;
  let status: 'Pending' | 'Verified' = 'Pending';

  if (method === 'PayShap') {
    delay = 1500;
    status = 'Verified'; // PayShap is instant
  } else if (method === 'PayJustNow') {
    delay = 3000;
    status = 'Verified';
  } else {
    delay = 2000;
    status = 'Pending'; // Traditional Bank needs Admin approval
  }

  await new Promise(resolve => setTimeout(resolve, delay));
  
  return { 
    success: true, 
    transactionId: `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    totalProcessed: amount,
    method: method,
    status: status,
    timestamp: new Date().toISOString()
  };
};

/**
 * Tiered Advance Request Logic
 */
export const requestUbuntuAdvance = async (userId: string, poolId: string, totalPotentialPayout: number, trustScore: number, isManaged: boolean) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!isManaged) {
    return {
      success: false,
      message: "Advance Declined: Only 'Managed Accounts' are eligible for automated payout swaps.",
      eligibleAmount: 0
    };
  }

  let eligibilityPercent = 0;
  let tierLabel = 'Tier 4 (Poor)';

  if (trustScore >= 900) {
    eligibilityPercent = 0.75;
    tierLabel = 'Tier 1 (Exceptional)';
  } else if (trustScore >= 700) {
    eligibilityPercent = 0.50;
    tierLabel = 'Tier 2 (Good)';
  } else if (trustScore >= 500) {
    eligibilityPercent = 0.25;
    tierLabel = 'Tier 3 (Fair)';
  }

  const maxAdvance = totalPotentialPayout * eligibilityPercent;

  if (maxAdvance > 0) {
    return {
      success: true,
      message: `Advance Approved! Based on your ${tierLabel} score of ${trustScore}, we have unlocked early liquidity.`,
      advanceId: `ADV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      eligibleAmount: maxAdvance,
      tier: tierLabel
    };
  } else {
    return {
      success: false,
      message: `Advance Declined: Your Ubuntu Score (${trustScore}) is currently below the community trust threshold (500).`,
      eligibleAmount: 0
    };
  }
};
