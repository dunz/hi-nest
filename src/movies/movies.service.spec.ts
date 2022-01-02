import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('should find a movie', () => {
      service.create({
        title: 'asdf',
        year: 2020,
        genres: ['2020'],
      });

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie).toEqual({
        id: 1,
        title: 'asdf',
        year: 2020,
        genres: ['2020'],
      });
    });
    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Not found movie with id: 999');
      }
    });
  });

  describe('deleteOne', () => {
    it('delete a movie', () => {
      service.create({
        title: 'asdf',
        year: 2020,
        genres: ['2020'],
      });
      const beforeDelete = service.getAll().length;
      service.deleteOne(1);
      const afterDelete = service.getAll().length;
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should return a 404', () => {
      try {
        service.deleteOne(10);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCraete = service.getAll().length;
      service.create({
        title: 'asdf',
        year: 2020,
        genres: ['2020'],
      });
      const afterCraete = service.getAll().length;
      expect(afterCraete).toBeGreaterThan(beforeCraete);
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.create({
        title: 'asdf',
        year: 2020,
        genres: ['2020'],
      });
      service.update(1, { title: 'Update title' });
      const movie = service.getOne(1);
      expect(movie).toEqual({
        id: 1,
        title: 'Update title',
        year: 2020,
        genres: ['2020'],
      });
    });
    it('should throw a NotFoundException', () => {
      try {
        service.update(10, {});
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
