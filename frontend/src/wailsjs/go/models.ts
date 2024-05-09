export namespace excel {
	
	export class CheckInData {
	    code: string;
	    realName: string;
	    departmentCode: string;
	    departmentName: string;
	    date: string;
	    workShiftCode: string;
	    time: string;
	    cardNum: string;
	    workCheckIn: string;
	    workAttendStatus: string;
	    workAttendProcStatus: string;
	    offWorkCheckIn: string;
	    offWorkAttendStatus: string;
	    offWorkAttendProcStatus: string;
	    absenceHours: number;
	    leaveHours: number;
	    signLeaveHours: number;
	    overtimeHours: number;
	    signOvertimeHours: number;
	
	    static createFrom(source: any = {}) {
	        return new CheckInData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.code = source["code"];
	        this.realName = source["realName"];
	        this.departmentCode = source["departmentCode"];
	        this.departmentName = source["departmentName"];
	        this.date = source["date"];
	        this.workShiftCode = source["workShiftCode"];
	        this.time = source["time"];
	        this.cardNum = source["cardNum"];
	        this.workCheckIn = source["workCheckIn"];
	        this.workAttendStatus = source["workAttendStatus"];
	        this.workAttendProcStatus = source["workAttendProcStatus"];
	        this.offWorkCheckIn = source["offWorkCheckIn"];
	        this.offWorkAttendStatus = source["offWorkAttendStatus"];
	        this.offWorkAttendProcStatus = source["offWorkAttendProcStatus"];
	        this.absenceHours = source["absenceHours"];
	        this.leaveHours = source["leaveHours"];
	        this.signLeaveHours = source["signLeaveHours"];
	        this.overtimeHours = source["overtimeHours"];
	        this.signOvertimeHours = source["signOvertimeHours"];
	    }
	}

}

export namespace types {
	
	export class JSResp {
	    success: boolean;
	    msg: string;
	    data?: any;
	
	    static createFrom(source: any = {}) {
	        return new JSResp(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.success = source["success"];
	        this.msg = source["msg"];
	        this.data = source["data"];
	    }
	}

}

