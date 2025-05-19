declare module 'ical.js' {
  export interface Time {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    isDate: boolean;
    timezone: string;
  }

  export interface Duration {
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isNegative: boolean;
  }

  export interface Component {
    name: string;
    getAllProperties(): Property[];
    getFirstPropertyValue(propName: string): any;
    getFirstProperty(propName: string): Property | null;
    getAllSubcomponents(name?: string): Component[];
  }

  export interface Property {
    name: string;
    type: string;
    toICALString(): string;
    getFirstValue(): any;
    getValues(): any[];
  }

  export function parse(icsData: string): any[];
  export class Component {
    constructor(jCal: any | any[], parent?: Component);
    static fromString(str: string): Component;
  }
  
  export class Event {
    constructor(component: Component, options?: { strictExceptions: boolean });
    summary: string;
    startDate: Time;
    endDate: Time;
    description: string;
    location: string;
    uid: string;
    component: string;
    isRecurring(): boolean;
    iterator(): RecurExpansion;
  }

  export class RecurExpansion {
    constructor(options: {
      component: Component;
      dtstart: Time;
    });
    complete: boolean;
    next(): Time | null;
  }

  export class Timezone {
    static localTimezone: string;
    static utcTimezone: string;
    static convert_time(tt: Time, fromZone: string, toZone: string): Time;
  }

  export const TimezoneService: {
    get: (tzid: string) => Timezone | null;
    register: (tzid: string, zone: Timezone) => void;
  };

  export const Design: {
    getDesign: (component: string) => any;
  };

  export const Property: {
    fromString: (str: string) => Property;
  };
}
