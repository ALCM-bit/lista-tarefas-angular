import {Component, signal} from '@angular/core';
import Swal from 'sweetalert2';
import {InputAddItemComponent} from "../../components/input-add-item/input-add-item.component";
import {IListItensInterface} from "../../interface/IListItens.interface";
import {JsonPipe} from "@angular/common";
import {InputListItemComponent} from "../../components/input-list-item/input-list-item.component";

//Enum
import {ELocalStorageEnum} from "../../enum/ELocalStorage.enum";


@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    InputAddItemComponent,
    JsonPipe,
    InputListItemComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem = signal(true);

  #setListItems = signal<IListItensInterface[]>(this.#parseItems());
  public getListItems = this.#setListItems.asReadonly();

  #parseItems() {
    return JSON.parse(localStorage.getItem(ELocalStorageEnum.MY_LIST) || '[]');
  }

  #updateLocalStorage() {
    return localStorage.setItem(
      ELocalStorageEnum.MY_LIST,
      JSON.stringify(this.#setListItems())
    );
  }

  public getInputAndAddItem(value: IListItensInterface) {
    localStorage.setItem(
      ELocalStorageEnum.MY_LIST,
      JSON.stringify([...this.#setListItems(), value])
    );

    return this.#setListItems.set(this.#parseItems());
  }

  public listItemsStage(value: 'pending' | 'completed') {
    return this.getListItems().filter((res: IListItensInterface) => {
      if (value === 'pending') {
        return !res.checked;
      }

      if (value === 'completed') {
        return res.checked;
      }

      return res;
    });
  }

  public updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    this.#setListItems.update((oldValue: IListItensInterface[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.checked = newItem.checked;
          return res;
        }

        return res;
      });

      return oldValue;
    });

    return this.#updateLocalStorage();
  }

  public updateItemText(newItem: { id: string; value: string }) {
    this.#setListItems.update((oldValue: IListItensInterface[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.value = newItem.value;
          return res;
        }

        return res;
      });

      return oldValue;
    });

    return this.#updateLocalStorage();
  }

  public deleteItem(id: string) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, delete o item',
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue: IListItensInterface[]) => {
          return oldValue.filter((res) => res.id !== id);
        });

        return this.#updateLocalStorage();
      }
    });
  }

  public deleteAllItems() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, delete tudo',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalStorageEnum.MY_LIST);
        return this.#setListItems.set(this.#parseItems());
      }
    });
  }
}
