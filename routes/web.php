<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');


Route::get('/', function () {
    return view('welcome');
});

// checklist 
Route::get('/checklist', 'ChecklistController@Checklist');
Route::post('/novoCheckList', 'ChecklistController@novoChecklist');
Route::get('/deletarck/{id}', 'ChecklistController@deletarChecklist');
Route::get('/editarck/{id}', 'ChecklistController@formEdita');
Route::post('/editarck/{id}', 'ChecklistController@editarChecklist');

//checklist itens

Route::post('/novoItem/{id}', 'ChecklistController@novoItem');
Route::get('/deletarItem/{id}', 'ChecklistController@deletarItem');

Route::get('/aprovar/{id}', 'ChecklistController@aprovar');
Route::get('/rejeitar/{id}', 'ChecklistController@rejeitar');



//rotas para o usuario
Route::post('/vincular', 'ChecklistController@vincularCk');
Route::get('/desvincular/{id}', 'ChecklistController@desvincularCk');
Route::get('/listItens/{id}', 'ChecklistController@listItens');
Route::get('/validar', 'ChecklistController@validar');


//funcoes dos aquivos 
Route::post('/store/{id}', 'FileController@store');
Route::get('/remove/{id}', 'FileController@remove');



Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
