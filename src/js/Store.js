import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

class Store {
  premiumProductId = 'me.jamesrock.knobs.pro';

  async checkSupport() {
      
    return NativePurchases.isBillingSupported();
    
  };

  async fetchProduct() {
      
    return NativePurchases.getProduct({
      productIdentifier: this.premiumProductId,
      productType: PURCHASE_TYPE.INAPP
    });
    
  };

  async purchaseProduct() {
      
    return NativePurchases.purchaseProduct({
      productIdentifier: this.premiumProductId,
      productType: PURCHASE_TYPE.INAPP,
      quantity: 1
    });
    
  };

  async restorePurchases() {
      
    return NativePurchases.restorePurchases();
      
  };
  
};

export const store = new Store();
