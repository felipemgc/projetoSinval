<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\Checklist;
use App\Checklist_item;
use App\Checklist_user;

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
        $cks = CheckList::get();    


        return view('config', compact('cks'));
    }
    public function formEdita(request $request , $id)
    {
        $ck = CheckList::where('id', $id)->first();

        $itens = CheckList_item::where('checklist_id', $id)->get();

        return view('configEdita', compact('ck', 'itens', 'id'));
    }
    

    public function novoChecklist(request $request)
    {
       $data = $request->validate([
        'name' => 'required|max:255',
        'description' => 'required|max:255',
        ]);

        $ck = new CheckList();
        $ck->name = $data['name'];
        $ck->description = $data['description'];
        $ck->save();

        return redirect('/checklist');
    }

    
    public function deletarChecklist(request $request, $id)
    {
        CheckList::where('id', $id)->delete();

        return redirect('/checklist');
    }

    public function editarChecklist(request $request, $id)
    {
        $ck = CheckList::where('id', $id)->first();
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

        $ck_item = new CheckList_item();
        $ck_item->checklist_id = $id;
        $ck_item->name = $data['name'];
        $ck_item->description = $data['description'];
        $ck_item->save();

        return redirect('/editarck/'.$id);
    }

    public function deletaritem(request $request, $id)
    {
    
        $item = CheckList_item::where('id', $id)->first();
        $idck = $item->checklist_id;

        CheckList_item::where('id', $id)->delete();

        return redirect('/editarck/'.$idck);
    }

    public function vincularCk(request $request)
    {
    
        $user = Auth::user();

        $ck_user = new CheckList_user();
        $ck_user->user_id = $user->id;
        $ck_user->checklist_id = $request->input('lists');
        $ck_user->save();

        return redirect('/home');
    }


    
    
}
