import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (users: User[]) => {
        this.users = users;
      },
      (error) => {
        console.log('Error fetching users:', error);
      }
    );
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(
        () => {
          console.log('User deleted successfully');
          this.getUsers();
        },
        (error) => {
          console.log('Error deleting user:', error);
        }
      );
    }
  }

  editUser(id: number): void {
    this.router.navigate(['/edit', id]);
  }
}
