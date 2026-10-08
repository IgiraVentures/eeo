import type { CorridorStatus, EndowmentDomainId } from "./endowmentTaxonomy";

export type CorridorAuthorizationDecision = "undecided" | "go" | "pause" | "stop";
export type CorridorSourceInventoryStatus = "not_started" | "partial" | "reviewed";
export type CorridorLicenseUseBasisStatus = "unresolved" | "partial" | "reviewed";
export type CorridorEvidenceCoverageStatus = "insufficient" | "partial" | "sufficient";

export interface CorridorTimeBoundary {
  start?: string;
  end?: string;
  basis: string;
}

export interface CorridorCharterBoundary {
  geographicBoundarySummary: string;
  jurisdictions: string[];
  rightsHolderScope: string[];
  timePeriod: CorridorTimeBoundary;
  upstreamStart: string;
  downstreamStop: string;
  explicitExclusions: string[];
  unresolvedBoundaryQuestions: string[];
}

export interface CorridorCharter {
  id: string;
  version: string;
  corridorCaseId: string;
  title: string;
  status: CorridorStatus;
  familyId: string;
  primaryDomainId: EndowmentDomainId;
  linkedDomainIds: EndowmentDomainId[];
  commodityFocus: string[];
  publicInterestQuestion: string;
  intendedUsers: string[];
  boundary: CorridorCharterBoundary;
  sourceInventoryStatus: CorridorSourceInventoryStatus;
  licenseUseBasisStatus: CorridorLicenseUseBasisStatus;
  evidenceCoverageStatus: CorridorEvidenceCoverageStatus;
  entityResolutionMethod: string;
  legalSovereigntyPosture: string;
  rightsCommunityConsiderations: string[];
  exposureRiskAssessment: string;
  disclosureTierPlan: string;
  rightOfReplyTriggers: string[];
  correctionWithdrawalProcess: string;
  reviewOwnerRoles: string[];
  authorizationDecision: CorridorAuthorizationDecision;
  unresolvedAuthorizationItems: string[];
  authorizedAt?: string;
  authorizedByRoles?: string[];
  lastUpdated: string;
}
