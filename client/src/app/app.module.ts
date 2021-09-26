//this is for UltimateAbusua app module


import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//import { LocationStrategy, HashLocationStrategy } from '@angular/common';

//service
import { UsersService } from './users.service';
import { DataService } from './data.service';
import { AuthGuard } from './auth/auth-guard.service';
import { AuthInterceptor } from './auth/auth-interceptor.service';
import { UserResolver } from './resolver/user-resolver.service';


import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';


// Shared
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { sharedFunctions } from './shared/sharedFunctions';
import { Ng4FilesModule } from './shared/ng4-files';
import { AsideToggleDirective } from './shared/aside.directive';

//import { BreadcrumbsComponent } from './shared/breadcrumb.component';
//import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { MainLayoutComponent } from './layouts/main-layout.component';

//Other Important Component
import { P404Component } from './pages/404.component';
import { ChatsComponent } from './chats/chats.component';

//webSocket
import { WebSocketService } from './webSocket.service';


@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    Ng4FilesModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
  ],
  declarations: [
    AppComponent,
    ChatsComponent,
    SimpleLayoutComponent,
    MainLayoutComponent,
    P404Component,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
    //BreadcrumbsComponent,
    //NAV_DROPDOWN_DIRECTIVES
  ],
  providers: [
    UsersService,
    DataService,
    WebSocketService,
    sharedFunctions,
    AuthGuard,
    UserResolver,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
