import { Log, Logger } from './decorators';

@Logger()
class FruitManager {
  private items: string[] = [];

  @Log()
  async getItems() {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return this.items;
  }

  @Log()
  addItems(...fruits: string[]) {
    this.items.push(...fruits);
  }
}

const manager = new FruitManager();

manager.addItems('apple', 'banana', 'cherry', 'lemon');
manager.getItems().then(console.log);
