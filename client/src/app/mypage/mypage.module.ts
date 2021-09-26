import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MypageRoutingModule } from './mypage-routing.module';
import { Ng4FilesModule } from '../shared/ng4-files';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PostsComponent } from './posts.component';
import { DocumentsComponent } from './documents.component';
import { ChatsComponent } from './chats/chats.component';



@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    MypageRoutingModule,
    Ng4FilesModule,
    TabsModule.forRoot(),
  ],
  declarations: [
    PostsComponent,
    DocumentsComponent,
    ChatsComponent
  ]
})

export class MypageModule { }
