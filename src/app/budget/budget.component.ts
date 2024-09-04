import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { OverviewCard, BudgetCard } from "../sub-components/sub-components.component";
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogTitle, MatDialogContent, MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogClose, MatDialogConfig } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { trigger, transition, style, animate } from '@angular/animations';
import { BudgetService } from '../service/budget.service';
import { error } from 'console';
import { Budget } from '../entity/budget';
import { CommonModule, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { ExpenseService } from '../service/expense.service';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [OverviewCard, BudgetCard, CommonModule, FormsModule],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
  animations: [trigger('fade', [ 
    transition('void => *', [
      style({ opacity: 0 }), 
      animate(750, style({opacity: 1}))
    ]) 
  ])]
})
export class BudgetComponent implements OnInit {
  
  budgetData!: Budget[]
  summaryData!: any
  combinedData!: any


  constructor(private budgetService: BudgetService, public matDialog: MatDialog, private dashboardComponent: DashboardComponent,private expenseService: ExpenseService) {
    budgetService.getBudgetByEmail().subscribe(
      (data) => {
        this.budgetData = data
        console.log('Fetched Budget', data)
        expenseService.getBudgetSummary().subscribe(
          (data) => {
            this.summaryData = data
            console.log(this.summaryData);
            
            this.combinedData = {
              total_remaining_budget: this.summaryData.total_remaining_budget,
              items: this.budgetData.map(item => ({
                ...item,
                used_budget: (item.amount - Number(this.summaryData[`${item.category}_remaining_budget`])).toFixed(2),
                percentage_spent: Number(this.summaryData[`${item.category}_percentage_spent`])
              }))
            };
            console.log(this.combinedData);
            
          },
          (error) => {console.log(error);
          }
        )
      },
      (error) => {console.log(error);
      })
    
    
  }

  
  ngOnInit(): void {
    
  }  

  addItemDialog() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.id = "logout-component"
    dialogConfig.height = "450px"
    dialogConfig.width = "800px"
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(AddItemComponent, dialogConfig);
  }
}

/* ======================================================================================================================================================= */

@Component({
  selector: 'budget-add-item',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  template: `
  <div id="modal-content-wrapper">
    <div id="modal-header">
      <h1 id="modal-title">Add an item</h1>
    </div>
    <div>
    <form>
      <!-- Amount Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="amount">Amount to be allocated:</label>
        <input type="number" id="amount" class="form-control form-control-lg" placeholder="Amount" name="amount" [(ngModel)]="newBudget.amount" />
      </div>

      <!-- Category Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="category">Choose a category:</label>
        <select id="category" class="form-control form-control-lg" name="category" [(ngModel)]="newBudget.category" >
          <option value="" >Select category</option>
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
      </div>

      <!-- Start Date Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="startDate">Select start date:</label>
        <input type="date" id="startDate" class="form-control form-control-lg" name="startDate" [(ngModel)]="newBudget.startDate" />
      </div>

      <!-- End Date Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="endDate">Select end date:</label>
        <input type="date" id="endDate" class="form-control form-control-lg" name="endDate" [(ngModel)]="newBudget.endDate" />
      </div>

      <!-- Submit Button -->
      <div id="modal-footer">
        <button mat-raised-button id="modal-add-item-button" (click)="addFunction()">Add Item</button>
        <button mat-raised-button id="modal-cancel-button" (click)="closeAddItem()">Cancel</button>
      </div>
    </form>


    </div>
    
  </div>`,
  styleUrl: './budget.component.css'
})
export class AddItemComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<AddItemComponent>, private authService: AuthService, private router: Router, private budgetService: BudgetService, private expenseService: ExpenseService) { }

  categories: string[] = ['Rent','Utilities','Food','Transportation','Healthcare','Entertainment','Personal Care'];
  
  newBudget: Budget = { amount: 0, category: '', startDate: '', endDate: '', email: JSON.stringify(localStorage.getItem('email')).replaceAll(/["']+/g, '') }

  ngOnInit() {  }
  
  addFunction() {
    if(this.newBudget.amount != 0 && this.newBudget.category.length != 0 && this.newBudget.endDate.length != 0 && this.newBudget.endDate.length != 0 )
    {
      const create = this.budgetService.createBudget(this.newBudget).subscribe(
        (data) => {
          console.log('Item added', data);
          
        },
        (error) => {console.log(error);
        }
      )
      create.unsubscribe()
    }
    else {
      alert('Please fill in all fields')
    }
    
    console.log(this.newBudget);

    this.closeAddItem();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeAddItem() {
    this.dialogRef.close();
  }
}
