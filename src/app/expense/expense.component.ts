import { animate, animation, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AgCharts, AgChartsModule } from "ag-charts-angular";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ExpenseService } from '../service/expense.service';
import { Expense } from '../entity/expense';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { Budget } from '../entity/budget';
import { BudgetService } from '../service/budget.service';


export interface Transactions {
  category: string;
  amount: number;
  date: Date;
}


interface AccumulatedExpense {
  category: string;
  amount: number;
}


@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [AgCharts, MatTableModule, MatPaginatorModule],
  templateUrl: './expense.component.html',
  styleUrl: './expense.component.css',
  animations: [trigger('fade', [ 
    transition('void => *', [
      style({ opacity: 0 }), 
      animate(750, style({opacity: 1}))
    ]) 
  ])]
})
export class ExpenseComponent implements OnInit, AfterViewInit{
  @Input() expenseOptions: AgChartsModule = {}
  @Input() budgetOptions: AgChartsModule = {}

  totalBudget!: number
  remainingBudget!: number
  usedBudget!: number


  ngOnInit(): void {

  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  expenseDataResponse!: Expense[]
  expenseDataChart!: any
  budgetDataChart!: any

  // TABLE------------------------
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = [ 'category', 'amount', 'date'];
  dataSource = new MatTableDataSource<Expense>();

  getExpenseChartDetails(expenses: Expense[]){

    const accumulatedExpenses: { [key: string]: AccumulatedExpense } = expenses.reduce((acc, expense) => {
      if (!acc[expense.category]) {
          acc[expense.category] = { category: expense.category, amount: 0 };
      }
      acc[expense.category].amount += expense.amount;
      return acc;
      }, {} as { [key: string]: AccumulatedExpense });
  
  // Convert to array of accumulated expenses
    const result: AccumulatedExpense[] = Object.values(accumulatedExpenses);
    
    return result
  }


  // -----------------------------
  constructor(private expenseService: ExpenseService, private budgetService: BudgetService, public matDialog: MatDialog) {
    
    expenseService.getExpenseByEmail().subscribe(
      (data) => {
        this.expenseDataResponse = data;
        this.expenseOptions = {
          theme: "ag-polychroma",
          data: this.getExpenseChartDetails(this.expenseDataResponse),
          title: {
            text: "Expenses",
            fontFamily: 'Montserrat'
          },
          series: [
            {
              type: "donut",
              calloutLabelKey: "category",
              angleKey: "amount",
              innerRadiusRatio: 0.7,
            },
          ],
          tooltip: {
            class: "chart"
          },
          legend: {
            position: 'top', // 'top', 'right', 'left',
            item: {
              label: {
                fontSize: 16,
                fontFamily: 'Montserrat'
              }
            }
          },
          background: {
            visible: false,
          }
        };

      },
      (error) => {console.log(error);
      }
    )

    budgetService.getTotalBudgetByEmail().subscribe(
      (data) => {
        this.totalBudget = Number(data.toString())
        expenseService.getBudgetSummary().subscribe(
          (data) => {
            this.budgetDataChart = data
            this.remainingBudget = Number(this.budgetDataChart.total_remaining_budget)
            
            this.budgetOptions = {
              theme: "ag-polychroma",
              data: [
                { type: "Total Budget", amount: this.totalBudget },
                { type: "Remaining Budget", amount: this.remainingBudget },
                { type: "Used Budget", amount: this.totalBudget - this.remainingBudget },
              ],
              title: {
                text: "Budget",
                fontFamily: 'Montserrat'
              },
              series: [
                {
                  type: "donut",
                  calloutLabelKey: "type",
                  angleKey: "amount",
                  innerRadiusRatio: 0.7,
                },
              ],
              tooltip: {
                class: "chart"
              },
              legend: {
                position: 'top', // 'top', 'right', 'left',
                item: {
                  label: {
                    fontSize: 16,
                    fontFamily: 'Montserrat'
                  }
                }
              },
              background: {
                visible: false,
              }
            };
          }
        )
        
        
      }
    )
    setTimeout(() => {
      
    }, 1000);
    console.log(this.totalBudget);
    
    console.log(this.expenseDataResponse);


    
  }


  addItemDialog() {
    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    //dialogConfig.disableClose = true;
    dialogConfig.id = "add-item-component"
    dialogConfig.height = "360px"
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
      <h1 id="modal-title">Add a new expense</h1>
    </div>
    <div>
    <form>
      <!-- Amount Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="amount">Amount spent:</label>
        <input type="number" id="amount" class="form-control form-control-lg" placeholder="Amount" name="amount" [(ngModel)]="newExpense.amount" />
      </div>

      <!-- Category Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="category">Choose a category:</label>
        <select id="category" class="form-control form-control-lg" name="category" [(ngModel)]="newExpense.category" >
          <option value="" >Select category</option>
          <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
        </select>
      </div>

      <!-- Start Date Field -->
      <div class="form-outline mb-4 inputFields">
        <label for="startDate">Select expense date:</label>
        <input type="date" id="startDate" class="form-control form-control-lg" name="startDate" [(ngModel)]="newExpense.date" />
      </div>

      <!-- Submit Button -->
      <div id="modal-footer">
        <button mat-raised-button id="modal-add-item-button" (click)="addFunction()">Add Item</button>
        <button mat-raised-button id="modal-cancel-button" (click)="closeAddItem()">Cancel</button>
      </div>
    </form>


    </div>
    
  </div>`,
  styleUrl: './expense.component.css'
})
export class AddItemComponent implements OnInit{

  constructor(public dialogRef: MatDialogRef<AddItemComponent>, private authService: AuthService, private router: Router, private budgetService: BudgetService, private expenseService: ExpenseService) { }

  categories: string[] = ['Rent','Utilities','Food','Transportation','Healthcare','Entertainment','Personal Care','Education'];
  
  newExpense: Expense = { expenseId: null, amount: 0, category: '', date: '', email: JSON.stringify(localStorage.getItem('email')).replaceAll(/["']+/g, '') }

  ngOnInit() {  }
  
  addFunction() {
    // console.log('create start',this.newBudget.endDate.length);
    
    if(this.newExpense.amount > 0 && this.newExpense.date.length != 0)
    {
      console.log('inside create');
      
      this.expenseService.createExpense(this.newExpense).subscribe(
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

