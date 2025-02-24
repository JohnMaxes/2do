import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HwComponent } from './hw.component';

describe('HwComponent', () => {
  let component: HwComponent;
  let fixture: ComponentFixture<HwComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HwComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HwComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
