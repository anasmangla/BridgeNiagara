const Module = require('module');
const originalLoad = Module._load;

Module._load = function(request, parent, isMain) {
  if (request === 'stripe') {
    return function() {
      return {
        checkout: {
          sessions: {
            create: async () => ({ url: 'https://example.com/session/mock' })
          }
        }
      };
    };
  }
  return originalLoad(request, parent, isMain);
};
