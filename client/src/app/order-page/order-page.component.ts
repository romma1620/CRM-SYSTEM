import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {MaterialInstance, MaterialService} from '../shared/classes/material.service';
import {OrderService} from '../shared/services/order.service';
import {Order, OrderPosition} from '../shared/interfaces';
import {OrdersConfirmService} from '../shared/services/ordersConfirm.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef;
  isRoot: boolean;
  modal: MaterialInstance;
  pending = false;
  oSub: Subscription;

  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersConfirmService) {
  }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }

  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  open(): void {
    this.modal.open();
  }

  cancel(): void {
    this.modal.close();

  }

  submit(): void {
    this.pending = true;

    const order: Order = {
      list: this.order.list.map(item => {
        delete item._id;
        return item;
      })
    };

    this.oSub = this.ordersService.create(order).subscribe(
      newOrder => {
        console.log(newOrder);
        MaterialService.toast(`Order №${newOrder.order} added`);
        this.order.clear();
      },
      error => MaterialService.toast(error.error.message),
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }

  removePosition(orderPosition: OrderPosition): void {
    this.order.remove(orderPosition);
  }
}
