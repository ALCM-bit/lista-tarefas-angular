import {ChangeDetectorRef, Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';

//Interfaces
import {IListItensInterface} from "../../interface/IListItens.interface";
import {JsonPipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-input-add-item',
  standalone: true,
  imports: [
    JsonPipe,
    NgClass
  ],
  templateUrl: './input-add-item.component.html',
  styleUrl: './input-add-item.component.scss'
})
export class InputAddItemComponent {

  #cdr = inject(ChangeDetectorRef)

  @ViewChild("inputText") public inputText !: ElementRef;

  @Input({required: true}) public inputListItems: IListItensInterface[] = [];
  @Output() public outputAddListItem = new EventEmitter<IListItensInterface>();

  public focusAndAddItem(value: string) {
    if (value) {
      this.#cdr.detectChanges();
      this.inputText.nativeElement.value = '';

      const currentDate = new Date();
      const timeStamp = currentDate.getTime();
      const id = `ID ${timeStamp}`

      this.outputAddListItem.emit({
        id,
        checked: false,
        value
      });

      return this.inputText.nativeElement.focus();
    }
  }
}
