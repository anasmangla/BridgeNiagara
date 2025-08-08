const Module = require('module');
const originalLoad = Module._load;

Module._load = function(request, parent, isMain) {
  if (request === 'stripe') {
    return function() {
      return {
        checkout: {
          sessions: {
            create: async (params) => {
              const amount = params?.line_items?.[0]?.price_data?.unit_amount;
              if (amount === 999) {
                throw new Error('Stripe API error');
              }
              return { url: 'https://example.com/session/mock' };
            }
          }
        },
        webhooks: {
          constructEvent: (body) =>
            JSON.parse(Buffer.isBuffer(body) ? body.toString() : body)
        }
      };
    };
  }
  return originalLoad(request, parent, isMain);
};
