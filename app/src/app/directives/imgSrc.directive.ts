import { Directive, Input, Renderer2, ElementRef } from '@angular/core';

@Directive({ selector: '[imgSrc]' })
export class ImgSrcDirective {
    @Input('imgSrc') imgSrc: string;

    constructor(private el: ElementRef, private _renderer: Renderer2) {}

    ngOnInit() {
        let relativePath = 'assets';

        if(this.imgSrc) {
            if(this.imgSrc.charAt(0) != '/') {
                relativePath += '/';
            }
            this._renderer.setAttribute(this.el.nativeElement, 'src', relativePath + this.imgSrc);
        } else {
            this._renderer.setAttribute(this.el.nativeElement, 'src', '');
        }
    }
}
