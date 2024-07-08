import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {useStore} from '../store/store';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import CoffeeCard from '../components/CoffeeCard';
import {MyTheme, useTheme} from '../theme/MyTheme';
import Carousel from '../components/Carousel';

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};

const getCoffeeList = (category: string, data: any) => {
  if (category == 'All') {
    return data;
  } else {
    let coffeeList = data.filter((item: any) => item.name == category);
    return coffeeList;
  }
};

const HomeScreen = ({navigation}: any) => {
  const coffeeList = useStore((state: any) => state.coffeeList);
  const beanList = useStore((state: any) => state.BeanList);
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);
  const recentlyViewedProducts = useStore(
    (state: any) => state.recentlyViewedProducts,
  );
  const hotProducts = useStore((state: any) => state.hotProducts);
  const [categories, setCategories] = useState(
    getCategoriesFromData(coffeeList),
  );
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 1,
    category: categories[1],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeList(categoryIndex.category, coffeeList),
  );

  const listRef: any = useRef<FlatList>();
  const tabBarHeight = useBottomTabBarHeight();

  const searchCoffee = (search: string) => {
    if (search != '') {
      listRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({index: 0, category: categories[0]});
      setSortedCoffee([
        ...coffeeList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };

  const resetSearchCoffee = () => {
    listRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({index: 0, category: categories[0]});
    setSortedCoffee([...coffeeList]);
    setSearchText('');
  };

  const coffeeCardAddToCard = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices,
    });
    calculateCartPrice();
    ToastAndroid.showWithGravity(
      `${name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  const {theme, toggleTheme} = useTheme();

  return (
    <MyTheme>
      <View
        style={[
          styles.screenContainer,
          {
            backgroundColor:
              theme === 'light' ? '#F7F8FA' : COLORS.primaryBlackHex,
          },
        ]}>
        <StatusBar
          backgroundColor={
            theme === 'light' ? '#F7F8FA' : COLORS.primaryBlackHex
          }
          barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewFlex}>
          {/* Header  */}
          <HeaderBar title="Home" />

          <Carousel />

          {/* Search Input */}
          <View
            style={[
              styles.inputContainerComponent,
              {
                backgroundColor:
                  theme === 'light' ? '#d7d7d7' : COLORS.primaryDarkGreyHex,
              },
            ]}>
            <CustomIcon
              style={styles.inputIcon}
              name="search"
              size={FONTSIZE.size_18}
              color={
                searchText.length > 0
                  ? COLORS.primaryOrangeHex
                  : COLORS.primaryLightGreyHex
              }
            />
            <TextInput
              placeholder="Find Your Coffee..."
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                searchCoffee(text);
              }}
              placeholderTextColor={
                theme === 'light' ? '#000000' : COLORS.primaryLightGreyHex
              }
              style={[
                styles.textInputContainer,
                {
                  color: theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
                },
              ]}
            />
            {searchText.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  resetSearchCoffee();
                }}>
                <CustomIcon
                  style={styles.inputIcon}
                  name="close"
                  size={FONTSIZE.size_16}
                  color={COLORS.primaryLightGreyHex}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>

          {/* Category Scroller */}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScrollViewStyle}>
            {categories.map((data, i) => (
              <View
                key={i.toString()}
                style={styles.categoryScrollViewContainer}>
                <TouchableOpacity
                  style={styles.categoryScrollViewItem}
                  onPress={() => {
                    listRef?.current?.scrollToOffset({
                      animated: true,
                      offset: 0,
                    });
                    setCategoryIndex({index: i, category: categories[i]});
                    setSortedCoffee([
                      ...getCoffeeList(categories[i], coffeeList),
                    ]);
                  }}>
                  <Text
                    style={[
                      styles.categoryText,
                      categoryIndex.index == i
                        ? {color: COLORS.primaryOrangeHex}
                        : {},
                    ]}>
                    {data}
                  </Text>
                  {categoryIndex.index == i ? (
                    <View style={styles.activeCategory} />
                  ) : (
                    <></>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Coffee Flatlist */}

          <FlatList
            ref={listRef}
            horizontal
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.categoryText}>No Coffee Available</Text>
              </View>
            }
            showsHorizontalScrollIndicator={false}
            data={sortedCoffee}
            contentContainerStyle={styles.flatListContainer}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Details', {
                      index: item.index,
                      id: item.id,
                      type: item.type,
                    });
                  }}>
                  <CoffeeCard
                    id={item.id}
                    index={item.index}
                    type={item.type}
                    roasted={item.roasted}
                    imagelink_square={item.imagelink_square}
                    name={item.name}
                    special_ingredient={item.special_ingredient}
                    avarage_rating={item.average_rating}
                    price={item.prices[2]}
                    buttonPressHandler={coffeeCardAddToCard}
                    theme={theme}
                  />
                </TouchableOpacity>
              );
            }}
          />

          <Text
            style={[
              styles.coffeeBeansTitle,
              {
                color: theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
              },
            ]}>
            New Product
          </Text>

          <FlatList
            ref={listRef}
            horizontal
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.categoryText}>No Coffee Available</Text>
              </View>
            }
            showsHorizontalScrollIndicator={false}
            data={sortedCoffee}
            contentContainerStyle={styles.flatListContainer}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Details', {
                      index: item.index,
                      id: item.id,
                      type: item.type,
                    });
                  }}>
                  <CoffeeCard
                    id={item.id}
                    index={item.index}
                    type={item.type}
                    roasted={item.roasted}
                    imagelink_square={item.imagelink_square}
                    name={item.name}
                    special_ingredient={item.special_ingredient}
                    avarage_rating={item.average_rating}
                    price={item.prices[2]}
                    buttonPressHandler={coffeeCardAddToCard}
                    theme={theme}
                  />
                </TouchableOpacity>
              );
            }}
          />

          <Text
            style={[
              styles.coffeeBeansTitle,
              {
                color: theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
              },
            ]}>
            Hot Product
          </Text>

          <FlatList
            ref={listRef}
            horizontal
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.categoryText}>No Coffee Available</Text>
              </View>
            }
            showsHorizontalScrollIndicator={false}
            data={hotProducts.map((productId: any) =>
              coffeeList.find((coffee: {id: any}) => coffee.id === productId),
            )}
            contentContainerStyle={styles.flatListContainer}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Details', {
                      index: item.index,
                      id: item.id,
                      type: item.type,
                    });
                  }}>
                  <CoffeeCard
                    id={item.id}
                    index={item.index}
                    type={item.type}
                    roasted={item.roasted}
                    imagelink_square={item.imagelink_square}
                    name={item.name}
                    special_ingredient={item.special_ingredient}
                    avarage_rating={item.average_rating}
                    price={item.prices[2]}
                    buttonPressHandler={coffeeCardAddToCard}
                    theme={theme}
                  />
                </TouchableOpacity>
              );
            }}
          />

          <Text
            style={[
              styles.coffeeBeansTitle,
              {
                color: theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
              },
            ]}>
            Recent Product
          </Text>

          <FlatList
            ref={listRef}
            horizontal
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Text style={styles.categoryText}>No Coffee Available</Text>
              </View>
            }
            showsHorizontalScrollIndicator={false}
            data={recentlyViewedProducts}
            contentContainerStyle={styles.flatListContainer}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              const product = coffeeList.find(
                (coffee: any) => coffee.id === item,
              );
              if (product) {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        index: product.index,
                        id: product.id,
                        type: product.type,
                      });
                    }}>
                    <CoffeeCard
                      id={product.id}
                      index={product.index}
                      type={product.type}
                      roasted={product.roasted}
                      imagelink_square={product.imagelink_square}
                      name={product.name}
                      special_ingredient={product.special_ingredient}
                      avarage_rating={product.average_rating}
                      price={product.prices[2]}
                      // Thêm vào giỏ hàng
                      buttonPressHandler={(cartItem: any) => {
                        addToCart(cartItem);
                        calculateCartPrice();
                        ToastAndroid.showWithGravity(
                          `${cartItem.name} is Added to Cart`,
                          ToastAndroid.SHORT,
                          ToastAndroid.CENTER,
                        );
                      }}
                      theme={theme}
                    />
                  </TouchableOpacity>
                );
              } else {
                return null;
              }
            }}
          />

          <Text
            style={[
              styles.coffeeBeansTitle,
              {
                color: theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
              },
            ]}>
            Coffee Beans
          </Text>

          {/* Bean Flatlist */}

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={beanList}
            contentContainerStyle={[
              styles.flatListContainer,
              {marginBottom: tabBarHeight},
            ]}
            keyExtractor={item => item.id}
            renderItem={({item}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('Details', {
                      index: item.index,
                      id: item.id,
                      type: item.type,
                    });
                  }}>
                  <CoffeeCard
                    id={item.id}
                    index={item.index}
                    type={item.type}
                    roasted={item.roasted}
                    imagelink_square={item.imagelink_square}
                    name={item.name}
                    special_ingredient={item.special_ingredient}
                    avarage_rating={item.average_rating}
                    price={item.prices[2]}
                    buttonPressHandler={coffeeCardAddToCard}
                    theme={theme}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </View>
    </MyTheme>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollViewFlex: {
    flexGrow: 1,
  },
  screenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    paddingLeft: SPACING.space_30,
  },
  inputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    alignItems: 'center',
  },
  inputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  textInputContainer: {
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    flex: 1,
  },
  categoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  categoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  categoryScrollViewItem: {
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  activeCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  flatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_20,
  },
  emptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  coffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});
