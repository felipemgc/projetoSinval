<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Checklist_item extends Model
{
    protected $table = 'checklist_item';

    public $timestamps = false;
    
    protected $connection = 'mysql';
    
    public function checklist()
    {
        return $this->belongsTo('App\checklist','id','checklist_id');
    }

    

}

    
