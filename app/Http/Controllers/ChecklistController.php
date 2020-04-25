<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Checklist;
use App\Checklist_item;
use App\Checklist_user;
use App\Attachment;

class ChecklistController extends Controller
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
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function checklist(request $request)
    {
        $user = Auth::user();
        $cks = Checklist::get();    
        

        return view('config', compact('user', 'cks'));
    }
    public function formEdita(request $request , $id)
    {
        $user = Auth::user();
        $ck = Checklist::where('id', $id)->first();

        $itens = Checklist_item::where('checklist_id', $id)->get();

        return view('configEdita', compact('user', 'ck', 'itens', 'id'));
    }
    

    public function novoChecklist(request $request)
    {
         
        $data = $request->validate([
        'name' => 'required|max:255',
        'description' => 'required|max:255',
        ]);

        $ck = new Checklist();
        $ck->name = $data['name'];
        $ck->description = $data['description'];
        $ck->save();

        return redirect('/checklist');
    }

    
    public function deletarChecklist(request $request, $id)
    {
        Checklist::where('id', $id)->delete();

        return redirect('/checklist');
    }

    public function editarChecklist(request $request, $id)
    {
        $ck = Checklist::where('id', $id)->first();
        $ck->name = $request->input('name');
        $ck->description = $request->input('description');
        $ck->save();

        return redirect('/editarck/'.$id);
    }

    //itens

    public function novoItem(request $request, $id)
    {
        $data = $request->validate([
            'name' => 'required|max:255',
            'description' => 'max:255',
        ]);

        $ck_item = new Checklist_item();
        $ck_item->checklist_id = $id;
        $ck_item->name = $data['name'];
        $ck_item->description = $data['description'];
        $ck_item->save();

        return redirect('/editarck/'.$id);
    }

    public function deletaritem(request $request, $id)
    {
    
        $item = Checklist_item::where('id', $id)->first();
        $idck = $item->checklist_id;

        Checklist_item::where('id', $id)->delete();

        return redirect('/editarck/'.$idck);
    }

    public function vincularCk(request $request)
    {
    
        $user = Auth::user();

        $ck_user = new Checklist_user();
        $ck_user->user_id = $user->id;
        $ck_user->checklist_id = $request->input('lists');
        $ck_user->save();

        return redirect('/home');
    }
    public function desvincularCk(request $request, $id)
    {   

        Checklist_user::where('id', $id)->delete();

        return redirect('/home');
    }

    public function listItens(request $request, $id)
    {   


        $user = Auth::user();

        $ck_user = Checklist_user::where('id', $id)->first();
        if($ck_user){
            $ck = Checklist::where('id', $ck_user->checklist_id)->first();

            $ck_itens = Checklist_item::where('checklist_id', $ck_user->checklist_id)->get();
        }

        return view('listItens', compact('user','ck_user', 'ck', 'ck_itens'));
    }

    public function validar(request $request){
        $user = Auth::user();
        $attachments = Attachment::where('approved', 0)->
                                    where('unapproved', 0)->get();
                                   
        return view('validar', compact('user', 'attachments'));


    }

    public function aprovar(request $request, $id){
        Attachment::where('id', $id)
                        ->update(['approved' => 1]);
        return redirect()->back();

    }

    public function rejeitar(request $request, $id){
        Attachment::where('id', $id)
                        ->update(['unapproved' => 1]);
        return redirect()->back();

    }





    

    
    
}
