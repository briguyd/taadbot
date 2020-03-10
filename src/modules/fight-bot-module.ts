// export abstract class Module {}
interface FightBotModule {
  // add some methods or something to distinguish from {}
  //   doAThing(): void;
}

// add a registry of the type you expect
export namespace FightBotModule {
  type Constructor<T> = {
    new (...args: any[]): T;
    readonly prototype: T;
  };
  const implementations: Constructor<FightBotModule>[] = [];
  export function getImplementations(): Constructor<FightBotModule>[] {
    return implementations;
  }
  export function register<T extends Constructor<FightBotModule>>(ctor: T) {
    console.log("registering");
    implementations.push(ctor);
    return ctor;
  }
}
