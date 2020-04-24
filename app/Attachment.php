<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $table = 'attachment';

    public $timestamps = false;
    
    protected $connection = 'mysql';
    
    public function user()
    {
        return $this->belongsTo('App\User','user_id','user_id');
    }

    public function item(){
        return $this->hasOne('App\Item','item_id','item_id');
    }
}
    
