import DueDateCalculator from '../src/DueDateCalculator';
import * as assert from 'assert';

describe('Due date calculator tests', function () {
    let calculator: DueDateCalculator;

    beforeEach(function () {
        calculator = new DueDateCalculator();
    });

    it('Should throw when a non-working hours submit time is used', function () {
        const submitTime = new Date('Aug 24, 2021 03:24:00');
        const turnaroundHours = 3;

        assert.throws(() => calculator.calculateDueDate(submitTime, turnaroundHours));
    });

    it('Should throw when a decimal number is used for turnaround hours', function () {
        const submitTime = new Date('Aug 24, 2021 09:24:00');
        const turnaroundHours = 3.5;

        assert.throws(() => calculator.calculateDueDate(submitTime, turnaroundHours));
    });

    it('Should return the result date occuring on the same working day', function () {
        const submitTime = new Date('Aug 24, 2021 9:00:00');
        const turnaroundHours = 3;

        const result = calculator.calculateDueDate(submitTime, turnaroundHours);

        assert.strictEqual(result.getHours(), 12);
    });

    it('Should return the result date occuring on the next working day', function () {
        const submitTime = new Date('Aug 24, 2021 16:00:00');
        const turnaroundHours = 3;

        const result = calculator.calculateDueDate(submitTime, turnaroundHours);

        assert.strictEqual(result.getHours(), 11);
        assert.strictEqual(result.getDate(), 25);
    });

    it('Should return the result date occuring on the next working week', function () {
        const submitTime = new Date('Aug 24, 2021 16:00:00');
        const turnaroundHours = 5 * 8; // 1 week

        const result = calculator.calculateDueDate(submitTime, turnaroundHours);

        assert.strictEqual(result.getHours(), 16);
        assert.strictEqual(result.getDate(), 31);
    });

    it('Should return the result date occuring on the next working month', function () {
        const submitTime = new Date('Aug 29, 2021 16:00:00');
        const turnaroundHours = 3 * 8; // 3 days

        const result = calculator.calculateDueDate(submitTime, turnaroundHours);

        assert.strictEqual(result.getHours(), 16);
        assert.strictEqual(result.getDate(), 1);
    });
});