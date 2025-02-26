import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { TreeViewComponent } from './tree-view.component';

describe('TreeViewComponent', () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeViewComponent ]
    })
    .compileComponents();
    ;

    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
