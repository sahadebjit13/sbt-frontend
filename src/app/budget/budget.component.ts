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
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-budget',
  standalone: true,
  imports: [OverviewCard, BudgetCard, CommonModule, FormsModule, MatTooltipModule],
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
  totalRemainingBudget!: any
  combinedDataItems!: any
  totalBudget!: any


  constructor(private budgetService: BudgetService, public matDialog: MatDialog, private dashboardComponent: DashboardComponent, private expenseService: ExpenseService) {
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
            this.combinedDataItems = this.combinedData.items
            this.totalRemainingBudget = Number(this.combinedData.total_remaining_budget).toFixed(0)
            
          },
          (error) => {console.log(error);
          }
        )
      },
      (error) => {console.log(error);
      })

    budgetService.getTotalBudgetByEmail().subscribe(
      (data) => {
        console.log(data);
        
        this.totalBudget = data
      },
      (error) => console.log(error)
      
    )
    
    
  }

  
  ngOnInit(): void {
    
  }  

  addItemDialog() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.id = "add-item-component"
    dialogConfig.height = "450px"
    dialogConfig.width = "800px"
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(AddItemComponent, dialogConfig);
  }

  updateItemDialog() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.id = "update-item-component"
    dialogConfig.height = "300px"
    dialogConfig.width = "800px"
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(UpdateItemComponent, dialogConfig);
  }

  deleteItemDialog() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.id = "update-item-component"
    dialogConfig.height = "250px"
    dialogConfig.width = "800px"
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(DeleteItemComponent, dialogConfig);
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
      <h1 id="modal-title">Create a new budget</h1>
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

  categories: string[] = ['Rent','Utilities','Food','Transportation','Healthcare','Entertainment','Personal Care','Education'];
  
  newBudget: Budget = { id: null, amount: 0, category: '', startDate: '', endDate: '', email: JSON.stringify(localStorage.getItem('email')).replaceAll(/["']+/g, '') }

  ngOnInit() {  }
  
  addFunction() {
    console.log('create start',this.newBudget.endDate.length);
    
    if(this.newBudget.amount > 0 && this.newBudget.endDate.length != 0 && this.newBudget.endDate.length != 0 )
    {
      console.log('inside create');
      
      this.budgetService.createBudget(this.newBudget).subscribe(
        (data) => {
          console.log('Item added', data);
          
        },
        (error) => {console.log(error);
        }
      )
    }
    else {
      alert('Please fill in all fields')
    }

    console.log('create end');
    

    this.closeAddItem();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeAddItem() {
    this.dialogRef.close();
  }
}

/* ======================================================================================================================================================= */

export interface UpdatedBudget {
  email: string
  category: string
  newAmount: number
}

@Component({
  selector: 'budget-add-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div id="modal-content-wrapper">
    <div id="modal-header">
      <h1 id="modal-title">Update an existing budget</h1>
    </div>
    <div>
    <form>

      <!-- Category Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="category">Choose a category:</label>
        <select id="category" class="form-control form-control-lg" name="category" [(ngModel)]="updatedBudget.category" >
          <option value="" >Select category</option>
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
      </div>

      <!-- Amount Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="newAmount">Amount to be allocated:</label>
        <input type="number" id="newAmount" class="form-control form-control-lg" placeholder="New amount" name="newAmount" [(ngModel)]="updatedBudget.newAmount" />
      </div>

      <!-- Submit Button -->
      <div id="modal-footer">
        <button mat-raised-button id="modal-update-item-button" (click)="updateFunction()">Update Amount</button>
        <button mat-raised-button id="modal-cancel-button" (click)="closeUpdateItem()">Cancel</button>
      </div>
    </form>


    </div>
    
  </div>`,
  styleUrl: './budget.component.css'
})
export class UpdateItemComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<UpdateItemComponent>, private authService: AuthService, private router: Router, private budgetService: BudgetService, private expenseService: ExpenseService) { }

  categories: string[] = ['Rent','Utilities','Food','Transportation','Healthcare','Entertainment','Personal Care'];



  updatedBudget: UpdatedBudget = { email: JSON.stringify(localStorage.getItem('email')).replaceAll(/["']+/g, ''), category: '', newAmount: 0}

  ngOnInit() {  }
  
  updateFunction() {
    if(this.updatedBudget.newAmount != 0 )
    {
      this.budgetService.updateBudgetbyCategoryAndEmail(this.updatedBudget).subscribe(
        (data) => {
          console.log('Item updated', data);
        },
        (error) => {console.log(error);
        }
      )
    }
    else {
      alert('Please fill in all fields')
    }
    
    console.log(this.updatedBudget);

    this.closeUpdateItem();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeUpdateItem() {
    this.dialogRef.close();
  }
}

/* ======================================================================================================================================================= */

export interface UpdatedBudget {
  email: string
  category: string
  newAmount: number
}

@Component({
  selector: 'budget-add-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div id="modal-content-wrapper">
    <div id="modal-header">
      <h1 id="modal-title">Delete an existing budget {{ category }}</h1>
    </div>
    <div>
    <form>

      <!-- Category Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="category">Choose a category:</label>
        <select id="category" class="form-control form-control-lg" name="category" [(ngModel)]="category" >
          <option value="" >Select category</option>
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
      </div>

      
      <!-- Submit Button -->
      <div id="modal-footer">
        <button mat-raised-button id="modal-delete-item-button" (click)="deleteFunction()">Delete Budget</button>
        <button mat-raised-button id="modal-cancel-button" (click)="closeDeleteItem()">Cancel</button>
      </div>
    </form>


    </div>
    
  </div>`,
  styleUrl: './budget.component.css'
})
export class DeleteItemComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<DeleteItemComponent>, private authService: AuthService, private router: Router, private budgetService: BudgetService, private expenseService: ExpenseService) { }

  categories: string[] = ['Rent','Utilities','Food','Transportation','Healthcare','Entertainment','Personal Care'];

  category!: string

  ngOnInit() {  }
  
  deleteFunction() {
    
    this.budgetService.getBudgetByEmail().subscribe(
      (data) => {
        const budget = data.find(budget => budget.category == this.category)
        if(budget && budget.id) {
          this.budgetService.deleteBudget(budget.id).subscribe(
            (data) => {
              console.log('Deleted : ', data);
            },(error) => {
              console.log(error);
              
            })
        }
      },
      (error) => {console.log(error);
      }
    )
    

    this.closeDeleteItem();
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeDeleteItem() {
    this.dialogRef.close();
  }
}