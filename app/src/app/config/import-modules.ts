import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { appRoutes } from './declarations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import 'hammerjs';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { NeutrinosModule } from 'neutrinos-module';
import { DependenciesModule } from './dependencies.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { NeutrinosOAuthClientModule } from 'neutrinos-oauth-client';


/**
 * adding the environments into the window object
*/

/**
*imports for @NgModule
*/
export const appImportModules: any = [
	BrowserModule,
	FormsModule,
	ReactiveFormsModule,
	BrowserAnimationsModule,
	FlexLayoutModule,
	RouterModule.forRoot(appRoutes),
	NgxChartsModule,
	ChartsModule,
	HttpClientModule,
	/**
	 * Angular material components
	 */
	MatMenuModule,
	MatDialogModule,
	MatSnackBarModule,
	MatTooltipModule,
	MatIconModule,
	MatToolbarModule,
	MatCardModule,
	MatSidenavModule,
	MatTabsModule,
	MatInputModule,
	MatButtonModule,
	MatListModule,
	MatSelectModule,
	MatSlideToggleModule,
	MatButtonToggleModule,
	MatFormFieldModule,
	MatCheckboxModule,
	MatAutocompleteModule,
	MatDatepickerModule,
	MatRadioModule,
	MatSliderModule,
	MatStepperModule,
	MatExpansionModule,
	MatChipsModule,
	MatProgressSpinnerModule,
	MatProgressBarModule,
	MatTableModule,
	MatSortModule,
	MatPaginatorModule,
	MatGridListModule,
	MatBadgeModule,
	MatNativeDateModule,
	NeutrinosModule,
	DependenciesModule,
	NeutrinosOAuthClientModule
];
