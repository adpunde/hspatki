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
            if (!tin)
                alert('Error updating database');
            else
                alert('Data uploaded successfully !');
            $state.go('customerLogin');
        });
    };
};

})();
