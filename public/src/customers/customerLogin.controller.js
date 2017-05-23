(function () {
'use strict';

angular.module('hsp')
.controller('CustomerLoginController', CustomerLoginController);

CustomerLoginController.$inject = ['CustomerService', '$state'];
function CustomerLoginController (CustomerService, $state) {
    var ctrl = this;
    ctrl.tin = '';

    ctrl.Submit = function () {
        // Make GET request and retrieve customer data
        CustomerService.getCustomerInfo(ctrl.tin)
        .then (function (info) {
            //CustomerService.setInfo(ctrl.tin, info);
            $state.go('customerInfo', {"info": info});
        });
    };
};

})();
