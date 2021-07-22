import { Directive, Input, Renderer2, ElementRef, OnInit } from '@angular/core';
import { NSystemService } from 'neutrinos-seed-services';
import {
    OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Directive({ selector: '[artImgSrc]' })
export class ArtImgSrcDirective implements OnInit, OnDestroy {
    @Input() collectionName: string;
    @Input() imageFilter: string;
    private systemService = NSystemService.getInstance();
    private _internalSubscription;
    private imgSource;


    constructor(private el: ElementRef, private _renderer: Renderer2,
        private http: HttpClient) { }

    ngOnInit() {
        if (typeof this.imageFilter === 'string' && this.parseJSON(this.imageFilter)) {
            this.imageFilter = this.imageFilter;
        }
        if (this.collectionName && typeof this.imageFilter === 'object') {
            this.imgSource = this.systemService.getFileIOUrl() + this.collectionName
                + '?metadataFilter=' + encodeURI(JSON.stringify(this.imageFilter));
            this._internalSubscription = this.http
                .get(this.imgSource, {
                    responseType: 'blob'
                })
                .subscribe(m => {
                    this._renderer.setAttribute(this.el.nativeElement, 'src', URL.createObjectURL(m));
                });
        }
    }

    private parseJSON(jsonstring) {
        let json;
        try {
            json = JSON.parse(jsonstring);
        } catch (error) {
            return null;
        }

        return json;
    }

    ngOnDestroy(): void {
        if (this._internalSubscription) {
            this._internalSubscription.unsubscribe();
        }
    }
}
