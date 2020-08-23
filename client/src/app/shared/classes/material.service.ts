import {ElementRef} from "@angular/core";

declare let M;

export class MaterialService {
  static toast(message: string){
    M.toast({html: message});
  }

  static initializeFloatingButton(ref: ElementRef){
    M.FloatingActionButton.init(ref.nativeElement);
  }


}
