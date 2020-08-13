@extends('layouts.app')

@section('content')
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
    
    <title>Cahu Beltrao - @yield('subtitle')</title>
    <!-- Icons-->
    <link rel="icon" type="image/ico" href="{{url('/')}}/img/favicon.ico" sizes="any" />
    <link href="{{url('/')}}/plugins/font-awesome/css/font-awesome.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="{{url('/')}}/plugins/toastr/toastr.min.css">

    <!-- Main styles for this application-->
    <link href="{{url('/')}}/css/APP/base.css?{{time()}}" rel="stylesheet">
    <link href="{{url('/')}}/css/app.css?{{time()}}" rel="stylesheet">
  </head>
  
  <body class="app header-fixed sidebar-fixed aside-menu-fixed sidebar-lg-show">
    <header class="app-header navbar">
      <button class="navbar-toggler sidebar-toggler d-lg-none mr-auto" type="button" data-toggle="sidebar-show">
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="/">
        <img class="navbar-brand-full" src="{{url('/')}}/img/CBA_logo.png" alt="Logo" >
        <!-- <img class="navbar-brand-minimized" src="{{url('/')}}/img/CBA_logo.png" width="48" alt="Logo"> -->
      </a>
      <button class="navbar-toggler sidebar-toggler d-md-down-none" type="button" data-toggle="sidebar-lg-show">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- HeadBar (NavBar) -->
      <ul class="nav navbar-nav d-md-down-none">
        @include('partial.head-bar')
      </ul>
    </header>
    
    <div class="app-body">
      <!-- Sidebar left -->
      <div class="sidebar">
        @include('partial.left-menu')
        <button class="sidebar-minimizer brand-minimizer" type="button"></button>

      </div>
      
      <main class="main">
        <!-- Breadcrumb-->
        @yield('page-breadcrumb')

        <div class="container-fluid">
          @yield('page-content')
        </div>
      </main>
      
    </div>


    <!-- CoreUI and necessary plugins-->
    <script type="text/javascript" src="{{url('/')}}/plugins/jquery/dist/jquery.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/popper.js/dist/umd/popper.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/bootstrap/dist/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/pace-progress/pace.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/perfect-scrollbar/dist/perfect-scrollbar.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/@coreui/coreui/dist/js/coreui.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/toastr/toastr.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/bootbox/bootbox.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/bootbox/bootbox.locales.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/mask-plugin/dist/jquery.mask.min.js"></script>
    <script type="text/javascript" src="{{url('/')}}/plugins/cropper/cropper.min.js?{{time()}}"></script>


    <script type='text/javascript'>
    
      function getUrl() {
        return "{{url('/')}}";
      }
      
      $(document).ready(function() {
        $('[data-toggle="tooltip"]').tooltip();
        
        toastr.options = { 
          "closeButton": true, "positionClass": "toast-top-center", "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "newestOnTop": true,
          "preventDuplicates": true,
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        };
      });
      var bootboxLoadingWindow = bootbox.dialog({
        message: '<p class="text-center" style="margin-bottom:0px;"><i class="fa fa-spin fa-spinner"></i><br><span class="loading-message" style="font-size:15px;">Processando...</span></p>',
        closeButton: false,
        size: 'small',
        centerVertical: true,
        show: false,
        animate: false
      });
      function ShowLoading(message) {
        if ( typeof(message) == 'undefined' ) message = 'Processando...';
        bootboxLoadingWindow.find('.bootbox-body').find('.loading-message').html(message);
        bootboxLoadingWindow.modal('show');
      }
      function HideLoading() {
        bootboxLoadingWindow.modal('hide');
      }
    </script>
    

    @yield('page-scripts')
    <script type="text/javascript" src="{{url('/')}}/js/APP/app.js?{{time()}}"></script>
    
  </body>
</html>

@endsection
