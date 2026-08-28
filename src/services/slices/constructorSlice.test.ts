import { TConstructorIngredient, TIngredient } from '@utils-types';
import constructorReducer, {
  addIngredient,
  clearConstructor,
  moveIngredient,
  removeIngredient
} from './constructorSlice';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Test bun',
  type: 'bun',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png'
};

const firstIngredient: TConstructorIngredient = {
  ...bun,
  _id: 'main-1',
  id: 'constructor-main-1',
  name: 'First filling',
  type: 'main'
};

const secondIngredient: TConstructorIngredient = {
  ...firstIngredient,
  _id: 'main-2',
  id: 'constructor-main-2',
  name: 'Second filling'
};

describe('burgerConstructor reducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(constructorReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('adds or replaces the bun', () => {
    const state = constructorReducer(undefined, addIngredient(bun));

    expect(state.bun).toEqual({
      ...bun,
      id: expect.any(String)
    });
    expect(state.ingredients).toEqual([]);
  });

  it('adds a filling with a unique constructor id', () => {
    const filling: TIngredient = {
      ...firstIngredient
    };
    const state = constructorReducer(undefined, addIngredient(filling));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({
      ...filling,
      id: expect.any(String)
    });
  });

  it('removes a filling by its constructor id', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      },
      removeIngredient(firstIngredient.id)
    );

    expect(state.ingredients).toEqual([secondIngredient]);
  });

  it('moves a filling to another position', () => {
    const state = constructorReducer(
      {
        bun: null,
        ingredients: [firstIngredient, secondIngredient]
      },
      moveIngredient({ from: 0, to: 1 })
    );

    expect(state.ingredients).toEqual([secondIngredient, firstIngredient]);
  });

  it('clears the constructor', () => {
    const state = constructorReducer(
      {
        bun: { ...bun, id: 'constructor-bun' },
        ingredients: [firstIngredient]
      },
      clearConstructor()
    );

    expect(state).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
