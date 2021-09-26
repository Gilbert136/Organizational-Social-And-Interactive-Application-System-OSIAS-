import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomepageComponent } from './homepage.component';
import { TimelineComponent } from './timeline.component';

const routes:Routes = [
  {
    path: '',
    data: {
      title : 'Home Content'
    },
    children: [
      {
        path:'homepage',
        component: HomepageComponent,
        data: {
          title: 'Home Page'
        }
      },
      {
        path:'timeline/:name',
        component: TimelineComponent,
        data: {
          title: 'Timeline Page'
        }
      }
    ]
  
}]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})

export class InternalRoutingModule {}