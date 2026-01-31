import { useSubscription } from "@/contexts/SubscriptionContext";
import { useTrial } from "@/contexts/TrialContext";

/**
 * Centralizes the "premium access" rule:
 * - Users outside paid regions get premium access for free.
 * - Users in paid regions get premium access while trial is active OR when subscribed.
 * - After trial expires (and not subscribed), premium features are locked.
 */
export function usePremiumAccess() {
  const { isSubscribed, isInPaidRegion } = useSubscription();
  const { isTrialActive, isTrialExpired } = useTrial();

  const hasPremiumAccess = !isInPaidRegion || isSubscribed || isTrialActive;
  const isPremiumLocked = isInPaidRegion && !isSubscribed && isTrialExpired;

  return { hasPremiumAccess, isPremiumLocked, isInPaidRegion, isSubscribed, isTrialActive, isTrialExpired };
}

