
angular.module('hypatia', ['ngRoute', 'angular-jwt']).config(config);

function config($locationProvider, $routeProvider) {

    $locationProvider.html5Mode(false).hashPrefix('');

    $routeProvider
        .when('/', {
            templateUrl: 'angular-app/main/main.html',
            access: { restricted : false }
        })
        .when('/seo_tool', {
            templateUrl: 'angular-app/seo-tool/seo-tool.html',
            controller: SeoToolController,
            controllerAs: 'vm',
            access: { restricted : false }        
        })
        .otherwise({
            redirectTo: '/'
        });

}

 


