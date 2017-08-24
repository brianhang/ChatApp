/*
  MIT License

  Copyright (c) 2016 NagRock

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
*/

import { AfterContentInit, Directive, ElementRef, HostListener, Input, OnDestroy } from '@angular/core';

@Directive({
  selector: '[ngx-auto-scroll]',
})
export class NgxAutoScroll implements AfterContentInit, OnDestroy {
  @Input('lock-y-offset') public lockYOffset: number = 10;
  @Input('observe-attributes') public observeAttributes: string = 'false';

  private nativeElement: HTMLElement;
  private isLocked: boolean = false;
  private mutationObserver: MutationObserver;

  constructor(element: ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  public getObserveAttributes(): boolean {
    return this.observeAttributes !== '' && this.observeAttributes.toLowerCase() !== 'false';
  }

  public ngAfterContentInit(): void {
    this.mutationObserver = new MutationObserver(() => {
      if (!this.isLocked) {
        this.scrollDown();
      }
    });

    this.mutationObserver.observe(this.nativeElement, {
      childList: true,
      subtree: true,
      attributes: this.getObserveAttributes(),
    });
  }

  public ngOnDestroy(): void {
    this.mutationObserver.disconnect();
  }

  public forceScrollDown(): void {
    this.scrollDown();
  }

  private scrollDown(): void {
    this.nativeElement.scrollTop = this.nativeElement.scrollHeight;
  }

  @HostListener('scroll')
  private scrollHandler(): void {
    const scrollFromBottom = this.nativeElement.scrollHeight - this.nativeElement.scrollTop - this.nativeElement.clientHeight;
    this.isLocked = scrollFromBottom > this.lockYOffset;
  }
}
