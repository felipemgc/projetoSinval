@extends('layouts.app')

@section('content')
<div class="container">
     
     <form action="{{ url('vincular') }}" method="post">
       @csrf
      
      <div class="input-group">
        <select class="custom-select" id="lists" name="lists" aria-label="Example select with button addon">
          <option selected>Escolha...</option>
          @foreach($cks as $key => $ck)
             <option value="{{$ck->id}}">{{$ck->name}}</option>
          
          @endforeach
        </select>
        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="submit">Adicionar</button>
        </div>
      </div>
    </form>

    <div class="col-12"> &nbsp; </div>   
    @if(count($cks_user))
    <h4>Checklists</h4> 
    <ul class="list-group">
      @foreach($cks_user as $key => $ck_user)
      <?php

        $ck = $ck_user->checklist();

      ?>

      @if($ck)
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <span class="badge badge-primary badge-pill ">{{$ck->Checklist_itens()->count()}}</span>
        <a href="{{url('listItens')}}/{{$ck_user->id}}" >{{$ck->name}}: {{$ck->description}}</a>
        <a href="{{url('desvincular')}}/{{$ck_user->id}}" >x</a>
      </li>
      @endif
      @endforeach
      
    </ul>
    @else
      Não há checklists associados.
    @endif
</div>
@endsection
