import { Component, OnInit, Inject } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { NgForOf } from "@angular/common";

interface Claim {
    claim: string;
    value: unknown;
}

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    standalone: true,
    imports: [
        NgForOf
    ],
    styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
    claims: Claim[] = [];

    constructor(@Inject(OKTA_AUTH) public oktaAuth: OktaAuth) {

    }

    async ngOnInit() {
        const userClaims = await this.oktaAuth.getUser();
        this.claims = Object.entries(userClaims).map(entry => ({ claim: entry[0], value: entry[1] }));
    }

}