@extends('layouts.app')

@section('content')

<style type="text/css">
  .img:hover{
    color: #424242; 
  -webkit-transition: all .3s ease-in;
  -moz-transition: all .3s ease-in;
  -ms-transition: all .3s ease-in;
  -o-transition: all .3s ease-in;
  transition: all .3s ease-in;
  z-index: 9999;
  opacity: 1;
  transform: scale(3);
  -ms-transform: scale(3); /* IE 9 */
  -webkit-transform: scale(3); /* Safari and Chrome */

}
</style>

<div class="container">
     
    @if(count($attachments))

    <div class="col-12"> &nbsp; </div>   
    
    <ul class="list-group">
      @foreach($attachments as $key => $attachment)
      
      <?php 
        $item = $attachment->checklist_item()->first();

        $ck = $item->checklist()->first();
        
        $usuario = $attachment->user()->first();

      ?>
      
      <li class="list-group-item d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column bd-highlight mb-3">
        <strong>Dados do usuário:</strong>
        Usuario: {{$usuario->name}}<br>
        E-mail: {{$usuario->email}}<br><br>
        </div>
        <div class="d-flex flex-column bd-highlight mb-3">
        <strong>Dados do Checklist:</strong>
        item: {{$ck->name}} <br>
        Descricao: {{$ck->description}}<br>
        </div>
        <div class="d-flex flex-column bd-highlight mb-3">
        <strong>Dados item:</strong>
        item: {{$item->name}} <br>
        Descricao: {{$item->description}}<br>
        </div>
        <div class="d-flex flex-column bd-highlight mb-3">
        <img width="200" height="150" 
                src="{{ url('storage')}}/anexo/{{$attachment->nameFile}}" 
                alt="{{ $attachment->ClientOriginalName }}" 
                class="img" >
        <a href="{{ url('aprovar')}}/{{$attachment->id}}" class="btn btn-success">Aprovar</a>
        <a href="{{ url('rejeitar')}}/{{$attachment->id}}" class="btn btn-danger">Reprovar</a>
        </div>
      </li>
      @endforeach
      
    </ul>
    @else
      Nada a ser validado!
    @endif
</div>
@endsection
