import { Component, inject } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";

@Component({
    standalone: true,
    styleUrls: ['./user-management.component.less'],
    template: `<div class="icon-container">
                    <div class="name">{{ getLettersIcon() }}</div>
                </div> `
})

export class IconComponent implements ICellRendererAngularComp {
    eGui!: HTMLSpanElement;
    params: ICellRendererParams;
    readonly dialog = inject(MatDialog);

    agInit(params: ICellRendererParams): void {
        this.params = params;
        var iconDIV = document.createElement('div');
        iconDIV.setAttribute('class', 'icon-container');

        this.eGui = document.createElement('div');
        this.eGui.setAttribute('class', 'name');
        this.eGui.innerHTML = this.getLettersIcon();
        this.eGui.appendChild(iconDIV); 
    }

    refresh(params: ICellRendererParams): boolean {
        return false;
    }

    getLettersIcon(): string {
        if(Boolean( this.params.data.userName) && Boolean(this.params.data.userSurname)){
            var getLetters = [ this.params.data.userName[0] + this.params.data.userSurname[0]].join("");
            return getLetters;
        }
        return "";
    }

}
