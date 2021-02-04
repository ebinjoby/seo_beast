
angular.module('hypatia').controller('SeoToolController', SeoToolController);

function SeoToolController(hypatiaDataFactory, socketFactory, $rootScope) {

    var vm = this;

    vm.ShowSpinnerStatus = false;
    vm.location = null;

    var formdata = new FormData();

    vm.files = [];
    vm.messages = [];
    

    socketFactory.onmessage(function(event) {

        message = event.data;
        console.log('WS Server Message: ', message)

        if (message.slice(0,10) == 'Connection') {
            var data = {'data' : message, 'highlight': 'true'}
        }
        else if (message.slice(0,10) == 'Time Taken') {
            var data = {'data' : message, 'highlight': 'true'}
        }
        else {
            var data = {'data' : message, 'highlight': 'false'}
        }

        vm.messages.push(data);
        $rootScope.$apply()
    });


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
        console.log("vm.messages", vm.messages);
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


