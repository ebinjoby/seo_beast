
angular.module('hypatia').controller('SeoToolController', SeoToolController);

function SeoToolController(apiFactory, dataFactory, $rootScope, $route, $scope) {

    var vm = this;

    vm.ShowSpinnerStatus = false;

    var location = dataFactory.getOutputLocation('seo_tool');

    if (location) {
        vm.location = location;
    }
    else {
        vm.location = null;
    }

    var formdata = new FormData();

    vm.files = [];
    vm.messages = [];

    

    socket = dataFactory.getSocket('seo_tool_WS')

    socket.onmessage(function(event) {

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


    $scope.$on('$locationChangeStart', function(event) {
        //event.preventDefault(); 
        if (vm.location) {
            var answer = confirm("Are you sure you want to leave this page without downloading the output? Output will be lost.")
            if (!answer) {
                event.preventDefault();
            }
            else {
                socket.send('Client Leaving Page');
                dataFactory.setOutputLocation('seo_tool', null);
            }
        }
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
        socket.send('Please Disconnect')
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

            dataFactory.setOutputLocation('seo_tool', null);

            apiFactory.keywordsListUpload(formdata, folderName).then(function (response) {

                console.log(response.data);
                alert(response.data.message);

                dataFactory.setOutputLocation('seo_tool', response.data.location)
                $route.reload()
                vm.location = dataFactory.getOutputLocation('seo_tool')

                vm.ShowSpinnerStatus = false;
                //vm.location = response.data.location

            });

            formdata = new FormData();
            vm.files = [];
        }
    }

    vm.downloadFile = function() {

        folderName = vm.location;
        console.log('Downloading From: ', folderName)
        alert('Check your downloads folder for the output file!')
        apiFactory.keywordsOutputDownload(folderName);

        vm.location = null;
    }


}


