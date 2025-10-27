import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservaViagem } from './reserva-viagem';

describe('ReservaViagem', () => {
  let component: ReservaViagem;
  let fixture: ComponentFixture<ReservaViagem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReservaViagem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservaViagem);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
