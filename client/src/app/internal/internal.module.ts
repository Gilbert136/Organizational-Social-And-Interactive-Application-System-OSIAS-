import { NgModule } from '@angular/core';
//import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


import { InternalRoutingModule } from './internal-routing.module';
import { HomepageComponent } from './homepage.component';
import { TimelineComponent } from './timeline.component';

@NgModule({
  imports: [
    CommonModule,
    InternalRoutingModule
  ],
  declarations: [
    HomepageComponent,
    TimelineComponent
  ]
})

export class InternalModule {}