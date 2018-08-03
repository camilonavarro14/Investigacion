ngular.module('starter.services', [])

.constant("ConfigUrl", {
        "url": "http://bucalogistica.dyndns.org:190/uploads/productos/"
    })

.factory('ApiConn', function($http, $httpParamSerializerJQLike){
  return {
    request: function(method, domin, endPoint, params){
      var opciones = {
        method: method,
        url: 'http://bucalogistica.dyndns.org:19090/api/v1/'+ endPoint,
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
