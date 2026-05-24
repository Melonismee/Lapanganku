<?php

use App\Http\Controllers\Api\AuthController;
use App\Models\Court;
use App\Models\Category;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'user']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);
Route::get('/courts', function () {return Court::with('category')->get();});
Route::get('/categories', function () {return Category::all();});
