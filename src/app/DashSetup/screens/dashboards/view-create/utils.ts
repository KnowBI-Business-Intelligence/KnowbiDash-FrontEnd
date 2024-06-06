import { MatDateFormats, NativeDateAdapter } from '@angular/material/core';

export function ktdArrayRemoveItem<T>(
  array: T[],
  condition: (item: T) => boolean
) {
  const arrayCopy = [...array];
  const index = array.findIndex((item) => condition(item));
  if (index > -1) {
    arrayCopy.splice(index, 1);
  }
  return arrayCopy;
}

export function generateLayout2(cols: number, size: number) {
  const rows = cols;
  const layout: any[] = [];
  let counter = 0;
  for (let i = 0; i < rows; i += size) {
    for (let j = i; j < cols; j += size) {
      layout.push({
        id: `${counter}`,
        x: j,
        y: i,
        w: size,
        h: size,
      });
      counter++;
    }
  }

  return layout;
}

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class CustomDateAdapter extends NativeDateAdapter {
  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    switch (style) {
      case 'long':
        return [
          'domingo',
          'segunda-feira',
          'terça-feira',
          'quarta-feira',
          'quinta-feira',
          'sexta-feira',
          'sábado',
        ];
      case 'short':
        return ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
      case 'narrow':
        return ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
    }
  }
}
