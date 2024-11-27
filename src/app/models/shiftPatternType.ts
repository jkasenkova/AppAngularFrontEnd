export class ShiftPatternType {
    static readonly hours12 = 0;
    static readonly hours8 = 1;
    static readonly manual = 2;
  
    static readonly Names: { [key: number]: string } = {
      [ShiftPatternType.hours12]: '12 hours',
      [ShiftPatternType.hours8]: '8 hours',
      [ShiftPatternType.manual]: 'Manual',
    };
  
    static getAll(): Array<{ key: number; name: string }> {
      return Object.entries(ShiftPatternType.Names).map(([key, name]) => ({
        key: +key,
        name,
      }));
    }
}