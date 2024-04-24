import { ChangeDetectorRef, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { Subject, filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadrumbsService {
  breadcrumbs: any[] = [];
  breadcrumbsChanged: Subject<any[]> = new Subject<any[]>();

  constructor(private router: Router, private cdRef: ChangeDetectorRef) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(
          this.router.routerState.snapshot.root
        );
        this.breadcrumbsChanged.next(this.breadcrumbs);
        this.cdRef.detectChanges();
      });
  }

  private createBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: any[] = []
  ): any[] {
    const children = route.children;

    if (
      children.length === 0 ||
      (route.url.length === 0 && route.routeConfig?.path === '')
    ) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.url
        .map((segment) => segment.path)
        .join('/');

      if (routeURL !== '') {
        if (!url.endsWith('/' + routeURL)) {
          url += `/${routeURL}`;
        }
      }
      const label = child.data['breadcrumb'];

      if (label) {
        breadcrumbs.push({ label, url });
      }

      this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
