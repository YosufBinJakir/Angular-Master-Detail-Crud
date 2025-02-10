import { Result } from "./result";
import { Shift } from "./shift";

export interface Student {
    studentId?:number;
    studentName?:string;
    shift?:Shift;
    birthDate?:Date|string;
    tutionFee?:number;
    picture?:string;
    isPresent?:boolean;
    results?:Result[];
}
