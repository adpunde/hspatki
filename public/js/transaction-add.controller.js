(function () {
'use strict';

angular.module('hsp')
.controller('TransactionAddController', TransactionAddController);

TransactionAddController.$inject = [ '$state' ];
function TransactionAddController ($state) {
    var $ctrl = this;
    $ctrl.contacts = contactObj.contacts;
    $ctrl.transactions = transObj.transactions;
    $ctrl.submit = submit;
    $ctrl.getDealerName = getDealerName;
    $ctrl.state = $state;
    $ctrl.trans = {};
    $ctrl.invalidTin = false;
};

function submit () {
    var $ctrl = this;
    console.log($ctrl.trans);

    if (!$ctrl.trans.dealerName) {
        alert('Invalid TIN specified');
        return;
    }

    transObj.transactions.push($ctrl.trans);
    alert('Transaction added successfully !');
    $ctrl.state.go('transactions', {});
}

function getDealerName () {
    var $ctrl = this;
    $ctrl.trans.dealerName = '';
    angular.forEach($ctrl.contacts, function (contact) {
        if (contact.tin === $ctrl.trans.tin) {
            $ctrl.trans.dealerName = contact.dealerName;
        }
    });

    if ($ctrl.trans.dealerName) {
        $ctrl.invalidTin = false;
    } else {
        $ctrl.invalidTin = true;
    }
}


})();
