export type ApiOptions = {
  simpleToken?: string;
  bearerToken?: string;
  clientKey?: string;
  clientSecret?: string;
  autoReauth?: boolean;
};

export type ISimpleAuthentication = IResponsePostAuthentication;
export type IClientAuthentication = IResponsePostAuthentication;
export interface IResponsePostAuthentication {
  /**
   * Token to be provided with all api requests in the form of a bearer token authorization header.
   * See https://tools.ietf.org/html/rfc6750 for more details.
   */
  bearer_token: string;
  /**
   * Timestamp, in UTC, after which a new bearer token will have to be obtained or all requests will result in a 401 Unauthorized.
   */
  expiration: ReturnType<typeof Date>;
  /**
   * Ticks before the bearer token will expire.
   */
  ticks: number;
}

export interface IResponseGetPreferences {
  /**
   * Determines whether or not surge price blocking is enabled.
   * You will unable to complete verifications if the prices are in surge when this option is on.
   */
  blockSurgePricing: boolean;
  /**
   * Determines whether or not area code filtering is enabled.
   */
  areaCodeFilterEnabled: boolean;
  /**
   * These are the area code filters that will be applied to your account.
   */
  areaCodeFilters: string[];
}

export interface IResponseGetPreferencesAreaCodes {
  /**
   * These are the area codes that are accepted.
   */
  acceptableAreaCodes: string[];
}

export enum TargetStatus {
  NotAvailable = 1,
  Available = 4,
  SurgePricingBlocked = 8,
  QuotaExceeded = 128,
}

export enum PricingMode {
  Default = 1,
  Surge = 2,
  Free = 4,
  Premium = 8,
  Adjusted = 16,
  Filtered = 32,
  Discounted = 64,
}

export interface IResponseGetTarget {
  targetId: number;
  name: string;
  normalizedName: string;
  cost: number;
  status: TargetStatus;
  pricingMode: PricingMode;
}

export interface IResponseGetUser {
  /**
   * Current username.
   */
  username?: string;
  /**
   * Current credit balance.
   */
  credit_balance: number;
}

export enum VerificationsStatus {
  /**
   * Waiting for SMS
   */
  Pending = 'Pending',
  /**
   * SMS received
   */
  Completed = 'Completed',
  /**
   * Verification expired
   */
  TimedOut = 'Timed Out',
  /**
   * Verification was reported by user
   */
  Reported = 'Reported',
  /**
   * Verification was cancelled by user or system
   */
  Cancelled = 'Cancelled',
}

export interface IResponseGetVerifications {
  /**
   * Unique identifier for the verification.
   */
  id: string;
  /**
   * Cost in credits for the verification.
   */
  cost: number;
  /**
   * The verification target name.
   */
  target_name?: string;
  /**
   * Number assigned to the verification. Provide this to the target service (e.g., Google) you are trying to verify.
   */
  number?: string;
  /**
   * Time remaining before the verification transitions to the "Timed Out" state.
   */
  time_remaining?: string;
  /**
   * Time remaining before the verification can no longer be reused (use the same number again for the same service).
   * Only verifications in the "Completed" state and within the reuse time window can be reused.
   */
  reuse_window?: string;
  /**
   * State of the verification.
   */
  status?: VerificationsStatus;
  /**
   * Contents of the SMS for the verification.
   */
  sms?: string;
  /**
   * Parsed verification code from the SMS.
   */
  code?: string;
  /**
   * Uri for the verification resource.
   */
  verification_uri?: string;
  /**
   * Uri to cancel the verification. Only a verification in the "Pending" state can be cancelled.
   */
  cancel_uri?: string;
  /**
   * Uri to report the verification. Only a verification in the "Pending" state can be reported.
   */
  report_uri?: string;
  /**
   * Uri to reuse the verification with the same number and for the same service.
   * Only a verification in the "Completed" state and within the reuse window can be reused.
   */
  reuse_uri?: string;
}

export interface IResponseGetVerificationsPending {
  /**
   * Unique identifier for the verification.
   */
  id: string;
  /**
   * The verification target id.
   */
  target_id: string;
}
