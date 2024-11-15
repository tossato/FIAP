<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{

    public function registrar(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|min:3',
            'email' => 'required|email|string|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed'
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json(compact('user', 'token'), 201);
    }

    public function login(Request $request)
    {
        $credenciais = $request->only('email', 'password');


        try {
            $token = JWTAuth::attempt($credenciais);

            if(!$token){
                return response()->json(['message' => "Email e/ou senha não conferem."], 401);
            }
        }
        catch(JWTException $err){
            return response()->json(['message' => "Token não criado"], 500);
        }

        session(['auth_token' => $token]);
        return response()->json(compact('token'));
    }

    public function logout(Request $request)
    {
        try{
            $token = JWTAuth::getToken();

            if (!$token) {
                return response()->json(['error' => 'Token não fornecido'], 400);
            }

            JWTAuth::invalidate(true);

            session()->forget('auth_token');

            return response()->json(['message' => 'Logout efetuado com sucesso']);
        }
        catch (JWTException $e) {

            return response()->json(['error' => 'Falha ao fazer logout'], 500);
        }
    }

    public function getUsuarioAutenticado()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (TokenExpiredException $e) {
            return response()->json(['error' => 'Token expirado'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Token ausente'], 401);
        }

        return response()->json(compact('user'));
    }
}
