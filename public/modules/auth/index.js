(function(){
	'use strict';

	angular.module('authService', ['ngRoute'])
    
    .factory('Auth', function($http, $q, $window, AuthToken) {
        
        var authFactory = {};
        
        authFactory.login = function(code) {
            return $http.post('/api/v1/auth', {
                code: code
            })
            .success(function(data) {
                AuthToken.setToken(data);
                return data;
            })
            .error(function(status){
                return status;
            });
        };
        
        authFactory.resetToken = function(code) {
            return $http.get('/api/v1/auth/reset')
            .success(function(data) {
                AuthToken.setToken(data);
                return data;
            })
            .error(function(status){
                console.log("Error reseteando TOKEN", status);
            });
        };
        
        authFactory.logout = function() {
            AuthToken.setToken();
        };
        
        authFactory.isLoggedIn = function() {
            if (AuthToken.getToken())
                return true;
            else
                return false;
        };
        
        return authFactory;
    })
    .factory('AuthToken', function($window) {
        
        var authTokenFactory = {};
        
        authTokenFactory.getToken = function() {
            return $window.localStorage.getItem('token');
        };
        
        authTokenFactory.setToken = function(token) {
            if (token){
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        };
        
        return authTokenFactory;
    })
    .factory('AuthInterceptor', function($q, $window, $location, AuthToken) {
        
        var interceptorFactory = {};
        
        interceptorFactory.request = function(config) {
            
            var token = AuthToken.getToken();
            
            if (token)
                config.headers['x-access-token'] = token;
            
            return config;
        };
        
        interceptorFactory.responseError = function(response) {
            
            console.log("ResponseError", response);
            
            if (response.status == 401) {
                AuthToken.setToken();
                if (response.data == "oauth_access_token_expired"){
                    AuthToken.resetToken()
                    .succes(function(data){
                        console.log("TOKEN RESETEADO");
                        return $q.reject("TOKEN RESETEADO");
                    })
                    .error(function(status){
                        console.log("NO REGENERÓ TOKE", status);
                        return $q.reject("ERROR por favor reiniciar sesion");
                    });
                }
            } else {
                return $q.reject(response);
            }
        };
        
        return interceptorFactory;
    });
}());