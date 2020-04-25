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
     
     

    <div class="col-12"> &nbsp; </div>   
    <h4>Checklist</h4>
    <strong>Nome: {{$ck->name}}</strong> 
    <p>Descrição: {{$ck->description}}</p>
    <ul class="list-group">
      @foreach($ck_itens as $key => $item)
      
      <?php
        $attachment = null;
        $attachment = $item->attachment($user->id);

      ?>
      
      <li class="list-group-item d-flex justify-content-between align-items-center">
        
        <a href="#" >{{$item->name}}: {{$item->description}}</a>
        @if($attachment)
        @if($attachment->approved)

          <p style="color:green">Aprovado</p>
        @elseif($attachment->unapproved)
       
          <p style="color:red">Rejeitado</p>
          <a href="{{ url('remove') }}/{{$attachment->id}}" >Remover arquivo</a>
        
        @elseif($attachment)
          
          <p style="color:blue">Em análise</p>
          <a href="{{ url('remove') }}/{{$attachment->id}}" >Remover arquivo</a>
          
        @endif 
        @endif
       
        @if($attachment)
          <img width="200" height="150" 
                src="{{ url('storage')}}/anexo/{{$attachment->nameFile}}" 
                alt="{{ $attachment->ClientOriginalName }}" 
                class="img" >
       
        @else
          <form action="{{ url('store') }}/{{$item->id}}" method="post" enctype="multipart/form-data">
            @csrf
            <input type="file" name="image_{{$item->id}}">
            <button type="submit" class="btn btn-outline-secondary">Enviar</button>
          </form>
        @endif  

           
      </li>
      @endforeach
      
    </ul>
</div>
@endsection
