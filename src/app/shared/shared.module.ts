import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [DialogComponent],
  imports: [CommonModule],
  exports: [DialogComponent]
})
export class SharedModule {}
