import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuruPage } from './guru.page';

describe('GuruPage', () => {
  let component: GuruPage;
  let fixture: ComponentFixture<GuruPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuruPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
