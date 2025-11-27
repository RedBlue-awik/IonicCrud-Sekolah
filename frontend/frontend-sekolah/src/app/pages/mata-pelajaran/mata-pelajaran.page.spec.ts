import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MataPelajaranPage } from './mata-pelajaran.page';

describe('MataPelajaranPage', () => {
  let component: MataPelajaranPage;
  let fixture: ComponentFixture<MataPelajaranPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MataPelajaranPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
