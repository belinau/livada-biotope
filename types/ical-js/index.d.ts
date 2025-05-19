declare module 'ical-js' {
  export function parse(icalString: string): any;
  export class Component {
    public static fromString(str: string): Component;
    public getFirstSubcomponent(name?: string): Component | null;
    public getAllSubcomponents(name?: string): Component[];
    public getFirstPropertyValue(name: string): any;
    public getFirstProperty(name: string): Property | null;
    public getAllProperties(name: string): Property[];
  }
  
  export class Property {
    public getFirstValue(): any;
    public getFirstParameter(name: string): string | null;
  }
  
  export function stringify(jcal: any): string;
}
