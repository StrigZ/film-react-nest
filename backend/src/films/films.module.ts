import { Module } from '@nestjs/common';
import { FilmsRepositoryModule } from 'src/repository/films-repository.module';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

@Module({
  imports: [FilmsRepositoryModule.register()],
  controllers: [FilmsController],
  providers: [FilmsService],
})
export class FilmsModule {}
