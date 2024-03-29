// Basic
import { NgModule } from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@app/material.module';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { ShellModule } from '@shell/shell.module';

// Home
import { UserManagementComponent } from './user-management.component';

// Services
import { UserManagementDataSource } from './user-management.datasource';
import { UserProfileShellModule } from '@components/user-profile-shell/user-profile-shell.module';
import {ReactiveFormsModule} from '@angular/forms';
import {DialogUserDataComponent} from '@components/dialog-user-data/dialog-user-data.component';

/**
 * Module to import and export all the components for the home page.
 */
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    UserManagementRoutingModule,
    ShellModule,
    UserProfileShellModule,
    ReactiveFormsModule
  ],
  declarations: [UserManagementComponent, DialogUserDataComponent],
  providers: [UserManagementDataSource, DatePipe],
  entryComponents: [DialogUserDataComponent]
})
export class UserManagementModule { }
