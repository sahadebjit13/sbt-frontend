import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
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
  imports: [MatProgressBarModule, CommonModule, MatTooltipModule],
  template: `
  <ng-container>
    <div class="budgetCard">
      <div class="headingWrapper">
        <h5>{{heading}}</h5>
        <span class="material-symbols-outlined"
        matTooltip="Budget limit has been reached" 
        [matTooltipPosition]="'left'"
        *ngIf="limitReached">warning</span>
        <span class="material-symbols-outlined" 
        matTooltip="Budget limit has been exceeded" 
        [matTooltipPosition]="'left'"
        *ngIf="limitExceeded">error</span>
        <span class="material-symbols-outlined" 
        matTooltip="Expenditure is within limit" 
        [matTooltipPosition]="'left'"
        *ngIf="withinLimit">check_circle</span>
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
  withinLimit = false
  limitReached = false
  limitExceeded = false
  constructor() {
    setTimeout(() => {
      if(this.percentageSpent < 100)
      {
        this.withinLimit = true
        if(this.percentageSpent <= 40)
        {
          this.setWidth = 'width: '+this.percentageSpent+'%'
        } else if(this.percentageSpent <=80 && this.percentageSpent >40) {
          this.setWidth = 'width: '+this.percentageSpent+'%; background-color: gold;'
        } else if(this.percentageSpent <=90 && this.percentageSpent >80) {
            this.setWidth = 'width: '+this.percentageSpent+'%; background-color: var(--dark-orange);'
        } else { 
          this.setWidth = 'width: '+this.percentageSpent+'%; background-color: var(--light-warn);'
        }
      } else {
        this.setWidth = 'width: 100%; background-color: var(--light-warn)'
        if(this.percentageSpent == 100)
        this.limitReached = true
        else this.limitExceeded = true
      }
    }, 750);
  }
  
  

  handleDelete() {
    
    
  }
}
/* ----------Donut Chart---------- */
