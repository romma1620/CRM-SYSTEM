import {Injectable} from '@angular/core';
import {OrderPosition, Position} from '../interfaces';

@Injectable()
export class OrderService {

  public list: OrderPosition[] = [];
  public price = 0;

  add(position: Position): void {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });

    const candidate = this.list.find(p => p._id === orderPosition._id);

    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }

    this.totallyPrice();

  }

  remove(orderPosition: OrderPosition): void {
    const index = this.list.findIndex(p => p._id === orderPosition._id);
    this.list.splice(index, 1);
    this.totallyPrice();

  }

  clear(): void {
    this.list = [];
    this.price = 0;

  }


  private totallyPrice(): void {
    this.price = this.list.reduce((total, item) => {
      return total += item.quantity * item.cost;
    }, 0);
  }
}
