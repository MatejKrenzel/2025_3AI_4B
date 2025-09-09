import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbareComponent } from './toolbare.component';

describe('ToolbareComponent', () => {
  let component: ToolbareComponent;
  let fixture: ComponentFixture<ToolbareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
