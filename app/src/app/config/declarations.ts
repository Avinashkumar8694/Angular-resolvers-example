import { NeutrinosAuthGuardService } from 'neutrinos-oauth-client';
import { PageNotFoundComponent } from '../not-found.component';
import { LayoutComponent } from '../layout/layout.component';
import { ImgSrcDirective } from '../directives/imgSrc.directive';
import { APP_INITIALIZER } from '@angular/core';
import { NDataSourceService } from '../n-services/n-dataSorce.service';
import { environment } from '../../environments/environment';
import { NLocaleResource } from '../n-services/n-localeResources.service';
import { NAuthGuardService } from 'neutrinos-seed-services';
import { ArtImgSrcDirective } from '../directives/artImgSrc.directive';

window['neutrinos'] = {
  environments: environment,
};

//CORE_REFERENCE_IMPORTS
//CORE_REFERENCE_IMPORT-userDetailComponent
import { userDetailComponent } from '../components/userDetail.component';
//CORE_REFERENCE_IMPORT-_userslistService
import { _userslistService } from '../services/_userslist/_userslist.service';
//CORE_REFERENCE_IMPORT-userlistComponent
import { userlistComponent } from '../components/userlist.component';
//CORE_REFERENCE_IMPORT-userService
import { userService } from '../services/user/user.service';
//CORE_REFERENCE_IMPORT-userFormComponent
import { userFormComponent } from '../components/userForm.component';

/**
 * Reads datasource object and injects the datasource object into window object
 * Injects the imported environment object into the window object
 *
 */
export function startupServiceFactory(startupService: NDataSourceService) {
  return () => startupService.getDataSource();
}

/**
 *bootstrap for @NgModule
 */
export const appBootstrap: any = [LayoutComponent];

/**
 *declarations for @NgModule
 */
export const appDeclarations = [
  ImgSrcDirective,
  LayoutComponent,
  PageNotFoundComponent,
  ArtImgSrcDirective,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-userDetailComponent
  userDetailComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-userlistComponent
  userlistComponent,
  //CORE_REFERENCE_PUSH_TO_DEC_ARRAY-userFormComponent
  userFormComponent,
];

/**
 * provider for @NgModule
 */
export const appProviders = [
  NDataSourceService,
  NLocaleResource,
  {
    // Provider for APP_INITIALIZER
    provide: APP_INITIALIZER,
    useFactory: startupServiceFactory,
    deps: [NDataSourceService],
    multi: true,
  },
  NAuthGuardService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-_userslistService
  _userslistService,
  //CORE_REFERENCE_PUSH_TO_PRO_ARRAY-userService
  userService,
];

/**
 * Routes available for bApp
 */

// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_START
export const appRoutes = [
  { path: 'userform', component: userFormComponent },
  {
    path: 'userlist',
    component: userlistComponent,
    resolve: { userList: _userslistService },
  },
  {
    path: 'userdetails/:email',
    component: userDetailComponent,
    resolve: { userDetails: userService },
  },
  { path: '', redirectTo: 'userform', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];
// CORE_REFERENCE_PUSH_TO_ROUTE_ARRAY_END
