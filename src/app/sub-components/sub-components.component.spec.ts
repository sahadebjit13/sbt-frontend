import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubComponentsComponent } from './sub-components.component';

describe('SubComponentsComponent', () => {
  let component: SubComponentsComponent;
  let fixture: ComponentFixture<SubComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubComponentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
