export class Paginator<T> {
  items: T[] = [];
  pageSize: number = 5;
  currentPage: number = 1;

  constructor(items: T[] = [], pageSize: number = 5) {
    this.items = items;
    this.pageSize = pageSize;
  }

  setItems(items: T[]) {
    this.items = items;
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.items.length / this.pageSize);
  }

  get pagedItems(): T[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.items.slice(start, start + this.pageSize);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
}
