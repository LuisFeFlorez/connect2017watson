'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'authService',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'myApp.Stream',
    'myApp.Blogs',
    'btford.markdown',
    'angularMoment'
]).
config(['$locationProvider', '$routeProvider', '$httpProvider', function($locationProvider, $routeProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('AuthInterceptor');
    
    //$locationProvider.hashPrefix('!');

    $routeProvider
    .when('/auth/ibm-connections-cloud/callback', {
        templateUrl: "view1/view1.html",
	    controller: "CallbackCtrl"
    })
    .when('/auth', {
        templateUrl: "view1/view1.html",
        controller: "AuthCtrl"
    })
    .otherwise({
        redirectTo: "/blogs"
    });
    
    //$locationProvider.html5Mode(true);
}])
.controller("MainCtrl", ['$window', '$scope', '$location', 'Auth',

    function($window, $scope, $location, Auth) {
        
        $scope.init = function(){
            
            try {
                //console.log("Entro a try catch");
                $window.addEventListener('message', function(evt) {
                    $window.localStorage.setItem('infoComunidad', JSON.stringify(evt.data));
                    if ($location.path() != '/auth/ibm-connections-cloud/callback') {
                        if (Auth.isLoggedIn()) {
                            $location.path('/blogs');
                            $scope.$apply();
                        } else {
                            $location.path('/auth');
                            $scope.$apply();
                        }
                    }
                });
		    } catch (e) {
                console.log(e);
            }
            console.log("Community loaded, sending message to get Community info");
            $window.parent.postMessage("appReady", "*");
        }
    }
                         
])
.controller("AuthCtrl", ['$window',
    function($window) {
        $window.location.href = 'https://apps.na.collabserv.com/manage/oauth2/authorize?callback_uri=' +
                        encodeURIComponent('https://connect2017watson.mybluemix.net/#/auth/ibm-connections-cloud/callback') +
                        '&client_id=app_23191556_1487781137152&response_type=code';
    }
])
.controller("CallbackCtrl", ['$routeParams', '$location', 'Auth',
    function($routeParams, $location, Auth){        
        Auth.login($routeParams.code)
        .success(function(){
            $location.path('/blogs');
            $scope.$apply();
        }).error(function(status){
            console.log('There was an error trying to login, ' + status);
        });
    }
])
.controller("HeaderCtrl", ['$scope','$routeParams', '$location',
    function($scope, $routeParams, $location){        
        $scope.isActive = function (viewLocation) { 
            return $location.path().indexOf(viewLocation) == 0;
        };
    }
])
.run(function($rootScope, $window, $location, Auth){
    
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        
  });
 
  $rootScope.$on('$routeChangeSuccess', function(event, nextRoute, currentRoute) {

  });
    
});
