import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm!: FormGroup;
  submitted = false;
  userId: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    this.initForm();
    if (this.userId) {
      this.getUser();
    }
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get formControls() {
    return this.userForm.controls;
  }

  getUser(): void {
    this.userService.getUser(this.userId).subscribe(
      (user: User) => {
        if (user) {
          this.userForm.patchValue({
            name: user.name,
            email: user.email
          });
        } else {
          this.router.navigate(['/users']);
        }
      },
      (error) => {
        console.log('Error fetching user:', error);
      }
    );
  }

  onSubmit() {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    const user: User = {
      id: this.userId,
      name: this.userForm.value.name,
      email: this.userForm.value.email
    };

    if (this.userId) {
      this.userService.updateUser(user).subscribe(
        () => {
          console.log('User updated successfully');
          this.router.navigate(['/users']);
        },
        (error) => {
          console.log('Error updating user:', error);
        }
      );
    } else {
      this.userService.createUser(user).subscribe(
        () => {
          console.log('User created successfully');
          // Reset the form and submitted status
          this.userForm.reset();
          this.submitted = false;
        },
        (error) => {
          console.log('Error creating user:', error);
        }
      );
    }
  }
}
