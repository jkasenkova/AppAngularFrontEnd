import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../services/modalService';

@Component({
    selector: 'app-modal-popup',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

    constructor(public modalService: ModalService) { }

    ngOnInit(): void {
    }

    closeModal() {
        this.modalService.close();
    }
}