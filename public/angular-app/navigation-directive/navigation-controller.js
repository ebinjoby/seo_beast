
angular.module('hypatia').controller('NavigationController', NavigationController);

function NavigationController($location) {
    var vm = this;

    vm.isActiveTab = function(url) {
        var currentPath = $location.path().split('/')[1];
        return (url === currentPath ? 'active' : '');
    }

};

 

  
 

