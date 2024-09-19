import { Component, Input } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExpenseService } from '../service/expense.service';
import { Expense } from '../entity/expense';
import { AgCharts, AgChartsModule } from 'ag-charts-angular';
import { trigger, transition, style, animate } from '@angular/animations';

interface MonthlyExpense {
  id: number
  month: string
  income: string
  expense: number
  saving: string
  rating: string
}

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [MatTableModule, AgCharts],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  animations: [trigger('fade', [ 
    transition('void => *', [
      style({ opacity: 0 }), 
      animate(750, style({opacity: 1}))
    ]) 
  ])]
})
export class AnalyticsComponent {
  @Input() historyOptions = {}
  
  displayedColumns: string[] = [ 'month', 'income', 'expense', 'saving', 'rating'];
  dataSource = new MatTableDataSource<MonthlyExpense>();
  monthlyExpenseList!: any

  getMonthlyExpenses(expenses: Expense[]): MonthlyExpense[] {
    const monthlyExpensesMap: { [key: string]: { totalExpense: number } } = {};
  
    // Helper to convert month number to month name
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    expenses.forEach(expense => {
      try {
        const date = new Date(expense.date);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date format");
        }
        const year = date.getFullYear();
        const monthIndex = date.getMonth(); // 0-based index
        const monthName = monthNames[monthIndex];
        const monthYear = `${monthName} ${year}`; // Format: "Month YYYY"
  
        if (!monthlyExpensesMap[monthYear]) {
          monthlyExpensesMap[monthYear] = { totalExpense: 0 };
        }
  
        monthlyExpensesMap[monthYear].totalExpense += expense.amount;
      } catch (error) {
        console.error(`Error processing expense ID ${expense.expenseId}:`, error);
      }
    });
    let id = expenses.length
    // Convert the object to an array with monthly expense data and rating
    const monthlyExpenses: MonthlyExpense[] = Object.keys(monthlyExpensesMap).map(month => {
      const totalExpense = monthlyExpensesMap[month].totalExpense;
      let rating = "N/A";
      if (totalExpense < 7500) {
        rating = "Good";
      } else if (totalExpense >= 7500 && totalExpense <= 15000) {
        rating = "Moderate";
      } else if (totalExpense > 15000) {
        rating = "Bad";
      }

      let saving = (20000 - totalExpense).toString()
  
      return {
        id: id--,
        month,
        income: "20000", // Placeholder for income data
        expense: Number(totalExpense.toFixed(2)),
        saving, // Placeholder for savings calculation
        rating
      };
    });

    monthlyExpenses.sort((a, b) => {
      const [monthA, yearA] = a.month.split(" ");
      const [monthB, yearB] = b.month.split(" ");
      const monthIndexA = monthNames.indexOf(monthA);
      const monthIndexB = monthNames.indexOf(monthB);
  
      if (yearA === yearB) {
        return monthIndexB - monthIndexA; // Sort by month if years are the same
      }
      return parseInt(yearB) - parseInt(yearA); // Sort by year
    });
  
    return monthlyExpenses;
  }

  constructor(private expenseService: ExpenseService) {
    expenseService.getExpenseByEmail().subscribe(
      (data) => {
        this.monthlyExpenseList = this.getMonthlyExpenses(data)
        console.log(this.monthlyExpenseList);
        this.historyOptions = {
          title: {
            text: "Price Distribution",
            fontFamily: "Montserrat"
          },
          subtitle: {
            text: "",
          },
          data: this.monthlyExpenseList,
          series: [
            {
              type: "bar",
              xKey: "month",
              yKey: "expense",
            },
          ],
          legend: {
            item: {
              label: {
                fontSize: 16,
                fonFamily: 'Montserrat'
              }
            }
          },
          background: {
            visible: false,
          }
        };

      },
      (error) => {
        console.log();
      }
    )
  }
}
