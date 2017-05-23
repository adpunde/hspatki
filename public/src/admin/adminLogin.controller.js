(function () {
'use strict';

angular.module('hsp')
.controller('AdminLoginController', AdminLoginController);

AdminLoginController.$inject = ['AdminService', '$state'];
function AdminLoginController (AdminService, $state) {
    var ctrl = this;
    ctrl.username = '';
    ctrl.password = '';

    ctrl.Login = function () {
        // Send POST request to the server
        AdminService.Login(ctrl.username, ctrl.password)
        .then (function (name) {
            if (!name) {
                alert('Invalid credentials');
                $state.go('adminLogin');
            }
            else {
                $state.go('adminInfo');
            }
        });
    }
};

})();
