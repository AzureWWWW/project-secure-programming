import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDoctorDialogComponent } from './update-doctor-dialog.component';

describe('UpdateDoctorDialogComponent', () => {
  let component: UpdateDoctorDialogComponent;
  let fixture: ComponentFixture<UpdateDoctorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDoctorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDoctorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
