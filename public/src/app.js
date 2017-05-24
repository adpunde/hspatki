(function () {
'use strict';

angular.module('hsp', ['ui.router'])
.config(config)
.constant('AdminLoginTimeout', (5 * 60 * 1000));

config.$inject = ['$urlRouterProvider', '$stateProvider'];
function config ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise ('/');

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: 'src/home/home.view.html'
    })
    .state('customerLogin', {
        url: '/customerLogin',
        templateUrl: 'src/customers/customerLogin.view.html',
        controller: 'CustomerLoginController',
        controllerAs: 'ctrl'
    })
    .state('customerInfo', {
        templateUrl: 'src/customers/customerInfo.view.html',
        controller: 'CustomerInfoController',
        controllerAs: 'ctrl',
        params: {
            info: null
        },
        resolve: {
            info: ['$stateParams', function ($stateParams) {
                return $stateParams.info;
            }]
        }
    })
    .state('adminLogin', {
        url: '/admin',
        templateUrl: 'src/admin/adminLogin.view.html',
        controller: 'AdminLoginController',
        controllerAs: 'adminCtrl'
    })
    .state('adminInfo', {
        templateUrl: 'src/admin/adminInfo.view.html',
        controller: 'AdminInfoController',
        controllerAs: 'ctrl'
    })
    .state('adminNewCustomer', {
        templateUrl: 'src/admin/adminNewCustomer.view.html',
        controller: 'AdminNewCustomerController',
        controllerAs: 'ctrl'
    });
}

})();
