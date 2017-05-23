(function () {
'use strict';

angular.module('hsp')
.controller('AdminInfoController', AdminInfoController);

AdminInfoController.$inject = ['AdminService', '$state', '$http'];
function AdminInfoController (AdminService, $state, $http) {
    var ctrl = this;

    ctrl.download = function () {
        AdminService.getAllCustomerInfo()
        .then (function (data) {
            if (data)
                console.log('Data received');
            else
                alert('Failed to download file');
        });
    };
};

})();
