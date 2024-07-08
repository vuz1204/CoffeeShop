import {create} from 'zustand';
import {produce} from 'immer';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CoffeeData from '../data/CoffeData';
import BeansData from '../data/BeansData';

export const useStore = create(
  persist(
    (set, get) => ({
      coffeeList: CoffeeData,
      BeanList: BeansData,
      CartPrice: 0,
      FavouritesList: [],
      CartList: [],
      OrderHistoryList: [],
      recentlyViewedProducts: [],
      hotProducts: [],
      addToRecentlyViewed: (productId: any) =>
        set(
          produce(state => {
            const index = state.recentlyViewedProducts.indexOf(productId);
            if (index !== -1) {
              state.recentlyViewedProducts.splice(index, 1);
            }
            state.recentlyViewedProducts.unshift(productId);
            state.recentlyViewedProducts = state.recentlyViewedProducts.slice(
              0,
              5,
            );
          }),
        ),
      addToCart: (cartItem: any) =>
        set(
          produce(state => {
            let found = false;
            for (let i = 0; i < state.CartList.length; i++) {
              if (state.CartList[i].id == cartItem.id) {
                found = true;
                let size = false;
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                  if (
                    state.CartList[i].prices[j].size == cartItem.prices.size
                  ) {
                    size = true;
                    state.CartList[i].prices[j].quantity++;
                    break;
                  }
                }
                if (size == false) {
                  state.CartList[i].prices.push(cartItem.prices[0]);
                }
                state.CartList[i].prices.sort((a: any, b: any) => {
                  if (a.size > b.size) {
                    return -1;
                  }
                  if (a.size < b.size) {
                    return 1;
                  }
                  return 0;
                });
                break;
              }
            }
            if (found == false) {
              state.CartList.push(cartItem);
            }
            const productSoldCount: {[key: string]: number} = {}; // Đây là cách khai báo một object trong TypeScript, trong đó key là string và value là number

            state.CartList.forEach((item: any) => {
              // Đảm bảo kiểu dữ liệu của item là any
              if (productSoldCount[item.id]) {
                productSoldCount[item.id]++;
              } else {
                productSoldCount[item.id] = 1;
              }
            });

            // Sắp xếp sản phẩm theo số lượng bán được và giữ lại 5 sản phẩm đầu tiên
            const sortedProducts = Object.keys(productSoldCount).sort(
              (a, b) => productSoldCount[b] - productSoldCount[a],
            );
            state.hotProducts = sortedProducts.slice(0, 5);
          }),
        ),
      calculateCartPrice: () =>
        set(
          produce(state => {
            let totalPrice = 0;
            for (let i = 0; i < state.CartList.length; i++) {
              let tempPrice = 0;
              for (let j = 0; j < state.CartList[i].prices.length; j++) {
                tempPrice +=
                  parseFloat(state.CartList[i].prices[j].price) *
                  state.CartList[i].prices[j].quantity;
              }
              state.CartList[i].ItemPrice = tempPrice.toFixed(2).toString();
              totalPrice += tempPrice;
            }
            state.CartPrice = totalPrice.toFixed(2).toString();
          }),
        ),
      addToFavoriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type == 'Coffee') {
              const coffeeIndex = state.coffeeList.findIndex(
                (item: any) => item.id === id,
              );
              if (coffeeIndex !== -1) {
                state.coffeeList[coffeeIndex].favourite = true;
                state.FavouritesList.unshift(state.coffeeList[coffeeIndex]);
              }
            } else if (type == 'Bean') {
              const beanIndex = state.BeanList.findIndex(
                (item: any) => item.id === id,
              );
              if (beanIndex !== -1) {
                state.BeanList[beanIndex].favourite = true;
                state.FavouritesList.unshift(state.BeanList[beanIndex]);
              }
            }
          }),
        ),

      deleteFromFavoriteList: (type: string, id: string) =>
        set(
          produce(state => {
            if (type == 'Coffee') {
              const coffeeIndex = state.coffeeList.findIndex(
                (item: any) => item.id === id,
              );
              if (coffeeIndex !== -1) {
                state.coffeeList[coffeeIndex].favourite = false;
              }
            } else if (type == 'Bean') {
              const beanIndex = state.BeanList.findIndex(
                (item: any) => item.id === id,
              );
              if (beanIndex !== -1) {
                state.BeanList[beanIndex].favourite = false;
              }
            }
            const spliceIndex = state.FavouritesList.findIndex(
              (item: any) => item.id === id,
            );
            if (spliceIndex !== -1) {
              state.FavouritesList.splice(spliceIndex, 1);
            }
          }),
        ),
      incrementCardItemQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.CartList.length; i++) {
              if (state.CartList[i].id == id) {
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                  if (state.CartList[i].prices[j].size == size) {
                    state.CartList[i].prices[j].quantity++;
                    break;
                  }
                }
              }
            }
          }),
        ),
      decrementCardItemQuantity: (id: string, size: string) =>
        set(
          produce(state => {
            for (let i = 0; i < state.CartList.length; i++) {
              if (state.CartList[i].id == id) {
                for (let j = 0; j < state.CartList[i].prices.length; j++) {
                  if (state.CartList[i].prices[j].size == size) {
                    if (state.CartList[i].prices.length > 1) {
                      if (state.CartList[i].prices[j].quantity > 1) {
                        state.CartList[i].prices[j].quantity--;
                      } else {
                        state.CartList[i].prices.splice(j, 1);
                      }
                    } else {
                      if (state.CartList[i].prices[j].quantity > 1) {
                        state.CartList[i].prices[j].quantity--;
                      } else {
                        state.CartList.splice(i, 1);
                      }
                    }
                    break;
                  }
                }
              }
            }
          }),
        ),
      addToOrderHistoryListFromCard: () =>
        set(
          produce(state => {
            let temp = state.CartList.reduce(
              (acc: number, cur: any) => acc + parseFloat(cur.ItemPrice),
              0,
            );
            if (state.OrderHistoryList.length > 0) {
              state.OrderHistoryList.unshift({
                orderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                cartList: state.CartList,
                cartListPrice: temp.toFixed(2).toString(),
              });
            } else {
              state.OrderHistoryList.push({
                orderDate:
                  new Date().toDateString() +
                  ' ' +
                  new Date().toLocaleTimeString(),
                cartList: state.CartList,
                cartListPrice: temp.toFixed(2).toString(),
              });
            }
            state.CartList = [];
          }),
        ),
    }),
    {
      name: 'coffee-app',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
