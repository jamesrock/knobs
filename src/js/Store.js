import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

class Store {
  premiumProductId = 'me.jamesrock.knobs.pro';
  supported = false;
  name = '{name}';
  price = '{price}';

  async initialize() {
    try {
      
      const { isBillingSupported } = await NativePurchases.isBillingSupported();
      if (!isBillingSupported) {
        throw new Error('Billing not supported on this device');
      };

      this.supported = true;

      await this.fetchProduct();
      
    }
    catch (error) {
      console.log('Store initialization failed');
    };
  };

  async fetchProduct() {
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
      
      console.log('Failed to load products');
      throw error;

    };
  };

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
      
    }
    catch(error) {
      this.handlePurchaseError(error);
    }
  };

  handlePurchaseError(error) {
    if(error.message.includes('User cancelled')) {
      console.log('User cancelled the purchase');
    }
    else if(error.message.includes('Network')) {
      alert('Network error. Please check your connection and try again.');
    }
    else {
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
    }
    catch (error) {
      console.log('Server verification failed');
    };
  };

  async restorePurchases() {
    try {
      
      const purchases = await NativePurchases.restorePurchases();
      console.log('Purchases restored successfully', purchases);

      // Check if user has active premium after restore
      // const product = await this.getProductInfo();
      // Update UI based on restored purchases

    }
    catch (error) {
      console.log('Failed to restore purchases');
    };
  };

  async openSubscriptionManagement() {
    try {
      await NativePurchases.manageSubscriptions();
      console.log('Opened subscription management page');
    }
    catch (error) {
      console.log('Failed to open subscription management');
    };
  };
};

export const store = new Store();
store.initialize();
