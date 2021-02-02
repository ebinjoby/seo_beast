
angular.module('hypatia').controller('SeoToolController', SeoToolController);

function SeoToolController(hypatiaDataFactory, $window) {

    var vm = this;

    vm.ShowSpinnerStatus = false;
    vm.location = null;

    var formdata = new FormData();

    vm.files = [];

    vm.reset = function(variable) {

        alert('Tool reset.');
        variable = null;
    }

    vm.getTheFiles = function ($files) {
        console.log($files);
        angular.forEach($files, function (value, key) {
            key = "file";
            formdata.append(key, value);
        });
    }

    vm.removeFiles = function () {
        vm.files = [];
    }

    vm.uploadFiles = function () {
        if (confirm("Don't close this page while process is running.\nAny undownloaded output will be lost.\n\nPress OK to continue.")) {

            vm.ShowSpinnerStatus = true;
            
            if (vm.location) {
                folderName = vm.location;
                vm.location = null;
            } 
            else {
                folderName = 'NONE'
            }

            hypatiaDataFactory.keywordsListUpload(formdata, folderName).then(function (response) {

                console.log(response.data);
                alert(response.data.message);

                vm.ShowSpinnerStatus = false;
                vm.location = response.data.location

            });

            formdata = new FormData();
            vm.files = [];
        }
    }

    vm.downloadFile = function() {

        folderName = vm.location;

        hypatiaDataFactory.keywordsOutputDownload(folderName);

        vm.location = null;
    }


}


