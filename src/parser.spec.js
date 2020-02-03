const parser = require('./parser');

describe('Parser Tests', () => {
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

  describe('Hearing Recent Sorts', () => {
    it('Recent Hearing Can Find Calendar', () => {
      expect(parser.recentHearing(testBillWithHistoryAndCalendar)).toBe(testBillWithHistoryAndCalendar.calendar[0]);
    });
    it('Recent Hearing Can Not Find Calendar', () => {
      expect(parser.recentHearing(testBillMin)).toEqual({});
    });
  });

  describe('History Recent Sorts', () => {
    it('Recent Hearing Can Find Calendar', () => {
      expect(parser.recentHistory(testBillWithHistoryAndCalendar)).toBe(testBillWithHistoryAndCalendar.history[0]);
    });
    it('Recent Hearing Can Not Find Calendar', () => {
      expect(parser.recentHistory(testBillMin)).toEqual({});
    });
  });

  describe('State Parsing', () => {
    it('Find State With No Input', () => {
      expect(parser.state(null)).toBe(null);
    });
    it('Find All State', () => {
      const allStates = 'all';
      expect(parser.state(allStates)).toBe(allStates.toUpperCase());
    });
    it('Find No State', () => {
      const state = 'xx';
      expect(parser.state(state)).toBe(null);
    });
    it('Find State Code By Code', () => {
      const state = 'al';
      expect(parser.state(state)).toBe(state.toUpperCase());
    });
    it('Find State Code By Name', () => {
      const state = 'maine';
      const stateCode = 'ME';
      expect(parser.state(state)).toBe(stateCode);
    });
  });

  describe('Timestamp Parsing', () => {
    const stateCode = 'ME';
    const date = testBillWithHistoryAndCalendar.calendar[0].localDate;
    const time = testBillWithHistoryAndCalendar.calendar[0].localTime;
    it('Format Date Time For Maine', () => {
      const output = Date.parse(`${date}T${time || '12:00'}:00.000-05:00`);
      expect(parser.timestamp(date, time, stateCode)).toBe(output);
    });
    it('Format Date Time For Maine Missing Time', () => {
      const nullTime = null;
      const output = Date.parse(`${date}T12:00:00.000-05:00`);
      expect(parser.timestamp(date, nullTime, stateCode)).toBe(output);
    });
    it('Format Date Time For Maine Missing TimeZone', () => {
      const output = Date.parse(`${date}T${time || '12:00'}:00.000+00:00`);
      expect(parser.timestamp(date, time, 'xx')).toBe(output);
    });
  });

  describe('Title', () => {
    it('Title Relevance Correct Options', () => {
      const relevantTitles = ['right to repair', 'fair digital repair', 'fair digital serv', 'fair electronic repair', 'fair electronic serv', 'right digital repair', 'right digital serv', 'right electronic repair', 'right electronic serv'];
      const relevantTitlesCapitalized = ['Fair Digital Repair', 'Fair Digital Serv', 'Fair Electronic Repair', 'Fair Electronic Serv', 'Right Digital Repair', 'Right Digital Serv', 'Right Electronic Repair', 'Right Electronic Serv'];
      for (const title of relevantTitles) {
        expect(parser.titleRelevance(title)).toBeTruthy();
      }
      for (const title of relevantTitlesCapitalized) {
        expect(parser.titleRelevance(title)).toBeTruthy();
      }
    });

    it('Title Relevance Bad Options', () => {
      const relevantTitles = ['digital repair', 'fair serv', 'repair', 'fair', 'digital', 'right', 'right electronic', 'electronic serv'];
      for (const title of relevantTitles) {
        expect(parser.titleRelevance(title)).toBeFalsy();
      }
    });

    it('Title Size Limit', () => {
      let title =
        '6uBGAaTugYKJPWDFJU3wfYTTJ2fVr9Olf9IdUp3LrUb2FaHBcRlpHB3yjFlQLFgWwppdoPunyihSceNU4KVvKARRvIMOENsgUsgURGpIL5UaqN6Kg1m3mYdCfAnTTFscjW5TDb9wVzDDOGoSWqZkVK55YYELz6cN48MXi9EXRxcB3z3Pga8RsPCxYBrOkH2gqonlWLdhjNFMQrXifv6Bbp6dJwJg5nRzenU25ZUKUG9ItDwkjopQmVOuNyPWCvqAm7szuNYyt2G5uADH4pWRgBceb21e4D9ooZ5c5yFPkJ3fqx1cLpayCjYBhrP4uMuSZocnYAHMQZO5mmEak8edAsTruYZ7gbqYkFDiT62nGYGmmBQDqzhjgbMrgTDXxWUM8ieLemiuucNDazn54tNtjMBUXtDPz103ZwmLUxKneTQPFc0JDmI3Ax7zGA2M45c2wLtYnGxPV5j1J1QduPQ9m5QXC9irplQ9p8kbnejfmX7cLe10DA';
      title = title.toLowerCase();
      const bill = { title };
      expect(parser.title(bill)).toBe(`${title.substring(0, 497)}...`);
    });

    it('Title Replace -', () => {
      let title = 'HB-12345';
      const bill = { title };
      title = title.replace(/-/g, ' ').toLowerCase();
      expect(parser.title(bill)).toBe(title);
    });
  });

  describe('Toggle', () => {
    it('Toggle On', () => {
      const relevantToggles = ['on', 'enable', 'enabled', 'true'];
      for (const toggle of relevantToggles) {
        expect(parser.toggle(toggle)).toBeTruthy();
      }
    });
    it('Toggle Off', () => {
      const relevantToggles = ['off', 'disable', 'disabled', 'false'];
      for (const toggle of relevantToggles) {
        expect(parser.toggle(toggle)).toBeFalsy();
      }
    });
    it('Toggle Nothing', () => {
      expect(parser.toggle('test')).toBeNull();
    });
  });
});
