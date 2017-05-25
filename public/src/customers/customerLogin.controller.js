(function () {
'use strict';

angular.module('hsp')
.controller('CustomerLoginController', CustomerLoginController);

CustomerLoginController.$inject = ['CustomerService', '$state'];
function CustomerLoginController (CustomerService, $state) {
    var ctrl = this;
    ctrl.option = '';
    ctrl.value = '';

    ctrl.Submit = function () {
        var prop = ctrl.option;
        console.log('Prop: ', ctrl.option, 'Value:', ctrl.value);

        // Make GET request and retrieve customer data
        CustomerService.getCustomerInfo(ctrl.option, ctrl.value)
        .then (function (info) {
            $state.go('customerInfo', {"info": info});
        })
        .catch (function (error) {
            alert('Error: ' + error.message);
            $state.go('customerLogin');
        });
    };
};

})();
