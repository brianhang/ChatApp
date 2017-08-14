import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomEditFormComponent } from './room-edit-form.component';

describe('RoomEditFormComponent', () => {
  let component: RoomEditFormComponent;
  let fixture: ComponentFixture<RoomEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
