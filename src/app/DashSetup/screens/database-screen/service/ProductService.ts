import { Injectable } from '@angular/core';
import { StorageService } from '../../../../core/services/user/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { DatabaseConnectionService } from '../../../../core/services/database/database-connection.service';
import { Observable } from 'rxjs';

@Injectable()
export class ProductService {
  userToken = this.storageService.getUser();

  headers = new HttpHeaders({
    Authorization: `Bearer ${this.userToken.token}`,
  });

  constructor(
    private storageService: StorageService,
    private databaseConnectionService: DatabaseConnectionService
  ) {}

  getDataBasesConnections(): Observable<any> {
    return this.databaseConnectionService.getDataBases(this.headers);
  }
}
