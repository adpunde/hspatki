(function () {
'use strict';

angular.module('hsp')
.config(config);

config.$inject = ['$urlRouterProvider', '$stateProvider'];
function config ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise ('/');

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'views/home.html'
    })
    .state('customers', {
        url: '/customers',
        templateUrl: 'views/customers.html',
        controller: 'CustomersController',
        controllerAs: 'CustomersController'
    });

}

})();
