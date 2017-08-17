import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomBansComponent } from './room-bans.component';

describe('RoomBansComponent', () => {
  let component: RoomBansComponent;
  let fixture: ComponentFixture<RoomBansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomBansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomBansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
