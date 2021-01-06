angular.module('hypatia').factory('hypatiaDataFactory', hypatiaDataFactory);

function hypatiaDataFactory($http) {

    return {

        keywordsListUpload: keywordsListUpload,
        articlesListDownload: articlesListDownload
    };

    
    function keywordsListUpload(formdata) {
        return $http.post('analyze/', formdata, { headers: { 'Content-Type': undefined } }).then(complete).catch(failed);
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



