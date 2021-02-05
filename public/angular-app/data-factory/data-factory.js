
angular.module('hypatia').factory('dataFactory', dataFactory);

function dataFactory($window) {

    var outputLocation = null;

    return {
        getSocket: getSocket,
        setOutputLocation: setOutputLocation,
        getOutputLocation: getOutputLocation
    }

    

    function getSocket(WS_route) {

        var stack = [];
        var onmessageDefer;

        var socket = {
            ws: new WebSocket('ws://' + $window.location.host + '/api/' + WS_route),

            send: function(data) {
                data = JSON.stringify(data);
                if (socket.ws.readyState == 1) {
                    socket.ws.send(data);
                } else {
                    stack.push(data);
                }
            },

            onmessage: function(callback) {
                if (socket.ws.readyState == 1) {
                    socket.ws.onmessage = callback;
                } else {
                    onmessageDefer = callback;
                }
            }
        };

        socket.ws.onopen = function(event) {
            for (i in stack) {
                socket.ws.send(stack[i]);
            }
            stack = [];
            if (onmessageDefer) {
                socket.ws.onmessage = onmessageDefer;
                onmessageDefer = null;
            }
        };

        return socket;
    }

    function setOutputLocation(location) {
        outputLocation = location;
    }

    function getOutputLocation() {
        return outputLocation
    }
    
}

 