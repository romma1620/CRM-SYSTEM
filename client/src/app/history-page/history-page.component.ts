import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialInstance, MaterialService} from '../shared/classes/material.service';
import {OrdersConfirmService} from '../shared/services/ordersConfirm.service';
import {Subscription} from 'rxjs';
import {Filter, Order} from '../shared/interfaces';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef;

  tooltip: MaterialInstance;
  isFilterVisible = false;
  oSub: Subscription;
  orders: Order[] = [];
  filter: Filter = {};

  offset = 0;
  limit = STEP;
  loading = false;
  reloading = false;
  noMoreOrders = false;

  constructor(private ordersService: OrdersConfirmService) {
  }

  ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }

  private fetch(): void{
    const params = Object.assign({}, this.filter, {
        offset: this.offset,
        limit: this.limit
    });

    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders);
      this.noMoreOrders = orders.length < STEP;
      this.loading = false;
      this.reloading = false;

    });

  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  loadMore(): void {
    this.offset += STEP;
    this.loading = true;
    this.fetch();
  }

  get filterVisible(): boolean {
    return this.isFilterVisible = !this.isFilterVisible;
  }

  applyFilter(filter: Filter): void {
    this.orders = [];
    this.offset = 0;
    this.filter = filter;
    this.reloading = true;
    this.fetch();
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0;
  }
}
