import { ConsoleLogger } from './decorators';

class FruitManager {
  private items: string[] = [];

  @ConsoleLogger()
  async getItems() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return this.items;
  }

  @ConsoleLogger()
  addItems(...fruits: string[]) {
    this.items.push(...fruits);
  }
}

const manager = new FruitManager();

manager.addItems('apple', 'banana', 'cherry', 'lemon');
manager.getItems().then(console.log);
