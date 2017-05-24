(function () {
'use strict';

angular.module('hsp')
.controller('AdminInfoController', AdminInfoController);

AdminInfoController.$inject = ['AdminService', '$state', '$timeout',
    'AdminLoginTimeout'];
function AdminInfoController (AdminService, $state, $timeout, AdminLoginTimeout) {
    var ctrl = this;

    ctrl.download = function () {
        AdminService.getAllCustomerInfo()
        .then (function (data) {
            console.log('File downloaded');
        })
        .catch (function (error) {
            alert('Failed to download file');
        });
    };

    ctrl.add = function () {
        $state.go('adminNewCustomer');
    };

    $timeout(function () { $state.go('adminLogin'); }, AdminLoginTimeout);
};

})();
