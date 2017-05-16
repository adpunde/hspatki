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
        controllerAs: 'ctrl'
    })
    .state('transactions', {
        url: '/transactions',
        templateUrl: 'views/transactions.html',
        controller: 'TransactionsController',
        controllerAs: 'ctrl'
    })
    .state('transaction-add', {
        templateUrl: 'views/transaction-add.html',
        controller: 'TransactionAddController',
        controllerAs: 'ctrl'
    })
    .state('transaction-contact', {
        url: '/transactions/{tin}',
        templateUrl: 'views/transaction-contact.html',
        controller: 'TransactionContactController',
        controllerAs: 'ctrl',
        resolve: {
            tin: [ '$stateParams', function ($stateParams) {
                console.log('TransactionContactController', $stateParams.tin);
                if (contactObj[$stateParams.tin])
                    return $stateParams.tin;
                return null;
            }]
        }
    });
}

})();
