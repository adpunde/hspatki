(function () {
'use strict';

angular.module('hsp', ['ui.router'])
.config(config);

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
    .state('admin', {
        url: '/admin',
        templateUrl: 'src/admin/admin.view.html',
        controller: 'AdminController',
        controllerAs: 'adminCtrl'
    });
    // .state('transactions', {
    //     url: '/transactions',
    //     templateUrl: 'views/transactions.html',
    //     controller: 'TransactionsController',
    //     controllerAs: 'ctrl'
    // })
    // .state('transaction-add', {
    //     templateUrl: 'views/transaction-add.html',
    //     controller: 'TransactionAddController',
    //     controllerAs: 'ctrl'
    // })
    // .state('transaction-contact', {
    //     url: '/transactions/{tin}',
    //     templateUrl: 'views/transaction-contact.html',
    //     controller: 'TransactionContactController',
    //     controllerAs: 'ctrl',
    //     resolve: {
    //         tin: [ '$stateParams', function ($stateParams) {
    //             console.log('TransactionContactController', $stateParams.tin);
    //             if (contactObj[$stateParams.tin])
    //                 return $stateParams.tin;
    //             return null;
    //         }]
    //     }
    // });
}

})();
