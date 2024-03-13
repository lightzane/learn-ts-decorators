import { ConsoleLogger } from './decorators';

class FruitManager {
  private items: string[] = [];

  @ConsoleLogger({
    format: ({ methodName, responseTime }) => `${methodName}=${responseTime}ms`,
  })
  async getItems() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return this.items;
  }

  @ConsoleLogger({ format: () => `adding items...` })
  addItems(...fruits: string[]) {
    this.items.push(...fruits);
  }
}

const manager = new FruitManager();

manager.addItems('apple', 'banana', 'cherry', 'lemon');
manager.getItems().then(console.log);
