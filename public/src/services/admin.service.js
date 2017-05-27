(function () {
'use strict';

angular.module('hsp')
.service('AdminService', AdminService);

AdminService.$inject = ['$http'];
function AdminService ($http) {
    var service = this;

    service.Login = function (username, password) {
        return $http.post('/api/admin/login',
            { "username": username, "password": password },
            {'Content-Type': 'application/x-www-form-urlencoded'}
        )
        .then (function (response) {
            return response.data;
        })
        .catch (function (response) {
            console.log('Error', response.data);
            throw new Error(response.data);
        });
    };

    service.getAllCustomerInfo = function () {
        return $http.get('/api/admin/download')
            .then (function (response) {
                var array = response.data;

                var blob = new Blob([array], { type: 'application/json' });
                saveAs(blob, "contacts.json");

                var str = '';
                for (var i = 0; i < array.length; i++) {
                    str += array[i].tin + ',' + array[i].dealerName + "\n";
                }
                blob = new Blob([str], { type: 'text/csv' });
                saveAs(blob, "contacts.csv");

                // var header = response.headers('content-disposition');
                // var parts = header.match(new RegExp(".*filename=\"(.*)\""));
                // console.log(header);
                // console.log('FileName: ', fileName);
            })
            .catch (function (response) {
                console.log('Error', response.data);
                throw new Error(response.data);
            });
    };

    service.importCustomerInfo = function (array) {
        return $http.post('/api/admin/import', JSON.stringify(array),
            {'Content-Type': 'application/json'}
        )
        .then (function (response) {
            return response.data;
        })
        .catch (function (response) {
            console.log('Error', response.data);
            throw new Error(response.data);
        });
    };
};

})();
