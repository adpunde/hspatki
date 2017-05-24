(function () {
'use strict';

angular.module('hsp')
.controller('CustomerInfoController', CustomerInfoController);

CustomerInfoController.$inject = ['info', 'CustomerService', '$state'];
function CustomerInfoController (info, CustomerService, $state) {
    var ctrl = this;
    ctrl.info = info;

    ctrl.Update = function () {
        // Make POST request and update customer data
        CustomerService.updateCustomerInfo(ctrl.info)
        .then (function (tin) {
            alert('Data uploaded successfully !');
            $state.go('customerLogin');
        })
        .catch (function (error) {
            alert('Error updating database: ' + error.message);
            $state.go('customerLogin');
        });
    };
};

})();
