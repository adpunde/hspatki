(function () {

angular.module('hsp')
.directive('fileSelect', FileSelect);

FileSelect.$inject = ['$parse'];
function FileSelect ($parse) {
    var ddo = {
        restrict: 'A',
        link: function (s, e, a, c) {
            FileSelectLink (s, e, a, c, $parse);
        }
    };

    return ddo;
};

function FileSelectLink (scope, element, attrs, controller, $parse) {
    var getter = $parse(attrs.fileSelect);
    var setter = getter.assign;

    element.bind('change', function(){
       scope.$apply( function() {
           setter(scope, element[0].files[0]);
       });
    });
};

})();
