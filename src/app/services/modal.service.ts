import { Injectable } from '@angular/core';

interface Modal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modals: Modal[] = [];

  constructor() {
  }

  register(id: string): void {
    this.modals.push({
      id,
      visible: false
    });
  }

  unregister(id: string): void {
    this.modals = this.modals.filter(element => element.id !== id)
  }

  isModalOpen(id: string): boolean {
    return !!this.modals.find(m => m.id == id)?.visible;
  }

  toggleModal(id: string): void {
    const modalIndex = this.modals.findIndex(m => m.id == id);
    if (modalIndex > -1) {
      this.modals[ modalIndex ].visible = !this.modals[ modalIndex ].visible;
    }
  }


}
