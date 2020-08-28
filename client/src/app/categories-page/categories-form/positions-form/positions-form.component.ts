import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PositionsService} from '../../../shared/services/positions.service';
import {Position} from '../../../shared/interfaces';
import {MaterialInstance, MaterialService} from '../../../shared/classes/material.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;
  positions: Position[] = [];
  loading = false;
  modal: MaterialInstance;
  form: FormGroup;

  constructor(private positionsService: PositionsService) {
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(null, [Validators.required, Validators.min(1)])
    });

    this.loading = true;
    this.positionsService.fetch(this.categoryId).subscribe(positions => {
      this.positions = positions;
      this.loading = false;
    });
  }

  ngOnDestroy() {
    this.modal.destroy();
  }

  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  onSelectPosition(position: Position) {
    this.modal.open();

  }

  onAddPosition() {
    this.modal.open();
  }

  onCancel() {
    this.modal.close();
  }

  onSubmit() {
    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    };

    this.positionsService.create(newPosition).subscribe(
      position => {
        MaterialService.toast('Position created');
        this.positions.push(position);
      },
      error => {
        this.form.enable();
        MaterialService.toast(error.error.message);
      }
    );

  }

  onDeletePosition(position: Position) {

  }
}
