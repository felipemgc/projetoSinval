@extends('layouts.app')

@section('content')




<div class="modal fade bd-example-modal-xl" tabindex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <form action="{{ url('novoItem')}}/{{$id}}" method="post">
        @csrf
        
        <div class="col-12">&nbsp;</div>
        <div class="col-12">

            <h4> incluir item</h4>
            <div class="col-12">&nbsp;</div>
        <div class="form-group">
            <label for="name">Nome item</label>
            <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" placeholder="Nome" value="{{ old('name') }}">
            @error('name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
       
        <div class="form-group">
            <label for="description">Descrição</label>
            <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" placeholder="Descrição">{{ old('description') }}</textarea>
            @error('description')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        

        <button type="submit" class="btn btn-primary"> 
            Salvar
        </button>
        <div class="col-12">&nbsp;</div>
        </div>
    </form>
    </div>
  </div>
</div>


<div class="container">
    <h3>Editar: {{$ck->name}}</h3>
    <form action="{{ url('editarck')}}/{{$id}}" method="post">
        @csrf
       
        @if ($errors->any())
            <div class="alert alert-danger" role="alert">
                Please fix the following errors
            </div>
        @endif
        <div class="form-group">
            <label for="name">Nome Lista</label>
            <input type="text" class="form-control @error('name') is-invalid @enderror" id="name" name="name" placeholder="Nome" value="@if($ck->name){{$ck->name}} @else {{ old('name') }}@endif">
            @error('name')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
       
        <div class="form-group">
            <label for="description">Descrição</label>
            <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" placeholder="Descrição">@if($ck->description){{$ck->description}} @else {{ old('description') }}@endif</textarea>
            @error('description')
                <div class="invalid-feedback">{{ $message }}</div>
            @enderror
        </div>
        

        <button type="submit" class="btn btn-primary"> 
            Salvar
        </button>

        <button type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-xl">incluir item</button>
    </form>

    <div class="col-12"> &nbsp; </div>    
    <table class="table">
      <caption>Lista de itens do checklist</caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nome</th>
          <th scope="col">Descricao</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        @foreach($itens as $key => $item)
        <tr>
          <th scope="row">{{$item->id}}</th>
          <td>{{$item->name}}</td>
          <td>{{$item->description}}</td>
          <td><a href="{{url('deletarItem')}}/{{$item->id}}">x</a></td>
        </tr>
        @endforeach
       
      </tbody>
    </table> 
</div>
@endsection
