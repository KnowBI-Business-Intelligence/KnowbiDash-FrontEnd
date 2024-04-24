import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardsViewComponent } from './dashboards-view.component';

describe('DashboardsViewComponent', () => {
  let component: DashboardsViewComponent;
  let fixture: ComponentFixture<DashboardsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardsViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
