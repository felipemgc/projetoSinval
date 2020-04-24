<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Checklist extends Model
{
    protected $table = 'checklist';

    public $timestamps = false;
    
    protected $connection = 'mysql';
    
    public function Checklist_itens()
    {
    	return $this->hasMany('App\Checklist_item','checklist_id','id');
    }
}

    
