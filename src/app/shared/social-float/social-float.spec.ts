import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialFloat } from './social-float';

describe('SocialFloat', () => {
  let component: SocialFloat;
  let fixture: ComponentFixture<SocialFloat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialFloat],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialFloat);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
