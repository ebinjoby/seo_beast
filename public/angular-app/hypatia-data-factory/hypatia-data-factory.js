angular.module('hypatia').factory('hypatiaDataFactory', hypatiaDataFactory);

function hypatiaDataFactory($http) {

    return {

        articlesListUpload: articlesListUpload,
        articlesListDownload: articlesListDownload
    };

    
    function articlesListUpload(id, formdata) {
        return $http.post('api/projects/' + id + '/articles/upload/', formdata, { headers: { 'Content-Type': undefined } }).then(complete).catch(failed);
    }

    function articlesListDownload(id) {
        window.open('api/projects/' + id + '/articles/download/', '_parent');
    }

    

    /* callback functions */

    function complete(response) {
        console.log(response);
        return response;
    }

    function failed(error) {
        console.log(error.statusText);
        return error.statusText;
    }

}



