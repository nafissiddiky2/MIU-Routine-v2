const { simpleHash, getBatchFromId, to12h, timeToMinutes, mergeConsecutive, parseCSV } = require('../js/functions.js');

describe('simpleHash Function', () => {
    test('should hash "123456" consistently', () => {
        expect(simpleHash('123456')).toBe('x56760663');
    });

    test('should produce different hashes for different passwords', () => {
        expect(simpleHash('123456')).not.toBe(simpleHash('654321'));
    });

    test('should always start with "x"', () => {
        expect(simpleHash('anything').startsWith('x')).toBe(true);
    });
});

describe('getBatchFromId Function', () => {
    test('should extract batch 65 from 2465cse01176', () => {
        expect(getBatchFromId('2465cse01176')).toBe('65');
    });

    test('should extract batch 67 from 2567cse01234', () => {
        expect(getBatchFromId('2567cse01234')).toBe('67');
    });

    test('should extract batch 61 from 015231005101006', () => {
        expect(getBatchFromId('015231005101006')).toBe('61');
    });

    test('should return "00" for invalid ID', () => {
        expect(getBatchFromId('invalid')).toBe('00');
    });
});

describe('to12h Function', () => {
    test('should convert 9:00 to 9:00 AM', () => {
        expect(to12h('9:00')).toBe('9:00 AM');
    });

    test('should convert 11:00 to 11:00 AM', () => {
        expect(to12h('11:00')).toBe('11:00 AM');
    });

    test('should convert 12:00 to 12:00 PM', () => {
        expect(to12h('12:00')).toBe('12:00 PM');
    });

    test('should convert 14:00 to 2:00 PM', () => {
        expect(to12h('14:00')).toBe('2:00 PM');
    });
});

describe('timeToMinutes Function', () => {
    test('9:00 = 540 minutes', () => {
        expect(timeToMinutes('9:00-10:00')).toBe(540);
    });

    test('11:00 = 660 minutes', () => {
        expect(timeToMinutes('11:00-12:00')).toBe(660);
    });

    test('14:00 = 840 minutes', () => {
        expect(timeToMinutes('14:00-15:00')).toBe(840);
    });
});

describe('mergeConsecutive Function', () => {
    test('should merge 2-hour class', () => {
        const routines = [
            {time: '11:00-12:00', startMin: 660, course: 'CSE3225', batch: '65', room: 'C102', teacher: 'SA'},
            {time: '12:00-13:00', startMin: 720, course: 'CSE3225', batch: '65', room: 'C102', teacher: 'SA'}
        ];
        const merged = mergeConsecutive(routines);
        expect(merged.length).toBe(1);
        expect(merged[0].time).toBe('11:00 - 13:00');
    });

    test('should NOT merge different courses', () => {
        const routines = [
            {time: '9:00-10:00', startMin: 540, course: 'CSE111', batch: '65', room: 'C102', teacher: 'SA'},
            {time: '10:00-11:00', startMin: 600, course: 'CSE222', batch: '65', room: 'C102', teacher: 'SA'}
        ];
        const merged = mergeConsecutive(routines);
        expect(merged.length).toBe(2);
    });

    test('should NOT merge different batches', () => {
        const routines = [
            {time: '11:00-12:00', startMin: 660, course: 'CSE3225', batch: '65', room: 'C102', teacher: 'SA'},
            {time: '12:00-13:00', startMin: 720, course: 'CSE3225', batch: '64', room: 'C102', teacher: 'SA'}
        ];
        const merged = mergeConsecutive(routines);
        expect(merged.length).toBe(2);
    });
});

describe('parseCSV Function', () => {
    test('should parse single routine', () => {
        const csv = 'Day,Room,9:00-10:00,10:00-11:00\nSAT,C209,68/CSE2121/TK';
        const routines = parseCSV(csv);
        expect(routines.length).toBe(1);
        expect(routines[0].course).toBe('CSE2121');
        expect(routines[0].teacher).toBe('TK');
        expect(routines[0].room).toBe('C209');
    });

    test('should handle batch with (F) section', () => {
        const csv = 'Day,Room,9:00-10:00\nSUN,C209,60(F)/CSE434(L)/MMM';
        const routines = parseCSV(csv);
        expect(routines[0].batchDisplay).toBe('60(F)');
        expect(routines[0].batch).toBe('60');
    });

    test('should handle multiple batches', () => {
        const csv = 'Day,Room,9:00-10:00\nSAT,C209,(63+62)/CSE3223/TK';
        const routines = parseCSV(csv);
        expect(routines.length).toBe(2);
        expect(routines[0].batch).toBe('63');
        expect(routines[1].batch).toBe('62');
    });
});
