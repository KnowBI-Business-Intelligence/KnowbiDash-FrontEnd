import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreateComponent } from './view-create.component';

describe('ViewCreateComponent', () => {
  let component: ViewCreateComponent;
  let fixture: ComponentFixture<ViewCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
