<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Checklist;
use App\Checklist_item;
use App\Checklist_user;

use App\Attachment;



class FileController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $id)
    {
        // Define o valor default para a variável que contém o nome da imagem 
        $nameFile = null;
     
        // Verifica se informou o arquivo e se é válido
        if ($request->hasFile('image_'.$id) && $request->file('image_'.$id)->isValid()) {
             
            // Define um aleatório para o arquivo baseado no timestamps atual
            $name = uniqid(date('HisYmd'));
     
            // Recupera a extensão do arquivo
            $extension = $request->file('image_'.$id)->extension();
     
            // Define finalmente o nome
            $nameFile = "{$name}.{$extension}";
     
            // Faz o upload:
            $upload = $request->file('image_'.$id)->storeAs('anexo', $nameFile);
            // Se tiver funcionado o arquivo foi armazenado em storage/app/public/anexo/nomedinamicoarquivo.extensao
            $this->savedb($request->file('image_'.$id), $id, $nameFile);
            // Verifica se NÃO deu certo o upload (Redireciona de volta)
            if ( !$upload ){
                return redirect()
                            ->back()
                            ->with('error', 'Falha ao fazer upload')
                            ->withInput();
            }else{
                return redirect()->back();
            }
     
        }
    }

    public function savedb($imagem, $checklist_item_id, $nameFile)
    {
        $user = Auth::user();

        // Retorna mime type do arquivo (Exemplo image/png)
        $MimeType = $imagem->getMimeType();
         
        // Retorna o nome original do arquivo
        $ClientOriginalName = $imagem->getClientOriginalName() ;
         
        // Extensão do arquivo
        $ClientOriginalExtension = $imagem->getClientOriginalExtension();
        
        $extension = $imagem->extension();
         
        // Tamanho do arquivo
        $ClientSize = $imagem->getSize();

        $attachment = new Attachment();
        $attachment->user_id = $user->id;
        $attachment->checklist_item_id = $checklist_item_id;
        $attachment->MimeType = $MimeType;
        $attachment->ClientOriginalName = $ClientOriginalName;
        $attachment->ClientOriginalExtension = $ClientOriginalExtension;
        $attachment->extension = $extension;
        $attachment->ClientSize = $ClientSize;
        $attachment->nameFile = $nameFile;
        $attachment->save();

    }

    public function remove(Request $request, $id)
    {

        $user = Auth::user();

        Attachment::where('id', $id)->delete();

        return redirect()->back();

    }



    

    
    
}
