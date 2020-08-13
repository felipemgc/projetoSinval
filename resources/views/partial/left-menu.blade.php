<nav class="sidebar-nav " style="background-color: #2D4357;">
    <ul class="nav">
        <li class="nav-item nav-dropdown">
            <a class="nav-link nav-dropdown-toggle" ><i class="nav-icon fa fa-folder-open" href='#'></i> Projeto (s)</a>
            <ul class="nav-dropdown-items">
            @if(Auth::user()->fk_profile == 1)
                <li class="nav-item">
                    <a class="nav-link" href="{{url('/')}}/?add=on">
                        <i class="nav-icon fa fa-folder-open"></i> Incluir Novo Projeto
                    </a>
                </li>
            @endif
                <li class="nav-item">
                    <a class="nav-link" href="{{url('/')}}/">
                        <i class="nav-icon fa fa-folder-open"></i> Listar Todos
                    </a>
                </li>       
            </ul>
        </li>
        @if(Auth::user()->fk_profile != 3)
        <li class="nav-item nav-dropdown">
            <a class="nav-link nav-dropdown-toggle" href="#"><i class="nav-icon fa fa-building" href='#'></i> Empresa (s)</a>
            <ul class="nav-dropdown-items">
                @if(Auth::user()->fk_profile == 1)
                <li class="nav-item">
                    <a class="nav-link " href="{{url('/')}}/empresas?add=on">
                        <i class="nav-icon fa fa-building"></i>  Incluir Nova Empresa
                    </a>
                </li>
                 @endif
                <li class="nav-item">
                    <a class="nav-link " href="{{url('/')}}/empresas">
                        <i class="nav-icon fa fa-building"></i>  Listas Todos
                    </a>
                </li>
            </ul>
        </li>

        @endif

                   
        <li class="nav-item nav-dropdown">
            <a class="nav-link nav-dropdown-toggle" href="#"><i class="nav-icon fa fa-users" href='#'></i> 
            @if(Auth::user()->fk_profile == 3)
                Conta
            @else
                Usuários
            @endif
            </a>
            <ul class="nav-dropdown-items">
            @if(Auth::user()->fk_profile == 1)
                <li class="nav-item">
                    <a class="nav-link " href="{{url('/')}}/usuarios?add=on">
                     <i class="nav-icon fa fa-users"></i> Incluir Novo Usuário
                    </a>
                </li>
            @endif
                <li class="nav-item">
                    <a class="nav-link " href="{{url('/')}}/usuarios">
                    @if(Auth::user()->fk_profile == 3)
                    <i class="nav-icon fa fa-users"></i> Acessar Conta
                    @else
                     <i class="nav-icon fa fa-users"></i> Listas Todos
                    @endif
                    </a>
                </li>
            </ul>
        </li>
               
        <!-- <li class="nav-item nav-dropdown">
            <a class="nav-link nav-dropdown-toggle" href="#"><i class="nav-icon fa fa-clock-o" href='#'></i> Time Sheet</a>
            <ul class="nav-dropdown-items">
            @if(Auth::user()->fk_profile == 1 || Auth::user()->fk_profile == 2)
                <li class="nav-item">
                    <a class="nav-link " href="/timeshet?add=on">
                     <i class="nav-icon fa fa-clock-o"></i> Lançar Registro
                    </a>
                </li>
            @endif
                <li class="nav-item">
                    <a class="nav-link " href="/timeshet">
                     <i class="nav-icon fa fa-clock-o"></i> Todos Registro
                    </a>
                </li>

                <li class="nav-item">
                    <a class="nav-link " href="/business">
                        <i class="nav-icon fa fa-clock-o"></i> Business Intelligence
                    </a>
                </li>
            </ul>
        </li> -->


        <li class="nav-item">
            <!-- Right Side Of Navbar -->
                    
        </li>

    </ul>
</nav>
