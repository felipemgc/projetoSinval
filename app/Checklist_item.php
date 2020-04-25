<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Attachment;

class Checklist_item extends Model
{
    protected $table = 'checklist_item';

    public $timestamps = false;
    
    protected $connection = 'mysql';
    
    public function checklist()
    {
        return $this->belongsTo('App\checklist','checklist_id','id');
    }

    public function attachment($user_id){
    	return Attachment::where('checklist_item_id', $this->id)->where('user_id', $user_id)->first();

    }
    

}

    
