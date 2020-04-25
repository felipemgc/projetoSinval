@extends('layouts.app')

@section('content')
<div class="container">
    <h3>Adicionar</h3>
    <form action="{{ url('novoCheckList') }}" method="post">
        @csrf
       
        @if ($errors->any())
            <div class="alert alert-danger" role="alert">
                Please fix the following errors
            </div>
        @endif
        <div class="form-group">
            <label for="name">Checklist</label>
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
            Adicionar
        </button>
    </form>

    <div class="col-12"> &nbsp; </div>    
    <table class="table">
      <caption>Lista de checklists</caption>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Nome</th>
          <th scope="col">Descricao</th>
          <th scope="col">Ações</th>
        </tr>
      </thead>
      <tbody>
        @foreach($cks as $key => $ck)
        <tr>
          <th scope="row">{{$ck->id}}</th>
          <td><a href="{{url('editarck')}}/{{$ck->id}}">{{$ck->name}}</a></td>
          <td><a href="{{url('editarck')}}/{{$ck->id}}">{{$ck->description}}</a></td>
          <td><a href="{{url('deletarck')}}/{{$ck->id}}">x</a></td>
        </tr>
        @endforeach
       
      </tbody>
    </table> 
</div>
@endsection
