import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomEditButtonComponent } from './room-edit-button.component';

describe('RoomEditButtonComponent', () => {
  let component: RoomEditButtonComponent;
  let fixture: ComponentFixture<RoomEditButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomEditButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
