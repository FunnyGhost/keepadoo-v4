import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function childComponents<T>(
  fixture: ComponentFixture<any>,
  type: Type<T>
): T[] {
  return fixture.debugElement
    .queryAll(By.directive(type))
    .map(el => el.componentInstance);
}
