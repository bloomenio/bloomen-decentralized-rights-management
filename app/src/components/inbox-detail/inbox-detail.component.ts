// Basic
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { INBOX } from '@core/constants/inbox.constants';
import { Store } from '@ngrx/store';

import * as fromMemberSelectors from '@stores/member/member.selectors';
import * as fromClaimActions from '@stores/claim/claim.actions';

import { map } from 'rxjs/operators';
import { MemberModel } from '@core/models/member.model';
import { Subscription } from 'rxjs';
import { ClaimModel } from '@core/models/claim.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Logger } from '@services/logger/logger.service';

const log = new Logger('inbox-detail.component');


@Component({
  selector: 'blo-inbox-detail',
  templateUrl: 'inbox-detail.component.html',
  styleUrls: ['inbox-detail.component.scss']
})
export class InboxDetailComponent implements OnInit, OnDestroy {

  @Input() public message: any;
  @Output() public readonly acceptEvent = new EventEmitter();
  @Output() public readonly rejectEvent = new EventEmitter();

  public inboxEnum: any;
  public claimType: any;

  public messageForm: FormGroup;

  public member: MemberModel;
  public member$: Subscription;

  public currentMember: MemberModel;

  constructor(
    private store: Store<any>,
    private fb: FormBuilder
  ) { }

  public ngOnInit() {
    this.inboxEnum = INBOX;
    this.claimType = ClaimModel.ClaimTypeEnum;
    this.member$ = this.store.select(fromMemberSelectors.selectAllMembers).pipe(
      map((members) => {
        return members.find((member) => member.memberId === this.message.memberId || member.memberId === this.message.memberOwner);
      })
    ).subscribe((member) => {
      this.member = member;
    });

    this.member$ = this.store.select(fromMemberSelectors.getCurrentMember).subscribe((member) => {
      this.currentMember = member;
    });

    this.messageForm = this.fb.group({
      status: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  public ngOnDestroy() {
    this.member$.unsubscribe();
  }

  public onAccept() {
    if (this.message.type === this.inboxEnum.TYPES.USER) {
      this.acceptEvent.emit(this.message.owner);
    } else {
      this.acceptEvent.emit({
        claimsId: this.message.claimId,
        status: this.messageForm.get('status').value,
        message: this.messageForm.get('message').value,
        memberId: this.currentMember.memberId,
        memberLogo: this.currentMember.logo
      });
    }
  }

  public onReject() {
    this.rejectEvent.emit(this.message.owner);
  }
}
