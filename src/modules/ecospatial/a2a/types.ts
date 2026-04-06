// Actor Types
export type ActorType = "ORGANIZATION" | "AGENT";

export interface Actor {
  id: string;
  address: string;
  actorType: ActorType;
  name?: string;
  erc8004Id?: string;
  commitments: Commitment[];
  totalCommitmentBps: number;
  totalESVEarned: number;
  proposalsSubmitted: number;
  bountiesCompleted: number;
  createdAt: number;
}

// Agent Types
export type AgentType = "MONITORING" | "ECONOMIC" | "SOCIAL" | "SPECIALIST" | "REPRESENTATION";

export type AgentTier = "SPECIES" | "ECOSYSTEM" | "ECONOMIC";

export type AgentStatus = "ACTIVE" | "IDLE" | "OFFLINE";

export interface Agent extends Actor {
  actorType: "AGENT";
  agentType: AgentType;
  tier: AgentTier;
  status: AgentStatus;
  reputationScore: number;
  active: boolean;
  acpServices?: string[];
  virtualBalance?: number;
  bioregion?: {
    id: string;
    name: string;
  };
  yieldDelegation?: number;
  esvStaked: number;
  esvEarned: number;
  actionsCompleted: number;
  /** Optional image URL (e.g. from mock API or CMS) */
  avatar?: string;
  // Soul-related fields
  mission?: string;
  pillarFocus?: "function" | "structure" | "composition" | "holistic";
  speciesRepresented?: string;
  ecosystemType?: string;
}

export interface Commitment {
  id: string;
  actorId: string;
  bioregionId: string;
  percentageBps: number;
  locationProofCID?: string;
  createdAt: number;
  updatedAt: number;
}

// Feed Types
export type FeedEntryType =
  | "COMMITMENT_CREATED"
  | "COMMITMENT_UPDATED"
  | "PROPOSAL_SUBMITTED"
  | "PROPOSAL_FUNDED"
  | "PROPOSAL_SETTLED"
  | "BOUNTY_POSTED"
  | "BOUNTY_CLAIMED"
  | "BOUNTY_COMPLETED"
  | "EII_UPDATED"
  | "YIELD_CAPTURED";

export interface FeedEntry {
  id: string;
  bioregionId: string;
  actor?: Actor;
  entryType: FeedEntryType;
  message: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
  txHash?: string;
}

// Agent type display helpers
export const AGENT_TYPE_LABELS: Record<AgentType, string> = {
  MONITORING: "Monitoring",
  ECONOMIC: "Economic",
  SOCIAL: "Social",
  SPECIALIST: "Specialist",
  REPRESENTATION: "Representation",
};

export const AGENT_TYPE_EMOJIS: Record<AgentType, string> = {
  MONITORING: "\uD83D\uDC41\uFE0F",
  ECONOMIC: "\uD83D\uDCB0",
  SOCIAL: "\uD83D\uDDE3\uFE0F",
  SPECIALIST: "\uD83D\uDD2C",
  REPRESENTATION: "\uD83E\uDDA9",
};

export const STATUS_COLORS: Record<AgentStatus, string> = {
  ACTIVE: "bg-green-500",
  IDLE: "bg-yellow-500",
  OFFLINE: "bg-gray-400",
};
