import { Factory, Seeder } from 'typeorm-seeding';
import { venda } from '../../core/venda/entities/venda.entity';

export class VendaSeed implements Seeder {
  public async run(factory: Factory): Promise<void> {
    await factory(venda)().createMany(10);
  }
}
