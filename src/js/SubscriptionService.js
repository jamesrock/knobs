export class SubscriptionService {
  constructor() {

    const {store, ProductType, Platform} = CdvPurchase;

    // Setup receipt validation (recommended)
    // store.validator = "https://validator.iaptic.com/v1/validate?appName=demo&apiKey=12345678";

    // Register products
    store.register([{
      id: 'subscription1',
      platform: Platform.APPLE_APPSTORE,
      type: ProductType.PAID_SUBSCRIPTION
    }]);

    // Setup event handlers
    store.when()
      .productUpdated(() => {
        console.log('Products loaded from the store:', store.products);
        // updateProductsUI();
      })
      .approved(transaction => {
        console.log('Purchase approved:', transaction);
        transaction.verify();
      })
      .verified(receipt => {
        console.log('Purchase verified:', receipt);
        receipt.finish();
        // updateActiveSubscriptionUI();
      });

    // Initialize the store
    store.initialize([{
      platform: Platform.APPLE_APPSTORE,
      options: {
        needAppReceipt: true,
      }
    }]);

  };
  
  subscribe(productId) {
    // Purchase a subscription
    const {store, ErrorCode} = CdvPurchase;
    const product = store.get(productId);
    if (!product) {
      console.log('Product not found');
      return;
    };
    product.getOffer()?.order().then(error => {
      if (error) {
        if (error.code === ErrorCode.PAYMENT_CANCELLED) {
          console.log('Payment cancelled by user');
        }
        else {
          console.log('Failed to subscribe:', error);
        }
      }
    });
  };
  
  hasActiveSubscription() {
    // Check if user has an active subscription
    return store.owned('subscription1');
  };

};