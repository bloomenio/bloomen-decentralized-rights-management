// Basic
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';

import { MatSnackBar, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { Logger } from '@services/logger/logger.service';
import { Router } from '@angular/router';
import { ClaimsDataSource } from './claims.datasource';
import { tap } from 'rxjs/operators';
import { MusicalDialogComponent } from '@components/claim-dialog/musical-dialog/musical-dialog.component';
import { SoundDialogComponent } from '@components/claim-dialog/sound-dialog/sound-dialog.component';

import { Store } from '@ngrx/store';
import * as fromMemberSelectors from '@stores/member/member.selectors';
import { MemberModel } from '@core/models/member.model';
import { Subscription } from 'rxjs';
import { ClaimModel } from '@core/models/claim.model';
import { ClaimsContract } from '@core/core.module';


const log = new Logger('claims.component');



/**
 * Claims page
 */
@Component({
    selector: 'blo-claims',
    templateUrl: './claims.component.html',
    styleUrls: ['./claims.component.scss']
})
export class ClaimsComponent implements OnInit, AfterViewInit, OnDestroy {

    public displayedColumns: string[];
    public dataSource: ClaimsDataSource;
    public usersPageNumber: number;

    private members: MemberModel[];
    private members$: Subscription;

    public claimType: any;


    @ViewChild(MatPaginator) public paginator: MatPaginator;
    @ViewChild(MatSort) public sort: MatSort;

    constructor(
        public snackBar: MatSnackBar,
        public router: Router,
        public dialog: MatDialog,
        private claimsContract: ClaimsContract,
        private store: Store<any>
    ) {
    }

    public ngOnInit() {

        this.members$ = this.store.select(fromMemberSelectors.selectAllMembers).subscribe(members => {
            this.members = members;
        });

        this.displayedColumns = ['type', 'code', 'title', 'id', 'status', 'creationDate', 'edit', 'view'];
        this.dataSource = new ClaimsDataSource(this.claimsContract);
        this.dataSource.loadClaims();
        this.claimType = ClaimModel.ClaimTypeEnum;
    }

    public ngAfterViewInit() {

        // Simulate get number of items from the server
        this.claimsContract.getClaimsCountByMemberId().then((count) => {
            this.usersPageNumber = count;
        });

        this.paginator.page.pipe(
            tap(() => this.loadClaimsPage())
        ).subscribe();
    }

    public loadClaimsPage() {
        this.dataSource.loadClaims(
            '',
            'asc',
            this.paginator.pageIndex,
            this.paginator.pageSize
        );
    }

    public clickEdit(element, isEdit) {
        let dialog;

        switch (element.claimType) {
            case ClaimModel.ClaimTypeEnum.MUSICAL_WORK:
                dialog = this.dialog.open(MusicalDialogComponent, {
                    data: {
                        claim: element,
                        members: this.members,
                        disableMemberEdit: true,
                        isEditable: isEdit
                    },
                    width: '900px',
                    height: '810px'
                });
                break;
            case ClaimModel.ClaimTypeEnum.SOUND_RECORDING:
                dialog = this.dialog.open(SoundDialogComponent, {
                    data: {
                        claim: element,
                        members: this.members,
                        disableMemberEdit: true,
                        isEditable: isEdit
                    },
                    width: '900px',
                    height: '510px'
                });
                break;
            default:
                break;
        }

        dialog.afterClosed().subscribe(value => {
            if (value) {
                this.claimsContract.updateClaim(value).then(() => {
                    this.loadClaimsPage();
                });
            }
        });
    }

    public ngOnDestroy() {
        this.members$.unsubscribe();
    }
}
