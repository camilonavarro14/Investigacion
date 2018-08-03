angular.module('starter.services', [])

.factory('ApiConn', function($http, $httpParamSerializerJQLike){
  return {
    request: function(method, domin, endPoint, params){
      var opciones = {
        method: method,
        url: domin + endPoint,
        headers: {
          'authorization': 'Basic YXBpQGZveGRpZ2l0YWxzdHVkaW8uY286MTIzNDU2Nw==',
          'Content-Type': 'application/x-www-form-urlencoded',
          'cache-control': 'no-cache'
        }
      };

      if (params) {
        opciones.data = $httpParamSerializerJQLike(params);
      }

      console.log("opciones: ");
      console.dir(opciones);

      var p = $http(opciones).then(function successCallback(response) {        
        console.log("data: ");
        console.dir(response.data);
        return response.data;
      });

      return p;

    }
  };

});
