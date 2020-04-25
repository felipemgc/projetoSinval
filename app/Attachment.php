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
        return $this->belongsTo('App\user', 'user_id', 'id');
    }

    public function checklist_item()
    {
        return $this->belongsTo('App\Checklist_item', 'checklist_item_id', 'id');
    }
}
    
