<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Checklist_user extends Model
{
    protected $table = 'checklist_user';

    public $timestamps = false;
    
    protected $connection = 'mysql';
    
    public function checklist()
    {
        return $this->belongsTo('App\checklist','checklist_id', 'id')->first();
    }

    public function user()
    {
        return $this->belongsTo('App\user','id','user_id');
    }

    

}

    
