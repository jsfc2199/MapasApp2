import { Component } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
})
export class SearchBarComponent {
  private debounceTimer?: NodeJS.Timeout;

  //aplicando debounce manual
  onQueryChanged(query: string) {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      console.log(query)
    }, 1000);
  }
}
