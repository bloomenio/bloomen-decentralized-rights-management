// Basic
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { MatSnackBar, MatPaginator, MatSort } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { Router } from '@angular/router';
import { MemberManagementDataSource } from './member-management.datasource';
import { tap, map, skipWhile } from 'rxjs/operators';
import { MemberContract } from '@core/core.module';
import { Store } from '@ngrx/store';

import * as fromMemberSelector from '@stores/member/member.selectors';
import { Subscription } from 'rxjs';

const log = new Logger('company-management.component');

/**
 * Member management page
 */
@Component({
  selector: 'blo-member-management',
  templateUrl: './member-management.component.html',
  styleUrls: ['./member-management.component.scss']
})
export class MemberManagementComponent implements OnInit, AfterViewInit, OnDestroy {

  public displayedColumns: string[];
  public dataSource: MemberManagementDataSource;

  public member$: Subscription;


  public companiesPageNumber: number;

  @ViewChild(MatPaginator) public paginator: MatPaginator;
  @ViewChild(MatSort) public sort: MatSort;

  constructor(
    public snackBar: MatSnackBar,
    public router: Router,
    private memberContract: MemberContract,
    private store: Store<any>
  ) { }

  public ngOnInit() {
    this.displayedColumns = ['companyName', 'image', 'cmo', 'country', 'creationDate'];
    this.dataSource = new MemberManagementDataSource(this.memberContract);

    this.member$ = this.store.select(fromMemberSelector.selectAllMembers).pipe(
      skipWhile((members) => !members)
    ).subscribe(() => {
      this.dataSource.loadCompanies();
    });
  }

  public ngAfterViewInit() {

    // Simulate get number of items from the server
    this.memberContract.getCountMembers().then((count) => {
      this.companiesPageNumber = count;
    });

    this.paginator.page.pipe(
      tap(() => this.loadUsersPage())
    ).subscribe();
  }

  public loadUsersPage() {
    this.dataSource.loadCompanies(
      '',
      'asc',
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  public clickEdit(element) {
    log.debug('click edit', element);
  }


  public ngOnDestroy() {
    this.member$.unsubscribe();
  }
}
