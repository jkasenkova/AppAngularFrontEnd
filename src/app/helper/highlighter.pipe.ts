import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlighter'
})
export class HighlighterPipe implements PipeTransform {

  transform(wholeText: string, searchQuery: string | null | undefined): string {
    if (searchQuery == null || searchQuery == undefined) {
      return wholeText;
    }

    if (!wholeText) {
      return '';
    }

    const re = new RegExp(searchQuery, 'gi');
    return wholeText.replace(re, '<mark>$&</mark>');
  }
}
