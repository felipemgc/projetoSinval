<?php

namespace App\Http\Controllers;

use Auth;
use Illuminate\Http\Request;
use App\Checklist;
use App\Checklist_item;
use App\Checklist_user;


class HomeController extends Controller
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
    public function index()
    {
        $user = Auth::user();
        
        $cks = Checklist::get();

        $cks_user = Checklist_user::where('user_id', $user->id)->get();

        return view('home', compact('user', 'cks', 'cks_user'));
    }
}
