// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services', 'starter.directives','ngStorage','ngCordova','ionic-datepicker'])

.run(function($ionicPlatform,$rootScope,$localStorage) {

  $rootScope.$storage = $localStorage;
  
  $ionicPlatform.ready(function() {
   
    if(window.Connection) {
      if(navigator.connection.type == Connection.NONE) {
        $ionicPopup.alert({
          title: 'Bucacompras',
          content: 'Verifica la conexion a internet'
        })
      }
    }

   var notificationOpenedCallback = function(jsonData) {
      console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
      if(jsonData.additionalData){
        console.log(jsonData.additionalData.url);
        $rootScope.$storage.urlPedido = jsonData.additionalData.url;
      }
    };
    
    if (window.plugins) {
      window.plugins.OneSignal.init("361c9188-938b-47ba-bcc0-4c73217761a4",
                                   {googleProjectNumber: "1000959567882"},
                                   notificationOpenedCallback);

      OneSignal.setLogLevel(OneSignal.LOG_LEVEL.DEBUG, OneSignal.LOG_LEVEL.DEBUG);
    
      // Show an alert box if a notification comes in when the user is in your app.
      window.plugins.OneSignal.enableInAppAlertNotification(true);
      window.plugins.OneSignal.sendTag("type", "cliente");
    }
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

   .state('start', {
    cache: false,
    url: '/start',
    abstract: true,
    templateUrl: 'templates/start.html'
  })

  .state('start.splash', {
    cache: false,
    url: '/splash',
    views: {
      'SplashContent': {
        templateUrl: 'templates/splash.html',
        controller: 'SplashCtrl'
      }
    }
  }) 
  .state('login', {
        cache: false,
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
   })

  .state('app', {
    cache: false,
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })
   .state('app.home', {
      cache: false,
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'homeCtrl'
        }
      }
    })

//obsequio   
      .state('app.obsequio', {
      cache: false,
      url: '/obsequio',
      views: {
        'menuContent': {
          templateUrl: 'templates/obsequio.html',
          controller: 'obsequioCtrl'
        }
      }
    })

    .state('app.detalleobsequio', {
    cache: false,
    url: '/detalleobsequio/:iddetalle',
    views: {
      'menuContent': {
       templateUrl: 'templates/obsequio-detalle.html',
       controller: 'detalleobsequioCtrl'
      }
    }
    })
//*obsequio


//devoluciones
    .state('app.devolucion', {
    cache: false,
    url: '/devolucion',
    views: {
      'menuContent': {
      templateUrl: 'templates/devolucion.html',
      controller: 'devolucionCtrl'
      }
    }
    })

    .state('app.detalledevolucion', {
    cache: false,
    url: '/detalledevolucion/:iddetalle',
    views: {
      'menuContent': {
      templateUrl: 'templates/devolucion-detalle.html',
      controller: 'detalledevolucionCtrl'
      }
    }
    })
//*devoluciones


//situaciones
    .state('app.situaciones', {
    cache: false,
    url: '/situaciones',
    views: {
      'menuContent': {
      templateUrl: 'templates/situaciones.html',
      controller: 'situacionesCtrl'
      }
    }
    })

    .state('app.detallesituaciones', {
    cache: false,
    url: '/detallesituaciones/:iddetalle',
    views: {
      'menuContent': {
      templateUrl: 'templates/situaciones-detalle.html',
      controller: 'detallesituacionesCtrl'
      }
    }
    })

//*situaciones

//seguimiento
    .state('app.seguimiento', {
    cache: false,
    url: '/seguimiento',
    views: {
      'menuContent': {
      templateUrl: 'templates/seguimiento.html',
      controller: 'seguimientoCtrl'
      }
    }
    })

    .state('app.detalleseguimiento', {
    cache: false,
    url: '/detalleseguimiento/:iddetalle',
    views: {
      'menuContent': {
      templateUrl: 'templates/seguimiento-detalle.html',
      controller: 'detalleseguimientoCtrl'
      }
    }
    })

//*seguimiento

  .state('app.perfil', {
    cache: false,
      url: '/perfil',
      views: {
        'menuContent': {
         templateUrl: 'templates/perfil.html',
         controller: 'perfilCtrl'
        }
      }
    })
  .state('app.detalle', {
      cache: false,
      url: '/detalle/:iddetalle',
      views: {
        'menuContent': {
         templateUrl: 'templates/detalle.html',
         controller: 'detalleCtrl'
        }
      }
    });
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/start/splash');
});
