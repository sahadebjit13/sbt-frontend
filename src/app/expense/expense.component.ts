import { animate, animation, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AgCharts, AgChartsModule } from "ag-charts-angular";
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ExpenseService } from '../service/expense.service';
import { Expense } from '../entity/expense';


export interface Transactions {
  expenseId: number;
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
  @Input() budgetOptions: AgChartsModule;


  ngOnInit(): void {

  }
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  expenseDataResponse!: Expense[]
  expenseDataChart!: any

  // TABLE------------------------
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  displayedColumns: string[] = ['expenseId', 'category', 'amount', 'date'];
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
  constructor(private expenseService: ExpenseService) {
    
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
    
    console.log(this.expenseDataResponse);


    this.budgetOptions = {
      theme: "ag-polychroma",
      data: [
        { type: "Income", amount: 60000 },
        { type: "Expense", amount: 40000 },
        { type: "Saving", amount: 20000 },
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

  
}
