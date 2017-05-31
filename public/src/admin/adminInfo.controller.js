(function () {
'use strict';

angular.module('hsp')
.controller('AdminInfoController', AdminInfoController);

AdminInfoController.$inject = ['AdminService', '$state', '$timeout',
    'AdminLoginTimeout', 'DataService'];
function AdminInfoController (AdminService, $state, $timeout,
    AdminLoginTimeout, DataService) {

    var ctrl = this;
    ctrl.filename = '';

    ctrl.download = function (type) {
        AdminService.downloadCustomerInfo()
        .then (function (data) {
            if (data.length === 0) {
                alert('The database is empty!');
                return;
            }

            DataService.writeFile(data, 'customers', type, function(err) {
                if (err) {
                    alert('Error: ' + err.message);
                    return;
                }

                console.log('File downloaded');
            });
        })
        .catch (function (error) {
            alert('Failed to download file');
        });
    };

    ctrl.add = function () {
        $state.go('adminNewCustomer');
    };

    // var timer = $timeout(function () {
    //      $state.go('adminLogin');
    // }, AdminLoginTimeout);

    ctrl.delete = function () {
        if (!confirm("Are you sure ?"))
            return;

        AdminService.deleteCustomerInfo()
        .then (function (data) {
            alert('All customer info deleted');
        })
        .catch (function (error) {
            alert('Failed to delete customer info');
        });
    };

    ctrl.import = function () {
        if (!ctrl.filename)
            return;

        console.log('Importing file:', ctrl.filename);
        DataService.readExcelData(ctrl.filename, function (err, data) {
            if (err) {
                alert('Error: ' + err.message);
                return;
            }

            AdminService.importCustomerInfo(data)
            .then (function () {
                alert('File successfully imported');
            })
            .catch (function (error) {
                alert('Failed to import file: ' + error.message);
            });
        });
    };

};

})();
