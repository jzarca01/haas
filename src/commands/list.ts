import { Command, ux } from '@oclif/core';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

export default class ListCommand extends Command {
  static description = 'Fetch and display product list';

  async run() {
    try {
      // Fetch data from the API
      const response = await axios({
        url: "https://gethoumous-5dg3qqswqq-uc.a.run.app",
        method: "GET"
      });
      const products: Record<string, Product>[] = response.data;

      // Display the product list as a table
      this.log('Product List:');

      ux.table(products, {
        name: {},
        description: {},
        price: {},
        image: {},
      }, {
        printLine: this.log.bind(this),
        'no-truncate': true,
      })
    } catch (error) {
      this.error('An error occurred while fetching the product list.');
    }
  }
}
