import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.http.post('/auth/logout', {}).subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
