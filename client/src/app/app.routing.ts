
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Layouts
import { SimpleLayoutComponent } from './layouts/simple-layout.component';
import { MainLayoutComponent } from './layouts/main-layout.component';
import { P404Component } from './pages/404.component';

//service
import { AuthGuard } from './auth/auth-guard.service';
import { UserResolver } from './resolver/user-resolver.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full',
  },
  {
    path: 'internal',
    component: SimpleLayoutComponent,
    loadChildren: './internal/internal.module#InternalModule'
  },
  {
    path: 'pages',
    canActivateChild: [AuthGuard],
    component: SimpleLayoutComponent,
    loadChildren: './pages/pages.module#PagesModule'
  },
  {
    path: ':name',
    component: MainLayoutComponent,
    loadChildren: './mypage/mypage.module#MypageModule',
    resolve: {user: UserResolver}
  },
  {
    path: '**',
    component: P404Component,
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: false}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
