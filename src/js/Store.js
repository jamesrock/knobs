import { NativePurchases, PURCHASE_TYPE } from '@capgo/native-purchases';

class Store {
  premiumProductId = 'me.jamesrock.knobs.pro';

  async checkSupport() {
      
    return NativePurchases.isBillingSupported();
    
  };

  async getProduct() {
      
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

  async getPurchases() {

    return NativePurchases.getPurchases({
      productType: PURCHASE_TYPE.INAPP
    });

  };

  validatePurchase(purchase) {
    
    return purchase.productIdentifier === this.premiumProductId && purchase.ownershipType === 'purchased';

  };
  
};

export const store = new Store();
