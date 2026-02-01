import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTrial } from '@/contexts/TrialContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { SUBSCRIPTION_PRODUCTS } from '@/constants/subscriptions';
import { Check, X } from 'lucide-react-native';

export default function PaywallScreen() {
  const router = useRouter();
  const { isTrialExpired } = useTrial();
  const { offerings, purchase, restorePurchases, isSubscribed, isLoading } = useSubscription();
  
  const [isPurchasing, setIsPurchasing] = useState(false);
  const premiumProductId = SUBSCRIPTION_PRODUCTS.PREMIUM;
  const premiumMatchIds = [premiumProductId, `${premiumProductId}:yearly`];

  const matchesPremium = (p: any) => {
    const pkgId = String(p?.identifier ?? '');
    const productId = String(p?.product?.identifier ?? '');
    return premiumMatchIds.includes(pkgId) || premiumMatchIds.includes(productId);
  };

  const getAllAvailablePackages = (): any[] => {
    if (!offerings) return [];

    const fromCurrent: any[] = (offerings as any)?.current?.availablePackages ?? [];
    const fromAllOfferingsObj: any =
      (offerings as any)?.all ??
      (offerings as any)?.offerings ??
      {};
    const fromAll: any[] = Object.values(fromAllOfferingsObj).flatMap((o: any) => o?.availablePackages ?? []);

    const merged = [...fromCurrent, ...fromAll];
    const seen = new Set<string>();
    return merged.filter((p: any) => {
      const key = `${p?.identifier ?? ''}:${p?.product?.identifier ?? ''}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  // If user is subscribed, go back
  React.useEffect(() => {
    if (isSubscribed) {
      router.back();
    }
  }, [isSubscribed]);

  const handlePurchase = async () => {
    if (!offerings) return;
    
    setIsPurchasing(true);
    
    try {
      // Find the selected package (RevenueCat package identifiers and store product identifiers
      // are not always the same, so check both).
      const allPackages = getAllAvailablePackages();
      const pkg = allPackages.find(matchesPremium);
      
      if (pkg) {
        const success = await purchase(pkg);
        if (success) {
          router.back();
        }
      } else {
        Alert.alert(
          "Unable to load Premium",
          "We couldn't find the Premium subscription in the store. Please try again in a moment.",
          [{ text: "OK" }]
        );
        console.warn(
          '❌ Selected package not found in current offering.',
          JSON.stringify(
            {
              premiumProductId,
              premiumMatchIds,
              availablePackages: getAllAvailablePackages().map((p) => ({
                packageIdentifier: p.identifier,
                productIdentifier: p.product.identifier,
              })),
            },
            null,
            2
          )
        );
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      const success = await restorePurchases();
      if (success) {
        router.back();
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2A9D8F" />
      </View>
    );
  }

  const premiumPkg = offerings
    ? getAllAvailablePackages().find(matchesPremium)
    : null;
  const premiumPrice = premiumPkg?.product?.priceString ?? "$9.99";

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#2A9D8F', '#264653']}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Close */}
          <View style={styles.closeRow}>
            <TouchableOpacity
              onPress={() => router.back()}
              accessibilityRole="button"
              accessibilityLabel="Close paywall"
              style={styles.closeButton}
              activeOpacity={0.8}
            >
              <X size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.emoji}>🍃</Text>
            <Text style={styles.title}>
              {isTrialExpired ? 'Your 7-Day Trial Has Ended' : 'Upgrade to Premium'}
            </Text>
            <Text style={styles.subtitle}>
              Continue your spiritual journey
            </Text>
            <Text style={styles.familySharing}>
              👥 Share with up to 6 family members
            </Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <Feature text="Daily Devotionals" />
            <Feature text="All Bible translations" />
            <Feature text="AI Therapy" />
            <Feature text="Worship Music" />
            <Feature text="Prayer Guidance" />
            <Feature text="Study Plans" />
          </View>

          <Text style={styles.freeNote}>
            Free forever: Daily Devotionals, Prayer Guidance, and KJV Bible.
          </Text>

          {/* Subscription Options */}
          <View style={styles.plans}>
            <View style={[styles.planCard, styles.planCardSelected]}>
              <View style={styles.planHeader}>
                <View style={styles.planInfo}>
                  <Text style={styles.planName}>Premium - {premiumPrice}/year</Text>
                  <Text style={styles.planDetail}>7-day free trial • Cancel anytime</Text>
                </View>
                <View style={styles.bestValue}>
                  <Text style={styles.bestValueText}>Premium</Text>
                </View>
              </View>
              <Text style={styles.familyBadge}>👥 Family</Text>
            </View>
          </View>

          {/* Subscribe Button */}
          <TouchableOpacity
            style={[styles.subscribeButton, isPurchasing && styles.subscribeButtonDisabled]}
            onPress={handlePurchase}
            disabled={isPurchasing}
            activeOpacity={0.8}
          >
            {isPurchasing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.subscribeButtonText}>✓ Start Premium</Text>
            )}
          </TouchableOpacity>

          {/* Restore Button */}
          <TouchableOpacity
            style={styles.restoreButton}
            onPress={handleRestore}
            disabled={isPurchasing}
          >
            <Text style={styles.restoreButtonText}>Restore Purchases</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>
            Auto-renews unless cancelled
          </Text>
          <View style={styles.links}>
            <TouchableOpacity onPress={() => router.push('/terms')}>
              <Text style={styles.link}>Terms of Service</Text>
            </TouchableOpacity>
            <Text style={styles.linkDivider}>•</Text>
            <TouchableOpacity onPress={() => router.push('/privacy')}>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const Feature = ({ text }: { text: string }) => (
  <View style={styles.feature}>
    <Check size={20} color="#4ECDC4" strokeWidth={3} />
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  closeRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 16,
  },
  familySharing: {
    fontSize: 15,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  features: {
    marginBottom: 32,
  },
  freeNote: {
    marginTop: -12,
    marginBottom: 24,
    textAlign: "center",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "600",
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  featureText: {
    fontSize: 17,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
  plans: {
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planCardSelected: {
    borderColor: '#4ECDC4',
    backgroundColor: 'rgba(78, 205, 196, 0.15)',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4ECDC4',
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planDetail: {
    fontSize: 14,
    color: '#4ECDC4',
    marginTop: 2,
  },
  bestValue: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#264653',
  },
  familyBadge: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  subscribeButton: {
    backgroundColor: '#4ECDC4',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  subscribeButtonDisabled: {
    opacity: 0.6,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#264653',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  footer: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.6,
    textAlign: 'center',
    marginTop: 24,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  link: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  linkDivider: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.8,
    marginHorizontal: 8,
  },
});
