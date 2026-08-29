import { TIngredient } from '@utils-types';
import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Test ingredient',
  type: 'main',
  proteins: 10,
  fat: 20,
  carbohydrates: 30,
  calories: 40,
  price: 100,
  image: 'image.png',
  image_large: 'image-large.png',
  image_mobile: 'image-mobile.png'
};

describe('ingredients reducer', () => {
  it('returns the initial state for an unknown action', () => {
    expect(ingredientsReducer(undefined, { type: 'UNKNOWN' })).toEqual({
      items: [],
      isLoading: false,
      error: null
    });
  });

  it('sets loading state when ingredients request is pending', () => {
    const state = ingredientsReducer(
      {
        items: [],
        isLoading: false,
        error: 'Previous error'
      },
      fetchIngredients.pending('request-id')
    );

    expect(state).toEqual({
      items: [],
      isLoading: true,
      error: null
    });
  });

  it('stores ingredients when request is fulfilled', () => {
    const state = ingredientsReducer(
      {
        items: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.fulfilled([ingredient], 'request-id')
    );

    expect(state).toEqual({
      items: [ingredient],
      isLoading: false,
      error: null
    });
  });

  it('stores error when ingredients request is rejected', () => {
    const state = ingredientsReducer(
      {
        items: [],
        isLoading: true,
        error: null
      },
      fetchIngredients.rejected(
        new Error('Request failed'),
        'request-id',
        undefined,
        'Не удалось загрузить ингредиенты'
      )
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Не удалось загрузить ингредиенты'
    });
  });
});
