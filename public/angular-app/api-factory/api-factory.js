
angular.module('hypatia').factory('apiFactory', apiFactory);

function apiFactory($http) {

    return {

        keywordsListUpload: keywordsListUpload,
        keywordsOutputDownload: keywordsOutputDownload
    };

    
    function keywordsListUpload(formdata, id) {
        return $http.post('api/seo_tool/' + id, formdata, { headers: { 'Content-Type': undefined } }).then(complete).catch(failed);
    }

    function keywordsOutputDownload(id) {
        window.open('api/seo_tool/' + id, '_parent');
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



