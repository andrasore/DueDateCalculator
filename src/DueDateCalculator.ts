
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

	get workdayHours() {
		return (this.workdayEndHour - this.workdayStartHour);
	}

	calculateDueDate(submitTime: Date, turnaroundHours: number) {
        this.validateSubmitTime(submitTime);

		const { fullWorkdays, remainderHours } = this.convertToWorkdays(turnaroundHours);

		let dueDate = new Date(submitTime);

		for(let i = 0; i < fullWorkdays; i++) {
			this.incrementOneWorkingDay(dueDate);
		}

		for(let i = 0; i < remainderHours; i++) {
			this.incrementOneWorkingHour(dueDate);
		}

        return dueDate;
	}

	incrementOneWorkingDay(d: Date) {
		const isFriday = d.getDay() === FRIDAY_INDEX;

		if (isFriday) {
			d.setDate(d.getDate() + FRIDAY_TO_MONDAY_DAYS);
		}
		else {
			d.setDate(d.getDate() + 1);
		}
	}

	incrementOneWorkingHour(d: Date) {
		const isLastHour = d.getHours() === this.workdayEndHour - 1;

		if (isLastHour) {
			this.incrementOneWorkingDay(d);
			d.setHours(this.workdayStartHour);
		}
		else {
			d.setHours(d.getHours() + 1);
		}
	}

	convertToWorkdays(turnaroundHours: number) {
		const fullWorkdays = Math.floor(turnaroundHours / this.workdayHours);
		const remainderHours = turnaroundHours % this.workdayHours;
		return { fullWorkdays, remainderHours };
	}

    private validateSubmitTime(submitTime: Date): void {
        const submitHours = submitTime.getHours();
        if (submitHours < this.workdayStartHour || submitHours >= this.workdayEndHour) {
            const formattedWorkingHours = `(${this.leftPadWith1Zero(this.workdayStartHour)}h-${this.leftPadWith1Zero(this.workdayEndHour)}h)`;
            throw new RangeError(`Submit time "${submitTime.toString()}" must be between working hours ${formattedWorkingHours}!`);
        }
    }

    private leftPadWith1Zero(value: number): string {
        return String(value).padStart(2, '0');
    }
}