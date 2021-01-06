    
angular.module('hypatia').directive('ngFiles', ngFiles) 

function ngFiles($parse) {

    return {
        require: "ngModel",
        restrict: 'A',

        link: function($scope, element, attrs, ngModel) {

            var onChange = $parse(attrs.ngFiles);

            element.on('change', function (event) {
                onChange($scope, { $files: event.target.files });
                ngModel.$setViewValue(event.target.files);
                $scope.$apply();
                event.target.value = '';
            });
            
            $scope.$watch(function () {
                return ngModel.$viewValue;
            }, function (value) {
                if (!value) {
                    element.val("");
                }
            });
        }
    };
}


