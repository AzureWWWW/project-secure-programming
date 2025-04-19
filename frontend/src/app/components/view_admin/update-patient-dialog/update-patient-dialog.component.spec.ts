import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePatientDialogComponent } from './update-patient-dialog.component';

describe('UpdatePatientDialogComponent', () => {
  let component: UpdatePatientDialogComponent;
  let fixture: ComponentFixture<UpdatePatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePatientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
