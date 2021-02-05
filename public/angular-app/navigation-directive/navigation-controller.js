
angular.module('hypatia').controller('NavigationController', NavigationController);

function NavigationController($location) {
    var vm = this;

    vm.isActiveTab = function(url) {
        var currentPath = $location.path().split('/')[1];
        console.log(currentPath)
        return (url === currentPath ? 'active' : '');
    }

};

 

  
 

