export function Serialize() {
  return function (descriptor: PropertyDescriptor): PropertyDescriptor {
    const method = descriptor.value as (...args: unknown[]) => Promise<unknown>;

    if (typeof method !== "function") {
      return descriptor;
    }

    descriptor.value = async function (this: unknown, ...args: unknown[]): Promise<unknown> {
      const result = (await method.apply(this, args)) as unknown;

      if (result === null || result === undefined) {
        return result as unknown;
      }

      return JSON.parse(JSON.stringify(result)) as unknown;
    };

    return descriptor;
  };
}

export function SerializeAll(excludeMethods: string[] = []) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function <T extends new (...args: any[]) => object>(constructor: T): T {
    const prototype = constructor.prototype as Record<string, unknown>;

    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (name) => name !== "constructor" && typeof prototype[name] === "function" && !excludeMethods.includes(name)
    );

    methodNames.forEach((methodName) => {
      const originalMethod = prototype[methodName] as (...args: unknown[]) => Promise<unknown>;

      if (typeof originalMethod !== "function") {
        return;
      }

      prototype[methodName] = async function (this: unknown, ...args: unknown[]): Promise<unknown> {
        const result = (await originalMethod.apply(this, args)) as unknown;

        if (result === null || result === undefined) {
          return result as unknown;
        }

        return JSON.parse(JSON.stringify(result)) as unknown;
      };
    });

    return constructor;
  };
}
