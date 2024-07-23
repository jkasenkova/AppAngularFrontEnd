import { IHeaderParams } from "ag-grid-community";
import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';

@Component({
    standalone: true,
    template: `
        <div class="custom-header">
            <span>{{ params.displayName }}</span>
            <span class="ag-header-icon ag-icon-plus"></span>
        </div>
    `,
})
export class CustomHeader implements IHeaderAngularComp {
    public params!: IHeaderParams;

    agInit(params: IHeaderParams): void {
        this.params = params;
    }

    refresh(params: IHeaderParams) {
        return false;
    }
}
