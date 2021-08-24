import DueDateCalculator from '../src/DueDateCalculator';

describe('Due date calculator tests', function () {
    it('Should work', function () {
        const calculator = new DueDateCalculator();
        const result = calculator.CalculateDueDate(new Date(), 3);
    });
});