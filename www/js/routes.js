angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  // IMPORTANT: All resolves MUST NOT be async!! Bad ux
  $stateProvider

  // Tabs routes
  .state('tabs', {
    url: '/tabs',
    templateUrl: 'templates/menu.html',
    controller: 'appController',
    abstract: true,
    resolve: {
      initApp: ($auth, $state) => {
        return $auth.validateUser()
          .catch((message) => {console.log(message); $state.go('login', {}, {reload: true})});
      }
    },
  })

  .state('tabs.pending', {
    url: '/pending',
    views: {
      'pending': {
        templateUrl: 'templates/pending.html',
        controller: 'pendingController'
      }
    }
  })

  .state('tabs.accepted', {
    url: '/accepted',
    views: {
      'accepted': {
        templateUrl: 'templates/accepted.html',
        controller: 'acceptedController'
      }
    }
  })

  .state('assistances', {
    url: '/assistances',
    templateUrl: 'templates/assistanceMenu.html',
    controller: 'appController',
    abstract: true,
    resolve: {
      initApp: ($auth, $state) => {
        return $auth.validateUser()
          .catch(() => $state.go('login', {}, {reload: true}));
      }
    },
  })

  .state('assistances.assistanceDetails', {
    url: '/assistances/:id',
    views: {
      'assistanceMenuContent': {
        templateUrl: 'templates/assistanceDetails.html',
        controller: 'assistanceDetailsController'
      }
    },
    resolve: {
      assistance: (Assistance, $stateParams) => Assistance.get($stateParams.id)//,
      //assistanceId: ($stateParams) => $stateParams.id
    }
  })

  .state('assistances.messages', {
    url: '/messages',
    views: {
      'assistanceMenuContent': {
        templateUrl: 'templates/messages.html',
        controller: 'messagesController'
      }
    }
  })


  // Shipments
  .state('tabs.community', {
    url: '/community',
    views: {
      'menuContent': {
        templateUrl: 'templates/shipments.html',
        controller: 'shipmentsCtrl'
      }
    }
  })
  .state('tabs.shipmentDetails', {
    url: '/shipments/:id',
    views: {
      'shipments': {
        templateUrl: 'templates/shipmentDetails.html',
        controller: 'shipmentDetailsCtrl'
      }
    },
    resolve: {
      shipment: (Shipment, $stateParams) => Shipment.get($stateParams.id)
    }
  })
  .state('tabs.shipmentOfferDetails', {
    url: '/shipments/:shipmentId/offers/:offerId',
    views: {
      'shipments': {
        templateUrl: 'templates/offerDetails.html',
        controller: 'offerDetailsCtrl'
      }
    },
    resolve: {
      shipment: (Shipment, $stateParams) => Shipment.get($stateParams.shipmentId),
      offer: (Offer, $stateParams) => Offer.get($stateParams.offerId)
    }
  })

  .state('tabs.help', {
    url: '/help',
    views: {
      'menuContent': {
        templateUrl: 'templates/help.html',
        controller: 'helpController'
      }
    }
  })
  .state('tabs.editProfile', {
    url: '/profile/edit',
    views: {
      'menuContent': {
        templateUrl: 'templates/editProfile.html',
        controller: 'editProfileCtrl'
      }
    }
  })

  // Profile
  // .state('tabs.profile', {
  //   url: '/profile',
  //   views: {
  //     'profile': {
  //       templateUrl: 'templates/profile.html',
  //       controller: 'profileCtrl'
  //     }
  //   }
  // })
  // .state('tabs.editProfile', {
  //   url: '/profile/edit',
  //   views: {
  //     'profile': {
  //       templateUrl: 'templates/editProfile.html',
  //       controller: 'editProfileCtrl'
  //     }
  //   }
  // })
  // Finish Tabs

  // Login
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  // Sign Up
  .state('splash', {
    url: '/splash',
    templateUrl: 'templates/splash.html',
    controller: 'splashCtrl'
  });

  $urlRouterProvider.otherwise('/splash');
});
