import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAddFormComponent } from './room-add-form.component';

describe('RoomAddFormComponent', () => {
  let component: RoomAddFormComponent;
  let fixture: ComponentFixture<RoomAddFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomAddFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
