(function () {
'use strict';

angular.module('hsp')
.service('AdminService', AdminService);

AdminService.$inject = ['$http'];
function AdminService ($http) {
    var service = this;

    service.Login = function (username, password) {
        return $http.post('/api/adminLogin',
            { "username": username, "password": password },
            {'Content-Type': 'application/x-www-form-urlencoded'}
        )
        .then (function (response) {
            return response.data;
        })
        .catch (function (response) {
            console.log('Error', response);
            return null;
        });
    };

    service.getAllCustomerInfo = function () {
        return $http.get('/api/admin/download')
            .then (function (response) {
                var data = response.data;
                var json = JSON.stringify(data, null, 4);
                var blob = new Blob([json], { type: 'application/json' });
                saveAs(blob, "contacts.json");
                return true;
                // var header = response.headers('content-disposition');
                // var parts = header.match(new RegExp(".*filename=\"(.*)\""));
                // console.log(header);
                // console.log('FileName: ', fileName);
            })
            .catch (function (response) {
                console.log('Error', response);
                return null;
            });
    };
};

})();
