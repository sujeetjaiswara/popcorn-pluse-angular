import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveListItemComponent } from './move-list-item.component';

describe('MoveListItemComponent', () => {
  let component: MoveListItemComponent;
  let fixture: ComponentFixture<MoveListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoveListItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MoveListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
