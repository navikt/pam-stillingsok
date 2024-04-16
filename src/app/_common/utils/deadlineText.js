import {
  addDays, isSameDay, isValid, parse, parseISO,
} from 'date-fns';
import { format as formatDateFns } from 'date-fns/format';
import { nb } from 'date-fns/locale';

export default function deadlineText(deadline, now, applicationDue) {
  if (deadline.toLowerCase().indexOf('asap') > -1) {
    return 'Søk snarest mulig';
  }

  if (deadline.toLowerCase().indexOf('snarest') > -1) {
    return 'Søk snarest mulig';
  }

  try {
    let dueDateParsed = parseISO(applicationDue);
    if (!isValid(dueDateParsed)) {
      dueDateParsed = parse(applicationDue, 'dd.MM.yyyy', new Date());
    }

    if (!isValid(dueDateParsed)) {
      return `Frist: ${deadline}`;
    }

    if (isSameDay(now, dueDateParsed)) {
      return 'Søk senest i dag';
    }
    if (isSameDay(addDays(now, 1), dueDateParsed)) {
      return 'Søk senest i morgen';
    }
    if (isSameDay(addDays(now, 2), dueDateParsed)) {
      return 'Søk senest i overmorgen';
    }
    return `Søk senest ${formatDateFns(dueDateParsed, 'EEEE d. MMMM', {
      locale: nb,
    })}`;
  } catch (e) {
    return `Frist: ${deadline}`;
  }
}
