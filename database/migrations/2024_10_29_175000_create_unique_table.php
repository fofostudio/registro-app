<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up()
    {
        Schema::create('unique', function (Blueprint $table) {
            $table->id();
            $table->string('numero_especial');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('unique');
    }
};
