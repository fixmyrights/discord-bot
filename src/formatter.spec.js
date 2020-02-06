const formatter = require('./formatter');

describe('Formatter Tests', () => {
  const testBillMin = {
    state: 'HI',
    number: 'SB2497',
    title: 'Relating To The Model State Right-to-repair Law.',
    url: 'https://legiscan.com/HI/bill/SB2496/2020',
    history: [],
    watching: true,
    calendar: []
  };
  const testBillWithHistoryAndCalendar = {
    state: 'HI',
    number: 'SB2496',
    title: 'Relating To The Model State Right-to-repair Law.',
    url: 'https://legiscan.com/HI/bill/SB2496/2020',
    history: [
      {
        action: 'The committee(s) on CPH has scheduled a public hearing on 02-06-20 9:30AM in conference room 229.',
        timestamp: 1580342400000
      },
      {
        action: 'Introduced.',
        timestamp: 1579219200000
      },
      {
        action: 'Passed First Reading.',
        timestamp: 1579564800000
      },
      {
        action: 'Referred to CPH, JDC.',
        timestamp: 1579737600000
      }
    ],
    watching: true,
    calendar: [
      {
        type: 'Hearing',
        description: 'Senate Commerce, Consumer Protection, and Health Hearing',
        localDate: '2020-02-06',
        localTime: '09:30',
        location: 'Conference Room 229',
        timestamp: 1581017400000
      },
      {
        type: 'Hearing',
        description: 'Senate Commerce, Consumer Protection, and Health Hearing 2',
        localDate: '2020-01-25',
        localTime: '07:29',
        location: 'Conference Room 229',
        timestamp: 1580744190000
      }
    ]
  };

  describe('Do Not Remove Mock Data', () => {
    // putting this here to not have to remove test data
    it('No Remove bills', () => {
      expect(testBillMin.title).toBe(testBillMin.title);
      expect(testBillWithHistoryAndCalendar.title).toBe(testBillWithHistoryAndCalendar.title);
    });
  });

  describe('Abbreviate Formatting', () => {
    const length = 5;
    it('Shorten Length of Text', () => {
      const text = 'testing';
      expect(formatter.abbreviate(text, length)).toBe(`${text.substring(0, length - 3)}...`);
    });
    it('Do Not Shorten Length of Text', () => {
      const text = 'test';
      expect(formatter.abbreviate(text, length)).toBe(text);
    });
  });

  describe('Format Date', () => {
    it('Get String Representation of Timestamp', () => {
      const timestamp = '1580342400000';
      expect(formatter.date(timestamp)).toBe(new Date(timestamp).toLocaleDateString('en-US'));
    });
  });

  describe('Get Duration of Timestamp From Now', () => {
    beforeEach(() => {
      jest.spyOn(global.Date, 'now').mockImplementation(() => new Date('2020-02-05T11:01:58.13Z').valueOf());
    });

    it('Test Durations Second', () => {
      const timestamp = '1580900519000';
      const totalMillis = timestamp - Date.now();
      const durationValue = '1 second';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Seconds', () => {
      const timestamp = '1580900515000';
      const totalMillis = timestamp - Date.now();
      const durationValue = '3 seconds';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Minute', () => {
      const timestamp = '1580900578000';
      const totalMillis = timestamp - Date.now();
      const durationValue = '1 minute';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Minutes', () => {
      const timestamp = '1580900638000';
      const totalMillis = timestamp - Date.now();
      const durationValue = '2 minutes';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Hour', () => {
      const timestamp = '1580896918000';
      const totalMillis = timestamp - Date.now();
      const durationValue = '1 hour';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Hours', () => {
      const timestamp = '1580893318000';
      const totalMillis = timestamp - Date.now();
      const durationValue = '2 hours';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Day', () => {
      const timestamp = '1580986918130';
      const totalMillis = timestamp - Date.now();
      const durationValue = '1 day';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Days', () => {
      const timestamp = '1580342400000';
      const totalMillis = timestamp - Date.now();
      const durationValue = '6 days';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Year', () => {
      const timestamp = '1618743718130';
      const totalMillis = timestamp - Date.now();
      const durationValue = '1 year';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });

    it('Test Durations Years', () => {
      const timestamp = '1640818918130';
      const totalMillis = timestamp - Date.now();
      const durationValue = '2 years';
      const output = `${durationValue} ${totalMillis < 0 ? 'ago' : 'from now'}`;
      expect(formatter.duration(timestamp)).toBe(output);
    });
  });

  describe('Toggle Format', () => {
    it('Toggle On', () => {
      expect(formatter.toggle(true)).toBe('on');
    });
    it('Toggle Off', () => {
      expect(formatter.toggle(false)).toBe('off');
    });
  });
});
