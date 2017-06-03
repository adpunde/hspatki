(function () {
'use strict';

angular.module('hsp')
.controller('CustomerLoginController', CustomerLoginController);

CustomerLoginController.$inject = ['CustomerService', '$state', '$rootScope'];
function CustomerLoginController (CustomerService, $state, $rootScope) {
    var ctrl = this;
    ctrl.option = 'tin';
    ctrl.value = '';

    ctrl.Submit = function () {
        // Make GET request and retrieve customer data
        $rootScope.$broadcast('spinner:show', {on: true});
        CustomerService.getCustomerInfo(ctrl.option, ctrl.value)
        .then (function (info) {
            $state.go('customerInfo', {"info": info});
        })
        .catch (function (error) {
            alert('Error: ' + error.message);
            $state.go('customerLogin');
        })
        .finally ( function () {
            $rootScope.$broadcast('spinner:show', {on: false});
        });
    };

};

})();
