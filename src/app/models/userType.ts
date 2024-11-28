export class UserType {
    static readonly Administrator = 0;
    static readonly LineManager = 1;
    static readonly User = 2;
  
    static readonly Names: { [key: number]: string } = {
      [UserType.Administrator]: 'Administrator',
      [UserType.LineManager]: 'Line Manager',
      [UserType.User]: 'User',
    };
  
    static getAll(): Array<{ key: number; name: string }> {
      return Object.entries(UserType.Names).map(([key, name]) => ({
        key: +key,
        name,
      }));
    }
  }
  