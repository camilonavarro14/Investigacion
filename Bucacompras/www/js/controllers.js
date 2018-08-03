angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicLoading, $ionicModal, $timeout, $location, $localStorage, $ionicHistory) {
  
  $scope.$storage = $localStorage;


  $scope.cerrar = function(){
    delete $scope.$storage.user;
    delete $localStorage.user;

    $ionicHistory.nextViewOptions({
      disableAnimate: false,
      disableBack: true
    });

    $location.path('/login');
  }
})

.controller('SplashCtrl', function($scope, $ionicLoading, $timeout, $location, $localStorage, $ionicHistory){
  $scope.loading = $ionicLoading.show({
    content: 'Cargando...',
    showBackdrop: false
  });


  $scope.loading.hide = function(){
    $timeout(function() {
      $ionicLoading.hide();
    }, 1000);    
  };

  $ionicHistory.nextViewOptions({
    disableBack: true
  });

  $scope.$storage = $localStorage;
  $timeout(function() {
    $scope.loading.hide(); 

    if($scope.$storage.user){
      //si ya a iniciado sesion redirecciono al home
      if (window.plugins) {
        window.plugins.OneSignal.sendTag('cliente', 'id_' + $scope.$storage.user.id);
      };
        console.log("inicia");
      $location.path('/app/home');
    }else{
      console.log("no inicia");
      //si no a iniciado sesion redirecciono al login
      $location.path('/login');
    }

  
  }, 3000);
})


.controller('loginCtrl', function($scope, $state, $localStorage,$location, $ionicSideMenuDelegate, $ionicPopup,$cordovaInAppBrowser, ApiConn) {
 

  $scope.$storage = $localStorage;

  //$scope.$storage.domin  = 'http://bucalogistica.dyndns.org:19090/api/v1/';                        
  //$scope.$storage.imagenes   = 'http://bucalogistica.dyndns.org:190/uploads/productos/';
  $scope.$storage.domin  = 'http://bucacompras.com:8080/api/v1/';
  $scope.$storage.imagenes  = 'http://bucacompras.com:80/uploads/productos/';

  $scope.galeria  = true;

  $scope.loginData = {
    username : '',
    password : '',
    clave: '',
    api: '',
    imagenes: '',
    producto: ''
  };

  $scope.mostraconfig = 0;
  //funcion para el boton
  $scope.entrar = function(){

    var params = {
      'input_email' : $scope.loginData.username,
      'input_pw' : $scope.loginData.password
    };

   var domin = $scope.$storage.domin;
   

    ApiConn.request('POST',domin,'login', params).then(function(data){
      if (!data.error) {
        $scope.$storage.user = data.user;
        console.table(data);
         if (window.cordova) {
              window.plugins.OneSignal.sendTag('cliente', 'id_' + $scope.$storage.user.id);
            }
         $location.path('/app/home');
      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });
  };

  

  $scope.openlink = function(){

   var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };

  $cordovaInAppBrowser.open('http://www.bucacompras.com/terminos-y-privacidad', '_self',options);
   }; 


  $scope.mostrarconfig = function(){
  $scope.mostraconfig = 1;
  };


  $scope.entrarconfig = function(){

    if ( $scope.loginData.clave == 5455) {
         $scope.$storage.domin  = $scope.loginData.api;
         $scope.$storage.imagenes  = $scope.loginData.imagenes;
    }
  };


  $scope.tapfuncionpor = function(){
    $scope.galeria  = true;
  }


  $scope.tapfuncion = function(){
    $scope.galeria  = false;
  }



  $scope.buscaproducto = function(){
  

  var options = {
    location: 'yes',
    clearcache: 'yes',
    toolbar: 'no'
  };

  $cordovaInAppBrowser.open('http://bucacompras.com/busquedas?q='+$scope.loginData.producto, '_self',options);


  }

})

.controller('perfilCtrl', function($scope,$ionicPopup, $stateParams,ApiConn, $localStorage,$ionicHistory,$location) {

  $scope.$storage = $localStorage;

  $scope.api  = false;
  $scope.click  = 0;

  $scope.formPerfil = {
    nombre : $scope.$storage.user.name
  };

  $scope.formPerfil.nombre = $scope.$storage.user.name;

  $scope.Actualizar = function(){
    
    var params = {
      'input_nombre': $scope.formPerfil.nombre,
      'input_pass1': $scope.formPerfil.contrasena,
      'input_pass2': $scope.formPerfil.contrasena1,
      '_method':'put'
    };
    var domin = $scope.$storage.domin;
   

    ApiConn.request('POST',domin,'usuario/'+$scope.$storage.user.id, params).then(function(data){
      if (!data.error) {
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });
  }

    $scope.cerrar = function(){
    delete $scope.$storage.user;
    delete $localStorage.user;

    $ionicHistory.nextViewOptions({
      disableAnimate: false,
      disableBack: true
    });

    $location.path('/login');
  }


  $scope.mostrarapi = function(){
    $scope.click++;
    console.log($scope.click)
    if (10 < $scope.click) {
    $scope.api  = true;
    console.log("ejecuta funcion");
    }

  }


})

.controller('homeCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

$scope.$storage = $localStorage;

  if($scope.$storage.urlPedido){
    $scope.urlPedidonoti  = $scope.$storage.urlPedido;
    delete $scope.$storage.urlPedido;
    $location.path($scope.urlPedidonoti);
  };


$scope.rol = '';
$scope.rol = $scope.$storage.user.rol;
$scope.idempresa = $scope.$storage.user.id_empresa;

$scope.tabstoppor=true;

$scope.url = $scope.$storage.imagenes;
 
console.log($scope.$storage.user);

if($scope.rol === 'LOCAL')
{
    console.log("Local");
    var domin = $scope.$storage.domin;
   

    ApiConn.request('GET',domin, 'pedidos/lista/'+$scope.idempresa, false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;
      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });
   console.log("Local");
  
}

if($scope.rol === 'SUPERVISOR')
{
  
  console.log("trasporte");
  $scope.mensaje ="Lista de pedidos por confirmar.";
    var domin = $scope.$storage.domin;
   

    ApiConn.request('GET',domin,'pedidos/porconfirmar/'+$scope.$storage.user.id_empresa, false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;
        console.log(data);
      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });


  $scope.tapfuncionpor = function(){ $scope.tabstoppor=true;  $scope.tabstop=false;
       $scope.mensaje ="Lista de pedidos por confirmar.";
    var domin = $scope.$storage.domin;
   

    ApiConn.request('GET',domin,'pedidos/porconfirmar/'+$scope.$storage.user.id_empresa, false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });
  }


  $scope.tapfuncion = function(){$scope.tabstoppor=false; $scope.tabstop=true;
        $scope.mensaje = "Lista de pedidos por entregar.";
        console.log("Lista de pedidos por entregar.");
        var domin = $scope.$storage.domin;
   

    ApiConn.request('GET',domin,'pedidos/confirmado/'+$scope.$storage.user.id_empresa, false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });
  }

  }

  $scope.detalle = function(id){
    console.log(id);
   $location.path('app/detalle/' + id);
  }


})

.controller('obsequioCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

    $scope.$storage = $localStorage;

    if($scope.$storage.urlPedido){
      $scope.urlPedidonoti  = $scope.$storage.urlPedido;
      delete $scope.$storage.urlPedido;
      $location.path($scope.urlPedidonoti);
    };

    $scope.url = $scope.$storage.imagenes;


    var domin = $scope.$storage.domin;

    ApiConn.request('GET',domin,'obsequios', false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

      console.log(data);
      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });

    $scope.detalle = function(id){
      console.log(id);
     $location.path('app/detalleobsequio/' + id);
    }

})

.controller('detalleobsequioCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

    $scope.$storage = $localStorage;

    if($scope.$storage.urlPedido){
      $scope.urlPedidonoti  = $scope.$storage.urlPedido;
      delete $scope.$storage.urlPedido;
      $location.path($scope.urlPedidonoti);
    };

    $scope.url = $scope.$storage.imagenes;

      $scope.$storage.detalleid = $stateParams.iddetalle;

    var domin = $scope.$storage.domin;

    ApiConn.request('GET',domin,'obsequios/'+$scope.$storage.detalleid, false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

        $scope.nombre = data.titulo;
        $scope.direccion = data.direccion1;
        $scope.barrio = data.barrio;
        $scope.telefono = data.telephone;
        $scope.celular1 = data.celular;
        $scope.celular2 = data.telefono;
        $scope.foto = $scope.$storage.imagenes+data.foto;
        $scope.total = data.total;
        $scope.departamento= data.departamento;
        $scope.area_metropolitana= data.area_metropolitana;
        $scope.ciudad= data.ciudad;

        $scope.fecha = data.fecha_real_entrega;

        $scope.producto = data.producto;

        $scope.usuario_apellido = data.usuario_apellido;
        $scope.usuario_nombre = data.usuario_nombre;
   

      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });


    $scope.atras = function(){

    $location.path('/app/obsequio');

    }

 
})

.controller('devolucionCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

    $scope.$storage = $localStorage;

    if($scope.$storage.urlPedido){
      $scope.urlPedidonoti  = $scope.$storage.urlPedido;
      delete $scope.$storage.urlPedido;
      $location.path($scope.urlPedidonoti);
    };

    $scope.url = $scope.$storage.imagenes;


    var domin = $scope.$storage.domin;

    ApiConn.request('GET',domin,'devoluciones', false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

      console.log(data);
      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });

    $scope.detalle = function(id){
      console.log(id);
     $location.path('app/detalledevolucion/' + id);
    }


 })

.controller('detalledevolucionCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

    $scope.$storage = $localStorage;

    if($scope.$storage.urlPedido){
      $scope.urlPedidonoti  = $scope.$storage.urlPedido;
      delete $scope.$storage.urlPedido;
      $location.path($scope.urlPedidonoti);
    };

    $scope.url = $scope.$storage.imagenes;

    $scope.$storage.detalleid = $stateParams.iddetalle;

    var domin = $scope.$storage.domin;

    ApiConn.request('GET',domin,'devoluciones/'+$scope.$storage.detalleid, false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

        $scope.nombre = data.titulo;
        $scope.direccion = data.direccion1;
        $scope.barrio = data.barrio;
        $scope.telefono = data.telephone;
        $scope.celular1 = data.celular;
        $scope.celular2 = data.telefono;
        $scope.foto = $scope.$storage.imagenes+data.foto;
        $scope.total = data.total;
        $scope.departamento= data.departamento;
        $scope.area_metropolitana= data.area_metropolitana;
        $scope.ciudad= data.ciudad;
        $scope.cantidad= data.cantidad;

        $scope.fecha = data.fecha_real_entrega;

        $scope.producto = data.producto;

        $scope.usuario_apellido = data.usuario_apellido;
        $scope.usuario_nombre = data.usuario_nombre;

      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });


   $scope.atras = function(){

    $location.path('/app/devolucion');

    }

})



.controller('situacionesCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

    $scope.$storage = $localStorage;

    if($scope.$storage.urlPedido){
      $scope.urlPedidonoti  = $scope.$storage.urlPedido;
      delete $scope.$storage.urlPedido;
      $location.path($scope.urlPedidonoti);
    };

    $scope.url = $scope.$storage.imagenes;


    var domin = $scope.$storage.domin;

    ApiConn.request('GET',domin,'situaciones', false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

      console.log(data);
      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });

    $scope.detalle = function(id){
      console.log(id);
     $location.path('app/detallesituaciones/' + id);
    }

})

.controller('detallesituacionesCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

    $scope.$storage = $localStorage;

    if($scope.$storage.urlPedido){
      $scope.urlPedidonoti  = $scope.$storage.urlPedido;
      delete $scope.$storage.urlPedido;
      $location.path($scope.urlPedidonoti);
    };

    $scope.url = $scope.$storage.imagenes;

    $scope.$storage.detalleid = $stateParams.iddetalle;

    var domin = $scope.$storage.domin;

    ApiConn.request('GET',domin,'situaciones/'+$scope.$storage.detalleid, false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

        $scope.foto = $scope.$storage.imagenes+data.foto;
        $scope.fecha = data.fecha;
        $scope.hora = data.hora;
        $scope.nombre= data.nombre_situacion;
        $scope.producto = data.producto;

      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });

   $scope.atras = function(){

    $location.path('/app/situaciones');

    }

})

.controller('seguimientoCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

    $scope.$storage = $localStorage;

    if($scope.$storage.urlPedido){
      $scope.urlPedidonoti  = $scope.$storage.urlPedido;
      delete $scope.$storage.urlPedido;
      $location.path($scope.urlPedidonoti);
    };

    $scope.url = $scope.$storage.imagenes;


    var domin = $scope.$storage.domin;

    ApiConn.request('GET',domin,'seguimiento', false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

      console.log(data);
      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });

    $scope.detalle = function(id){
      console.log(id);
     $location.path('app/detalleseguimiento/' + id);
    }

})

.controller('detalleseguimientoCtrl', function($scope, $state,$location,$ionicPopup, $stateParams, $ionicModal, $ionicLoading, $timeout, ApiConn, $localStorage) {

    $scope.$storage = $localStorage;

    if($scope.$storage.urlPedido){
      $scope.urlPedidonoti  = $scope.$storage.urlPedido;
      delete $scope.$storage.urlPedido;
      $location.path($scope.urlPedidonoti);
    };

    $scope.url = $scope.$storage.imagenes;

    $scope.$storage.detalleid = $stateParams.iddetalle;

    var domin = $scope.$storage.domin;

    ApiConn.request('GET',domin,'seguimiento/'+$scope.$storage.detalleid, false).then(function(data){
      if (!data.error) {
        $scope.listapedidos = data;

        $scope.nombre = data.nombre;
        $scope.encargado = data.encargado;
        $scope.telefono_principal = data.telefono_principal;

        $scope.nombreTrasporte =  data.nombreTrasporte;
        $scope.movilTrasporte =  data.movilTrasporte;
        $scope.telefonoTrasporte =  data.telefonoTrasporte;




        $scope.direccion = data.direccion1;
        $scope.barrio = data.barrio;
        $scope.telefono = data.telephone;
        $scope.celular1 = data.celular;
        $scope.celular2 = data.telefono;
        $scope.foto = $scope.$storage.imagenes+data.foto;
        $scope.total = data.total;
        $scope.departamento= data.departamento;
        $scope.area_metropolitana= data.area_metropolitana;
        $scope.ciudad= data.ciudad;

        $scope.fecha = data.fecha_real_entrega;

        $scope.producto = data.producto;

        $scope.usuario_apellido = data.usuario_apellido;
        $scope.usuario_nombre = data.usuario_nombre;
   

      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });


       $scope.atras = function(){

    $location.path('/app/seguimiento');

    }

})


.controller('detalleCtrl', function($scope, $stateParams,$location, $state,$ionicHistory, ionicDatePicker, $localStorage,$filter, ApiConn,$ionicPopup, $localStorage ) {


      $scope.muestraselect = false;
      $scope.mostrarinfoempredata =false;
      $scope.mostrarinfoclientedata = false;

     $scope.$storage = $localStorage;
     $scope.rol = '';
     $scope.rol = $scope.$storage.user.rol;

     $scope.data = {
      datosituacion : ''
      }; 

     $scope.local = {
      nombre : '',
      direccion : '',
      telefono_principal : '',
      encargado : ''
      };

      $scope.cambiofecha = {
      descripcion : '',
      nuevafecha : ''
      };

      $scope.mostrartarjeta = 1;

     $scope.$storage.detalleid = $stateParams.iddetalle;

      $scope.cambiofecha.descripcion;

      $scope.mostrarinfoempre = function(){ 
        if ($scope.mostrarinfoempredata == true) {$scope.mostrarinfoempredata =false;}
        else {$scope.mostrarinfoempredata = true;}
      }

      $scope.mostrarinfocliente = function(){
        if($scope.mostrarinfoclientedata == true){$scope.mostrarinfoclientedata = false;}
        else{$scope.mostrarinfoclientedata = true;}
      }

 
    var domin = $scope.$storage.domin;
   

    ApiConn.request('GET',domin,'pedidos/'+$scope.$storage.detalleid, false).then(function(data){
      if (!data.error) {
        console.log(data);

        $scope.local.nombre = data.local.nombre;
        $scope.local.direccion= data.local.direccion;
        $scope.local.encargado = data.local.encargado;
        $scope.local.telefono_principal = data.local.telefono_principal;


        $scope.DatosSituacion = data.DatosSituacion;
        $scope.nombre = data.nombre;
        $scope.pedidoid = data.id;
        $scope.foto = $scope.$storage.imagenes+data.foto;
        $scope.estadotitu = data.proceso.titulo;
        $scope.cantidad = data.cantidad;
        $scope.total = data.total;
        $scope.fecha = data.fecha;
        $scope.hora_entrega = data.hora_entrega;
        $scope.horaomitir = data.horario_extendido;
        $scope.fechaomitir = data.horario_extendido;
        $scope.estado = data.estado.estado;
        $scope.atiende = data.estado.atiende;
        $scope.direccion = data.ubicaciones.direccion;
        $scope.barrio = data.ubicaciones.barrio;
        $scope.telefono = data.ubicaciones.telefono;
        $scope.celular = data.ubicaciones.celular;
        $scope.notificacion = data.estado.notificacion;
        $scope.pregunta_uno = data.proceso.pregunta_uno;
        $scope.pregunta_dos = data.proceso.pregunta_dos;

        $scope.respuesta1 = data.respuesta1;
        $scope.respuesta2 = data.respuesta2;
        $scope.respuesta3 = data.respuesta3;
        $scope.respuesta4 = data.respuesta4;

        $scope.pregunta1 = data.producto.pregunta1;
        $scope.pregunta2 = data.producto.pregunta2;
        $scope.pregunta3 = data.producto.pregunta3;
        $scope.pregunta4 = data.producto.pregunta4;

        $scope.envoltura_regalo = data.envoltura_regalo;

        $scope.usado = data.producto.usado;

      }else{
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
      }

    });

    //funciones para mostar tarjetas dependiedo

      $scope.mostrartarjetafun = function(data){
        $scope.mostrartarjeta = data;
      }

    //PRegunta 1
    
    $scope.respondeSi = function(){

        var params = {
          input_acepto: 'Si',
          input_acepto_1: 'Si',  
          input_fecha_entrega: $scope.fecha.slice(0, 10),
          input_fecha_uno : $scope.fecha.slice(0, 10),
          input_hora_entrega: $scope.hora_entrega,
          input_pedido: $scope.pedidoid,
          input_descripcion: 'N/A',
          input_estadoActual: $scope.estado,
          input_usuario: $scope.$storage.user.id
        };

        console.log(params);
      
    var domin = $scope.$storage.domin;
   

    ApiConn.request('POST',domin,'pedidos/aceptar', params).then(function(data){  
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
        $state.go('app.home', {});
      }
      )

    }

     $scope.respondeNo = function(){
       
       $scope.muestrapreguntados = true;

    }

    $scope.respondeSitrans = function(){
      
      var params = {
          input_pedido: $scope.pedidoid,
          input_id: $scope.$storage.user.id_empresa,
          input_estado: $scope.estado,
          input_acepto: 'Si'
        };
      
        console.log($scope.pedidoid);
        console.log($scope.$storage.user.id_empresa);
        console.log($scope.estado);
  
    var domin = $scope.$storage.domin;
   

    ApiConn.request('POST',domin,'pedidos/aceptarB1', params).then(function(data){  
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
        $state.go('app.home', {});
      })
      
    }    

    $scope.respondeNotrans = function(){
         
        $scope.muestraselect = true;
    }


   $scope.respondeNotransmas = function(){
        
        var params = {
            input_datosituacion: $scope.data.datosituacion,
            input_pedido: $scope.pedidoid,
            input_id: $scope.$storage.user.id_empresa,
            input_estado: $scope.estado,
            input_acepto: 'No'
          };

          console.log(params);
        
    var domin = $scope.$storage.domin;
   

    ApiConn.request('POST',domin,'pedidos/aceptarB1', params).then(function(data){  
          $ionicPopup.alert({
             title: 'Bucacompras',
             template: "<ul>" + data.message + "</ul>"
           });
          $state.go('app.home', {});
        })
      
      }







      $scope.responde2Si = function(){


         $scope.anospiker =$scope.fecha.slice(0,4);
         $scope.mespiker =$scope.fecha.slice(6,7)-1;
         $scope.diapiker =$scope.fecha.slice(8,10)-1;

        if($scope.fechaomitir == 1){
          var ipObj1 = {
      			callback: function (val) {  //Mandatory
      			$scope.nuevafecha = new Date(val);
      			$scope.nuevafechas = $scope.nuevafecha.toISOString();
      			$scope.muestraprecalendario = true;
      			},
      			inputDate: new Date(),      //Optional
      			mondayFirst: true,          //Optional
            from: new Date($scope.anospiker, $scope.mespiker, $scope.diapiker),
      			weeksList: ["D", "L", "M", "M", "J", "V", "S"],
      			monthsList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      			closeOnSelect: true,       //Optional
      			templateType: 'popup'       //Optional
          };
        }else{
          var ipObj1 = {
            callback: function (val) {  //Mandatory
            $scope.nuevafecha = new Date(val);
            $scope.nuevafechas = $scope.nuevafecha.toISOString();
            $scope.muestraprecalendario = true;
            },
            inputDate: new Date(),      //Optional
            mondayFirst: true,          //Optional
            from: new Date($scope.anospiker, $scope.mespiker, $scope.diapiker),
            weeksList: ["D", "L", "M", "M", "J", "V", "S"],
            monthsList: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            disableWeekdays: [0,6],       //Optional 
            closeOnSelect: true,       //Optional
            templateType: 'popup'       //Optional
          };
        }


        ionicDatePicker.openDatePicker(ipObj1);     
    }

 

    $scope.responde2No = function(){       
       $scope.muestrapreguntatres = true;
       $scope.mostrartarjeta = 3;
    }
     $scope.responde3No = function(){
        var params = {
          input_acepto: 'No',
          input_acepto_1: 'No', 
          input_desactivar : 'No',          
          input_fecha_entrega: $scope.fecha,
          input_fecha_uno : $scope.fecha,
          input_hora_entrega: $scope.hora_entrega,
          input_pedido: $scope.pedidoid,
          input_descripcion: 'N/A',
          input_estadoActual: $scope.estado,
          input_usuario: $scope.$storage.user.id
        };

    var domin = $scope.$storage.domin;
   

    ApiConn.request('POST',domin,'pedidos/aceptar', params).then(function(data){  
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
        $state.go('app.home', {});
      }
      )

    }
    $scope.responde3Si = function(){
        var params = {
          input_acepto: 'No',
          input_acepto_1: 'No', 
          input_desactivar : 'Si',          
          input_fecha_entrega: $scope.fecha,
          input_fecha_uno : $scope.fecha,
          input_hora_entrega: $scope.hora_entrega,
          input_pedido: $scope.pedidoid,
          input_descripcion: 'N/A',
          input_estadoActual: $scope.estado,
          input_usuario: $scope.$storage.user.id
        };

    var domin = $scope.$storage.domin;
   

    ApiConn.request('POST',domin,'pedidos/aceptar', params).then(function(data){  
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
        $state.go('app.home', {});
      }
      )

    }


     $scope.respondecaledario = function(){

        var params = {
          input_acepto: 'No',
          input_acepto_1: 'Si',  
          input_fecha_entrega: $scope.nuevafechas.slice(0, 10),
          input_nueva_hora: $scope.cambiofecha.nuevahora,
          input_fecha_uno : $scope.fecha.slice(0, 10),
          input_hora_entrega: $scope.hora_entrega,
          input_pedido: $scope.pedidoid,
          input_descripcion: $scope.cambiofecha.descripcion,
          input_estadoActual: $scope.estado,
          input_usuario: $scope.$storage.user.id
        };

        console.log(params);

        
   var domin = $scope.$storage.domin;
   

    ApiConn.request('POST',domin,'pedidos/aceptar', params).then(function(data){  
        $ionicPopup.alert({
           title: 'Bucacompras',
           template: "<ul>" + data.message + "</ul>"
         });
        $state.go('app.home', {});
      }
      )
    }


    $scope.atras = function(){

       $location.path('/app/home');

    }



});

