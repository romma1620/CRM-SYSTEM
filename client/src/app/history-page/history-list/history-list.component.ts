import {AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {Order} from '../../shared/interfaces';
import {MaterialInstance, MaterialService} from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnDestroy, AfterViewInit {
  @Input() orders: Order[];
  @ViewChild('modal') modalRef: ElementRef;

  modal: MaterialInstance;
  selectedOrder: Order;

  constructor() {
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);

  }

  totallyPrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }

  selectOrder(order: Order): void {
    this.selectedOrder = order;
    this.modal.open();
  }

  closeModal(): void {
    this.modal.close();
  }
}
