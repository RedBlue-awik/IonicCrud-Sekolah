import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KelasPage } from './kelas.page';

describe('KelasPage', () => {
  let component: KelasPage;
  let fixture: ComponentFixture<KelasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(KelasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
