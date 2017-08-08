import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAddButtonComponent } from './room-add-button.component';

describe('RoomAddButtonComponent', () => {
  let component: RoomAddButtonComponent;
  let fixture: ComponentFixture<RoomAddButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAddButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAddButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
