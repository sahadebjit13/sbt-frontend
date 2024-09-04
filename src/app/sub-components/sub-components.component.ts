import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, ViewChild } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AgCharts, AgChartsModule } from 'ag-charts-angular';


@Component({
  selector: 'app-sub-components',
  standalone: true,
  imports: [],
  templateUrl: './sub-components.component.html',
  styleUrl: './sub-components.component.css'
})
export class SubComponentsComponent {

}

@Component({
  selector: 'overview-card',
  standalone: true,
  imports: [],
  template: `
  <ng-container>
    <div class="overviewCard">
      <h5>{{heading}}</h5>
      <hr>
      <span> <p>₹ {{data}}</p></span>
    </div>
  </ng-container>`,
  styleUrl: './sub-components.component.css',
})
export class OverviewCard {
  @Input() heading!: string
  @Input() data!: number
}
/* ----------Budget Car Component---------- */
@Component({
  selector: 'budget-card',
  standalone: true,
  imports: [MatProgressBarModule],
  template: `
  <ng-container>
    <div class="budgetCard">
      <div class="headingWrapper">
        <h5>{{heading}}</h5>
        <div class="iconWrapper">
          <span class="material-symbols-outlined">edit</span>
          <span class="material-symbols-outlined" (click)="handleDelete()" >delete</span>
        </div>
      </div>
      <hr>
      <div class="info">
        <div class="subHeading">
          <h5 style="text-align: end;">{{amountSpent}}/{{amountAllocated}}</h5>
          <span>Start: {{startDate}} ~ End: {{endDate}}</span>
        </div>
        <div class="progressWrapper">
          <div class="progressBar" [style]="setWidth"></div>
        </div>
      </div>
    </div>
  </ng-container>`,
  styleUrl: './sub-components.component.css',
})
export class BudgetCard {
  @Input() category!: string
  @Input() heading!: string
  @Input() amountAllocated!: number
  @Input() amountSpent!: number
  @Input() startDate!: string
  @Input() endDate!: string
  @Input() percentageSpent!: number
  // amountSpentRate = Number(this.amountAllocated)/Number(this.amountSpent)*100
  setWidth = 'width: 0'
  constructor() {
    setTimeout(() => {
      this.setWidth = 'width: '+this.percentageSpent+'%'
    }, 750);
  }
  
  

  handleDelete() {
    
    
  }
}
/* ----------Donut Chart---------- */
