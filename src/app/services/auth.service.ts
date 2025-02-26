import { inject, Injectable, OnInit, Signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/user.type';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient); // http request maker
  token: string = '';
  tokenObj: any = {};

  initialize() { // == useEffect()
    localStorage.getItem('token') ? this.token = localStorage.getItem('token') || '' : this.token = '';
    if (this.token) {
      this.tokenObj = jwtDecode(this.token);
    }
    console.log(this.tokenObj);
  }

  baseUrl: string = 'https://api.escuelajs.co/api/v1/auth';
  
  async login(email: string, password: string, signal: WritableSignal<string>): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.baseUrl}/login`, 
        { email, password }, 
        { headers: { 'Content-Type': 'application/json' } }
      ));
      if (response.access_token) {
        this.token = response.access_token;
        localStorage.setItem('token', this.token);
        signal.set('Okay');
        return response;
      } else {
        signal.set('Wrong credentials!');
        throw new Error('Wrong credentials!');
      }
    } catch (error: any) {
      signal.set(error.message);
      throw error;
    }
  }
  
  async signup(email: string, password: string, signal: WritableSignal<string>): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.baseUrl}/login`, // no actual signup endpoint
        { email, password }, 
        { headers: { 'Content-Type': 'application/json' } }
      ));
      if (response.access_token) {
        this.token = response.access_token;
        localStorage.setItem('token', this.token);
        signal.set('Okay');
        return response;
      } else {
        signal.set('Some issues');
        throw new Error('Some issues');
      }
    }
    catch (error: any) {
      signal.set(error.message);
      throw error;
    }
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
  }

  constructor() { }
}
