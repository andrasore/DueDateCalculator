
interface Options {
    workdayStartHour: number;
    workdayEndHour: number;
}

const DefaultOptions: Options = {
    workdayStartHour: 5,
    workdayEndHour: 9
}

export default class DueDateCalculator {
    private readonly workdayStartHour: number;
    private readonly workdayEndHour: number;

    constructor(options: Options = DefaultOptions) {
        this.workdayStartHour = options.workdayStartHour; 
        this.workdayEndHour = options.workdayEndHour; 
    }

    CalculateDueDate(submitTime: Date, turnaroundTimeHours: number): Date {
        return new Date(0);
    }
}