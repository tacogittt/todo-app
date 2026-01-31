<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HabitController extends Controller
{
    public function index()
    {
        // TODO: Fetch from database later
        $habits = [
            [
                'title' => '毎朝のランニング',
                'description' => '30分のジョギング',
                'streak' => 7,
                'completed' => false
            ],
            [
                'title' => '読書',
                'description' => '10ページ読む',
                'streak' => 3,
                'completed' => true
            ],
            [
                'title' => '瞑想',
                'description' => '5分間の瞑想',
                'streak' => 30,
                'completed' => false
            ]
        ];

        return view('home', compact('habits'));
    }
}
