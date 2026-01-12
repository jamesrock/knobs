import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

class PurchaseManager {
  premiumProductId = 'me.jamesrock.knobs.pro';
  supported = false;
  name = '{name}';
  price = '{price}';

  async initializeStore() {
    try {
      
      const { isBillingSupported } = await NativePurchases.isBillingSupported();
      if (!isBillingSupported) {
        throw new Error('Billing not supported on this device');
      };

      this.supported = true;

      await this.loadProducts();
      
    }
    catch (error) {
      console.error('Store initialization failed:', error);
    };
  };

  async loadProducts() {
    try {
      
      const { product } = await NativePurchases.getProduct({
        productIdentifier: this.premiumProductId,
        productType: PURCHASE_TYPE.INAPP
      });

      this.name = product.title;
      this.price = product.priceString;
      this.label = `${this.name} ${this.price}`;

      console.log(this.label);
      
    }
    catch (error) {
      console.error('Failed to load products:', error);
      throw error;
    };
  };

  // Purchase one-time product (no planIdentifier needed)
  async purchaseInAppProduct(success) {
    try {
      console.log('Starting in-app purchase...');
      
      const result = await NativePurchases.purchaseProduct({
        productIdentifier: this.premiumProductId,
        productType: PURCHASE_TYPE.INAPP,
        quantity: 1
      });
      
      console.log('In-app purchase successful!', result.transactionId);
      success();
      
    } catch (error) {
      console.error('In-app purchase failed:', error);
      this.handlePurchaseError(error);
    }
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
};

export const purchaseManager = new PurchaseManager();
purchaseManager.initializeStore();

// purchaseManager.purchaseInAppProduct();
// purchaseManager.restorePurchases();
// purchaseManager.openSubscriptionManagement();
