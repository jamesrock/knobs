import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

class PurchaseManager {
  // In-app product (one-time purchase)
  premiumProductId = 'com.yourapp.premium_features';
  // Subscription products (require planIdentifier on Android)
  monthlySubId = 'com.yourapp.premium.monthly';
  yearlySubId = 'com.yourapp.premium.yearly';

  async initializeStore() {
    try {
      // 1. Check if billing is supported
      const { isBillingSupported } = await NativePurchases.isBillingSupported();
      if (!isBillingSupported) {
        throw new Error('Billing not supported on this device');
      };

      // 2. Get product information (REQUIRED by Apple - no hardcoded prices!)
      await this.loadProducts();
      
    }
    catch (error) {
      console.error('Store initialization failed:', error);
    };
  };

  async loadProducts() {
    try {
      // Load in-app products
      const { product: premiumProduct } = await NativePurchases.getProduct({
        productIdentifier: this.premiumProductId,
        productType: PURCHASE_TYPE.INAPP
      });
      
      // Load subscription products  
      const { products: subscriptions } = await NativePurchases.getProducts({
        productIdentifiers: [this.monthlySubId, this.yearlySubId],
        productType: PURCHASE_TYPE.SUBS
      });
      
      // Display products with dynamic info from store
      this.displayProducts(premiumProduct, subscriptions);
      
    }
    catch (error) {
      console.error('Failed to load products:', error);
      throw error;
    };
  };

  displayProducts(premiumProduct, subscriptions) {
    
    // Display one-time purchase

    console.log(`${premiumProduct.title} ${premiumProduct.priceString}`);
    console.log(`number of subs: ${subscriptions.length}`);
    
    // Display subscriptions
    subscriptions.forEach(sub => {
      console.log(`${sub.title} ${sub.priceString}`);
    });
    
  };

  // Purchase one-time product (no planIdentifier needed)
  async purchaseInAppProduct() {
    try {
      console.log('Starting in-app purchase...');
      
      const result = await NativePurchases.purchaseProduct({
        productIdentifier: this.premiumProductId,
        productType: PURCHASE_TYPE.INAPP,
        quantity: 1
      });
      
      console.log('In-app purchase successful!', result.transactionId);
      await this.handleSuccessfulPurchase(result.transactionId, 'premium');
      
    } catch (error) {
      console.error('In-app purchase failed:', error);
      this.handlePurchaseError(error);
    }
  };

  async purchaseMonthlySubscription() {
    try {
      console.log('Starting subscription purchase...');

      const result = await NativePurchases.purchaseProduct({
        productIdentifier: this.monthlySubId,
        productType: PURCHASE_TYPE.SUBS,       // REQUIRED for subscriptions
        quantity: 1
      });

      console.log('Subscription purchase successful!', result.transactionId);
      await this.handleSuccessfulPurchase(result.transactionId, 'monthly');

    } catch (error) {
      console.error('Subscription purchase failed:', error);
      this.handlePurchaseError(error);
    }
  };

  async purchaseYearlySubscription() {
    try {
      console.log('Starting yearly subscription purchase...');

      const result = await NativePurchases.purchaseProduct({
        productIdentifier: this.yearlySubId,
        productType: PURCHASE_TYPE.SUBS,       // REQUIRED for subscriptions
        quantity: 1
      });

      console.log('Yearly subscription successful!', result.transactionId);
      await this.handleSuccessfulPurchase(result.transactionId, 'yearly');

    } catch (error) {
      console.error('Yearly subscription failed:', error);
      this.handlePurchaseError(error);
    }
  };

  async handleSuccessfulPurchase(transactionId, purchaseType) {
    // 1. Grant access to premium features
    localStorage.setItem('premium_active', 'true');
    localStorage.setItem('purchase_type', purchaseType);
    
    // 2. Update UI
    const statusText = purchaseType === 'premium' ? 'Premium Unlocked' : `${purchaseType} Subscription Active`;
    // document.getElementById('subscription-status')!.textContent = statusText;
    
    // 3. Optional: Verify purchase on your server
    // await this.verifyPurchaseOnServer(transactionId);
  };

  handlePurchaseError(error) {
    // Handle different error scenarios
    if (error.message.includes('User cancelled')) {
      console.log('User cancelled the purchase');
    } else if (error.message.includes('Network')) {
      alert('Network error. Please check your connection and try again.');
    } else {
      alert('Purchase failed. Please try again.');
    }
  };

  async verifyPurchaseOnServer(transactionId) {
    try {
      // Send transaction to your server for verification
      const response = await fetch('/api/verify-purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });
      
      const result = await response.json();
      console.log('Server verification:', result);
    } catch (error) {
      console.error('Server verification failed:', error);
    }
  };

  async restorePurchases() {
    try {
      await NativePurchases.restorePurchases();
      console.log('Purchases restored successfully');

      // Check if user has active premium after restore
      const product = await this.getProductInfo();
      // Update UI based on restored purchases

    } catch (error) {
      console.error('Failed to restore purchases:', error);
    }
  };

  async openSubscriptionManagement() {
    try {
      await NativePurchases.manageSubscriptions();
      console.log('Opened subscription management page');
    } catch (error) {
      console.error('Failed to open subscription management:', error);
    }
  };
}

// Usage in your app
export const purchaseManager = new PurchaseManager();

// Initialize when app starts
purchaseManager.initializeStore();

// purchaseManager.purchaseYearlySubscription();
// purchaseManager.purchaseInAppProduct();
// purchaseManager.purchaseMonthlySubscription();
// purchaseManager.restorePurchases();
// purchaseManager.openSubscriptionManagement();

