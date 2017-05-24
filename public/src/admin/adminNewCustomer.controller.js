(function () {
'use strict';

angular.module('hsp')
.controller('AdminNewCustomerController', AdminNewCustomerController);

AdminNewCustomerController.$inject = ['CustomerService', '$state'];
function AdminNewCustomerController (CustomerService, $state) {
    var ctrl = this;

    ctrl.Submit = function () {
        // Make POST request and update customer data
        CustomerService.addCustomerInfo(ctrl.info)
        .then (function (tin) {
            alert('Data uploaded successfully !');
            $state.go('adminLogin');
        })
        .catch (function (error) {
            alert('Error updating database: ' + error.message);
            $state.go('adminLogin');
        });
    };
};

})();
