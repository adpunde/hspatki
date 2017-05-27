(function () {
'use strict';

angular.module('hsp')
.controller('AdminInfoController', AdminInfoController);

AdminInfoController.$inject = ['AdminService', '$state', '$timeout',
    'AdminLoginTimeout'];
function AdminInfoController (AdminService, $state, $timeout, AdminLoginTimeout) {
    var ctrl = this;
    ctrl.filename = '';

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

    ctrl.delete = function () {
        AdminService.deleteCustomerInfo()
        .then (function (data) {
            console.log('Customer info deleted');
        })
        .catch (function (error) {
            alert('Failed to delete customer info');
        });
    };

    ctrl.import = function () {
        if (!ctrl.filename)
            return;

        console.log('Importing file:', ctrl.filename);

        var reader = new FileReader();

        reader.readAsBinaryString(ctrl.filename);

        reader.onload = function(e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {type : 'binary'});
            var idx = workbook.SheetNames.indexOf('customers');
            if (idx === -1) {
                alert('customers sheet not found in excel file.');
                return;
            }

            var objArray = XLSX.utils.sheet_to_json(workbook.Sheets['customers']);
            var newArray = [];
            console.log('Total entries found: ', objArray.length);
            objArray.forEach(function (entry) {
                if (!entry.tin && !entry.pan && !entry.stn) {
                    alert('Either of TIN/PAN/STN must be available for every row.');
                    return;
                }

                var newEntry = {};
                if (entry.tin) newEntry.tin = entry.tin;
                if (entry.pan) newEntry.pan = entry.pan;
                if (entry.stn) newEntry.stn = entry.stn;
                if (entry.name) newEntry.name = entry.name;
                newArray.push(newEntry);
            });

            AdminService.importCustomerInfo(newArray)
            .then (function (data) {
                alert('File successfully imported');
            })
            .catch (function (error) {
                alert('Failed to import file: ' + error.message);
            });
        };
    };
};

})();
