export class RotationType {
    static readonly NoRotation = 0;
    static readonly Shift = 1;
  
    static readonly Names: { [key: number]: string } = {
      [RotationType.NoRotation]: 'No Rotation',
      [RotationType.Shift]: 'Shift'
    };
  
    static getAll(): Array<{ key: number; name: string }> {
      return Object.entries(RotationType.Names).map(([key, name]) => ({
        key: +key,
        name,
      }));
    }
  }