import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { BudgetComponent } from "../budget/budget.component";
import { ExpenseComponent } from "../expense/expense.component";
import { AnalyticsComponent } from '../analytics/analytics.component';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../authentication/auth.service';
import { NewsComponent } from "../news/news.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, BudgetComponent, ExpenseComponent, AnalyticsComponent, MatIconModule, NewsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  content!: string
  contentId = 1
  constructor(public matDialog: MatDialog) {
  }
  @ViewChild(BudgetComponent) budgetComponent!: BudgetComponent

  ngOnInit(): void {
      
  }


  changeDashboardContent(content: number) {
    this.contentId = content
  }

  logoutDialog() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.id = "logout-component"
    dialogConfig.height = "200px"
    dialogConfig.width = "600px"
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(LogoutComponent, dialogConfig);
  }
}

@Component({
  selector: 'dashboard-logout',
  standalone: true,
  template: `
  <div id="modal-content-wrapper">
    <div id="modal-header">
      <h1 id="modal-title">You will be logged out.<br>
        Are you sure you want to logout?</h1>
    </div>
    <div id="modal-footer">
      <button mat-raised-button id="modal-logout-button" (click)="actionFunction()">Logout</button>
      <button mat-raised-button id="modal-cancel-button" (click)="closeLogout()">Cancel</button>
    </div>
  </div>`,
  styleUrl: './dashboard.component.css'
})
export class LogoutComponent implements OnInit{
  constructor(public dialogRef: MatDialogRef<LogoutComponent>, private authService: AuthService, private router: Router) { }

  
  ngOnInit() {  }

  // When the user clicks the action button a.k.a. the logout button in the\
  // modal, show an alert and followed by the closing of the modal
  actionFunction() {
    this.authService.logout();
    this.router.navigate(['/login'])
    this.closeLogout();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeLogout() {
    this.dialogRef.close();
  }
}
