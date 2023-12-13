import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AuthNotifyService {
  constructor(private toast: ToastrService) {}

  public VerifyErroCode(errorMessage: any): string | any {
    switch (errorMessage) {
      case 'Bad credentials':
        return this.toast.error(
          'E-mail ou senha incorretos!',
          'Credenciais Inválidas',
          {
            progressAnimation: 'decreasing',
            progressBar: true,

          }
        );
      case 'Error: Username is already taken!':
        return this.toast.info(
          'Nome de usuário já está em uso!',
          'Verifique as informações',
          {
            progressBar: true,
          }
          );
          case 'Error: Email is already in use!':
            return this.toast.info(
              'Este e-mail já está em uso!',
              'Verifique as informações',
              {
                progressBar: true,
              }
              );
              case 'Full authentication is required to access this resource':
                return this.toast.warning(
                  'Autenticação completa necessária!',
                  'Recurso Inacessível',
                  {
                    progressBar: true,
                  }
                  );
                }
              }
            }
