(function () {
'use strict';

angular.module('hsp')
.controller('TransactionContactController', TransactionContactController);

TransactionContactController.$inject = ['tin'];
function TransactionContactController (tin) {
    var $ctrl = this;
    $ctrl.tin = tin;
    $ctrl.filtered = [];

    angular.forEach(transObj.transactions, function (trans) {
        if (trans.tin === tin) {
            var obj = trans;
            obj.dealerName = contactObj[tin].dealerName;
            $ctrl.filtered.push(obj);
        }
    });
};

})();
