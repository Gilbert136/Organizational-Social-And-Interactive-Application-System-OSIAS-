import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';

import { PostsComponent } from './posts.component';
import { DocumentsComponent } from './documents.component';
import { ChatsComponent } from './chats/chats.component';


const routes: Routes = [
  {
    path: 'posts',
    component: PostsComponent,
  },
  {
    path: 'documents',
    component: DocumentsComponent,
  },
  {
    path: 'chats',
    component: ChatsComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MypageRoutingModule { }