import { Injectable } from '@angular/core';
import { StorageService } from '../../../../core/services/user/storage.service';
import { HttpHeaders } from '@angular/common/http';
import { DatabaseConnectionService } from '../../../../core/services/database/database-connection.service';

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

  getDataBasesConnections() {
    this.databaseConnectionService.getDataBases(this.headers).subscribe({
      next(value) {
        return value;
        console.log(value);
      },
    });
  }

  getConections() {
    return Promise.resolve(this.getDataBasesConnections());
  }
}
