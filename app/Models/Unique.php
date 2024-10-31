<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unique extends Model
{
    protected $table = 'unique';
    protected $fillable = ['numero_especial'];
}