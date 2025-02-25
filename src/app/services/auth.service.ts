import { inject, Injectable, OnInit, Signal, WritableSignal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User } from '../model/user.type';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient); // http request maker
  token: string = '';
  userObj: User = { id: 0, name: '',
    email: '', password: '', role: '', avatar: '', creationAt: '', updatedAt: '' };

  initialize() { // == useEffect()
    localStorage.getItem('token') ? this.token = localStorage.getItem('token') || '' : this.token = '';
    console.log(this.token);
  }

  baseUrl: string = 'https://api.escuelajs.co/api/v1/auth';
  
  async login(email: string, password: string, signal: WritableSignal<string>): Promise<any> {
    try {
      const response = await firstValueFrom(this.http.post<any>(`${this.baseUrl}/login`, 
        { email, password }, 
        { headers: { 'Content-Type': 'application/json' } }
      ));
      if (response.access_token) {
        this.getUserInfo()
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

  async getUserInfo() {
    if(this.userObj.id) return;
    try {
      const response = await firstValueFrom(this.http.get<User>(`https://api.escuelajs.co/api/v1/auth/profile`, 
        { headers: { 'Authorization': `Bearer ${this.token}` } }
      ));
      this.userObj = response;
      console.log(this.userObj);
    } catch (error: any) {
      console.log(error.message);
      throw error;
    }
  }

  logout() {
    this.token = '';
    localStorage.removeItem('token');
  }

  constructor() { }
}
