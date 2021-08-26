
interface Options {
    workdayStartHour: number;
    workdayEndHour: number;
}

const DefaultOptions: Options = {
    workdayStartHour: 9,
    workdayEndHour: 17
}

const FRIDAY_INDEX = 5;
const FRIDAY_TO_MONDAY_DAYS = 3; 

export default class DueDateCalculator {
    private readonly workdayStartHour: number;
    private readonly workdayEndHour: number;

    constructor(options: Options = DefaultOptions) {
        this.workdayStartHour = options.workdayStartHour;
        this.workdayEndHour = options.workdayEndHour;
    }

    calculateDueDate(submitTime: Date, turnaroundHours: number) {
        this.validateSubmitTime(submitTime);
        this.validateTurnaroundHours(turnaroundHours);

        const { fullWorkdays, remainderHours } = this.convertToWorkdays(turnaroundHours);

        let dueDate = new Date(submitTime);

        for(let i = 0; i < fullWorkdays; i++) {
            this.setDateToNextWorkingDay(dueDate);
        }

        for(let i = 0; i < remainderHours; i++) {
            this.setDateToNextWorkingHour(dueDate);
        }

        return dueDate;
    }

    private get workdayHours() {
        return this.workdayEndHour - this.workdayStartHour;
    }

    private setDateToNextWorkingDay(d: Date) {
        const isFriday = d.getDay() === FRIDAY_INDEX;

        if (isFriday) {
            d.setDate(d.getDate() + FRIDAY_TO_MONDAY_DAYS);
        } else {
            d.setDate(d.getDate() + 1);
        }
    }

    private setDateToNextWorkingHour(d: Date) {
        const isLastHour = d.getHours() === this.workdayEndHour - 1;

        if (isLastHour) {
            this.setDateToNextWorkingDay(d);
            d.setHours(this.workdayStartHour);
        } else {
            d.setHours(d.getHours() + 1);
        }
    }

    private convertToWorkdays(turnaroundHours: number) {
        const fullWorkdays = Math.floor(turnaroundHours / this.workdayHours);
        const remainderHours = turnaroundHours % this.workdayHours;
        return { fullWorkdays, remainderHours };
    }

    private validateSubmitTime(submitTime: Date): void {
        const submitHours = submitTime.getHours();
        if (submitHours < this.workdayStartHour || submitHours >= this.workdayEndHour) {
            throw new RangeError(`Submit time "${submitTime.toString()}" must be between working hours!`);
        }
    }

    private validateTurnaroundHours(turnaroundHours: number): void { 
        if(turnaroundHours % 1 !== 0) {
            throw new RangeError('Turnaround hours should be a whole number!')
        }
    }
}