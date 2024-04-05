import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormatConversionService {
  // Pegar a data atual
  getFormattedCurrentDate(): string {
    const currentDate: Date = new Date();

    const year: number = currentDate.getFullYear();
    const month: number = currentDate.getMonth() + 1;
    const day: number = currentDate.getDate();
    const hours: number = 23;
    const minutes: number = 59;
    const seconds: number = 59;

    const formattedDate: string = `${year}-${this.padNumber(
      month
    )}-${this.padNumber(day)}T${this.padNumber(hours)}:${this.padNumber(
      minutes
    )}:${this.padNumber(seconds)}`;

    return formattedDate;
  }

  // Pegar a data atual - 1 ano
  getFormattedLessDate(): string {
    const currentDate: Date = new Date();

    const year: number = currentDate.getFullYear() - 1;

    const month: number = currentDate.getMonth() + 1;
    const day: number = currentDate.getDate();
    const hours: number = 23;
    const minutes: number = 59;
    const seconds: number = 59;

    const formattedDate: string = `${year}-${this.padNumber(
      month
    )}-${this.padNumber(day)}T${this.padNumber(hours)}:${this.padNumber(
      minutes
    )}:${this.padNumber(seconds)}`;

    return formattedDate;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  // Converter a data de 01-202x para Janeiro..
  convertDateToMonth(date: string): string {
    let slicedDate = date.slice(0, 2);

    switch (slicedDate) {
      case (slicedDate = '01'):
        return 'Janeiro';
      case (slicedDate = '02'):
        return 'Fevereiro';
      case (slicedDate = '03'):
        return 'Março';
      case (slicedDate = '04'):
        return 'Abril';
      case (slicedDate = '05'):
        return 'Maio';
      case (slicedDate = '06'):
        return 'Junho';
      case (slicedDate = '07'):
        return 'Julho';
      case (slicedDate = '08'):
        return 'Agosto';
      case (slicedDate = '09'):
        return 'Setembro';
      case (slicedDate = '10'):
        return 'Outubro';
      case (slicedDate = '11'):
        return 'Novembro';
      case (slicedDate = '12'):
        return 'Dezembro';
      default:
        return 'Indefnido';
    }
  }

  // Ordenar arrays por meses (dd-yyyy)
  orderArrayForMonth(data: any) {
    const newData = data.sort((a: any, b: any) => {
      const dataA: any = new Date(a.mes.split('-').reverse().join('-'));
      const dataB: any = new Date(b.mes.split('-').reverse().join('-'));
      return dataA - dataB;
    });
    return newData;
  }

  // ! AJUSTAR
  // Converter valores para real
  convertCurrency(currency: any) {
    const format = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return format.format(currency);
  }

  // designar faixa etária
  calculateAgeRange(data: any) {
    const age = data.map((element: any) => parseInt(element.idade));

    // valores
    const minAge = 0;
    const maxAge = 99;

    const ageRange = 10;
    const numberInterval = Math.ceil((maxAge + 1) / ageRange);

    const ageRangeCount: number[] = Array(numberInterval).fill(0);

    data.forEach((element: any) => {
      const age = parseInt(element.idade);
      const indexInterval = Math.floor(age / ageRange);
      ageRangeCount[indexInterval] += element.total;
    });

    const tracks: any[] = [];
    for (let i = 0; i < numberInterval; i++) {
      const trackStart = minAge + i * ageRange;
      const trackEnd = Math.min(minAge + (i + 1) * ageRange - 1, maxAge);
      const track = `${trackStart}-${trackEnd}`;
      const count = ageRangeCount[i];
      tracks.push({ track, count });
    }

    return tracks;
  }

  sortByLargest(data: any): any {
    data?.forEach((item: any) => {
      item.total = parseFloat(item.total);
    });

    data?.sort((a: any, b: any) => {
      return b.total - a.total;
    });
  }
}
