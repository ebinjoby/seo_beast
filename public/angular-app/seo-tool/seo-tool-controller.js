
angular.module('hypatia').controller('SeoToolController', SeoToolController);

function SeoToolController(hypatiaDataFactory) {

    var vm = this;

    vm.ShowSpinnerStatus = false;

    var formdata = new FormData();

    vm.files = [];

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
        if (confirm("Don't close this page while process is running.\nPress OK to continue.")) {
            vm.ShowSpinnerStatus = true;
            hypatiaDataFactory.keywordsListUpload(formdata).then(function (response) {
                console.log(response.data);
                alert(response.data.message);
                vm.ShowSpinnerStatus = false;
            });
            formdata = new FormData();
            vm.files = [];
        }
    }


}


