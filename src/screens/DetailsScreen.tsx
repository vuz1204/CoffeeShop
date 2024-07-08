import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  TextInput,
  ToastAndroid,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useStore} from '../store/store';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import ImageBackgroudnInfo from '../components/ImageBackgroundInfo';
import PaymentFooter from '../components/PaymentFooter';
import {MyTheme, useTheme} from '../theme/MyTheme';
import CoffeeCard from '../components/CoffeeCard';
import {useDispatch, useSelector} from 'react-redux';
import {addCommentAPI, fetchComments} from '../redux/actions/CommentAction';
import {Dispatch} from 'redux';
import {RootState} from '../redux/store/index';
import auth,{ FirebaseAuthTypes } from '@react-native-firebase/auth';

const DetailsScreen = ({navigation, route}: any) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const listComment = useSelector(
    (state: RootState) => state.listComment.listComment,
  );

  const dispatch: Dispatch<any> = useDispatch();

  const itemOfIndex = useStore((state: any) =>
    route.params.type == 'Coffee' ? state.coffeeList : state.BeanList,
  )[route.params.index];

  const coffeeList = useStore((state: any) => state.coffeeList);

  const [commentInput, setCommentInput] = useState<string>('');

  useEffect(() => {
    dispatch(fetchComments());
  }, []);

  const addToFavoriteList = useStore((state: any) => state.addToFavoriteList);
  const deleteFromFavoriteList = useStore(
    (state: any) => state.deleteFromFavoriteList,
  );
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  const [price, setPrice] = useState(itemOfIndex.prices[0]);
  const [fullDesc, setFullDesc] = useState(false);

  const toggleFavourite = (favourite: boolean, type: string, id: string) => {
    favourite ? deleteFromFavoriteList(type, id) : addToFavoriteList(type, id);
  };

  const backHandler = () => {
    navigation.pop();
  };

  const addToCartHandler = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    price,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices: [{...price, quantity: 1}],
    });
    calculateCartPrice();
    navigation.navigate('Cart');
  };

  const {theme, toggleTheme} = useTheme();

  const addComment = () => {
    if (commentInput.trim() === '') {
      Alert.alert('Nhập nội dung trước');
    } else {
      let newCmt = {
        idProd: route.params.id,
        user: user?.email,
        content: commentInput,
      };
      dispatch(addCommentAPI(newCmt));
      setCommentInput('');
    }
  };

  const listRef: any = useRef<FlatList>();

  const addToRecentlyViewed = useStore(
    (state: any) => state.addToRecentlyViewed,
  );
  const recentlyViewedProducts = useStore(
    (state: any) => state.recentlyViewedProducts,
  );

  useEffect(() => {
    addToRecentlyViewed(route.params.id);
  }, []);

  return (
    <View
      style={[
        styles.screenContainer,
        {
          backgroundColor:
            theme === 'light' ? '#F7F8FA' : COLORS.primaryBlackHex,
        },
      ]}>
      <StatusBar
        backgroundColor={theme === 'light' ? '#F7F8FA' : COLORS.primaryBlackHex}
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewFlex}>
        <ImageBackgroudnInfo
          enableBackHandler={true}
          imagelink_portrait={itemOfIndex.imagelink_portrait}
          type={itemOfIndex.type}
          id={itemOfIndex.id}
          favourite={itemOfIndex.favourite}
          name={itemOfIndex.name}
          special_ingredient={itemOfIndex.special_ingredient}
          ingredients={itemOfIndex.ingredients}
          average_rating={itemOfIndex.average_rating}
          ratings_count={itemOfIndex.ratings_count}
          roasted={itemOfIndex.roasted}
          backHandler={backHandler}
          toggleFavourite={toggleFavourite}
        />
        <View style={styles.footerInfoArea}>
          <Text
            style={[
              styles.infoTitle,
              {
                color: theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
              },
            ]}>
            Description
          </Text>
          {fullDesc ? (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullDesc(prev => !prev);
              }}>
              <Text
                style={[
                  styles.descriptionText,
                  {
                    color:
                      theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
                  },
                ]}>
                {itemOfIndex.description}
              </Text>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => {
                setFullDesc(prev => !prev);
              }}>
              <Text
                numberOfLines={3}
                style={[
                  styles.descriptionText,
                  {
                    color:
                      theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
                  },
                ]}>
                {itemOfIndex.description}
              </Text>
            </TouchableWithoutFeedback>
          )}
          <Text style={styles.infoTitle}>Size</Text>
          <View style={styles.sizeOuterContainer}>
            {itemOfIndex.prices.map((data: any) => (
              <TouchableOpacity
                key={data.size}
                onPress={() => {
                  setPrice(data);
                }}
                style={[
                  styles.sizeBox,
                  {
                    borderColor:
                      data.size == price.size
                        ? COLORS.primaryOrangeHex
                        : COLORS.primaryDarkGreyHex,
                  },
                ]}>
                <Text
                  style={[
                    styles.sizeText,
                    {
                      fontSize:
                        itemOfIndex.type == 'bean'
                          ? FONTSIZE.size_14
                          : FONTSIZE.size_16,
                      color:
                        data.size == price.size
                          ? COLORS.primaryOrangeHex
                          : COLORS.primaryLightGreyHex,
                    },
                  ]}>
                  {data.size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewFlex}>
          <View style={styles.commentSection}>
            <Text style={styles.infoTitle}>Comments</Text>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment"
              value={commentInput}
              onChangeText={text => setCommentInput(text)}
            />
            <TouchableOpacity style={styles.sendButton} onPress={addComment}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
            <View style={styles.commentContainer}>
              {listComment.map((comment, index) => (
                <Text key={index} style={styles.commentText}>
                  {comment.user} {'\n'}
                  {comment.content}
                </Text>
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={[styles.commentSection, {padding: 0}]}>
          <Text
            style={[
              styles.coffeeBeansTitle,
              {
                color: theme === 'light' ? '#000000' : COLORS.primaryWhiteHex,
              },
            ]}>
            Recent Product
          </Text>
        </View>
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
        <PaymentFooter
          price={price}
          buttonTitle="Add to cart"
          buttonPressHandler={() => {
            addToCartHandler({
              id: itemOfIndex.id,
              index: itemOfIndex.index,
              name: itemOfIndex.name,
              roasted: itemOfIndex.roasted,
              imagelink_square: itemOfIndex.imagelink_square,
              special_ingredient: itemOfIndex.special_ingredient,
              type: itemOfIndex.type,
              price: price,
            });
          }}
        />
      </ScrollView>
    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollViewFlex: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  commentContainer: {
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    backgroundColor: COLORS.primaryWhiteHex,
  },
  footerInfoArea: {
    padding: SPACING.space_20,
  },
  infoTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    marginBottom: SPACING.space_10,
  },
  descriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_30,
  },
  sizeOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },
  sizeBox: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_24 * 2,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
  },
  sizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
  },
  commentSection: {
    padding: SPACING.space_20,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLightGreyHex,
  },
  commentText: {
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryBlackHex,
    marginBottom: SPACING.space_10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.primaryLightGreyHex,
    borderRadius: BORDERRADIUS.radius_10,
    paddingHorizontal: SPACING.space_10,
    paddingVertical: SPACING.space_10 / 2,
    marginTop: SPACING.space_10,
  },
  flatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_20,
  },
  categoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  emptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  sendButton: {
    backgroundColor: 'black',
    borderRadius: BORDERRADIUS.radius_10,
    paddingVertical: SPACING.space_10,
    paddingHorizontal: SPACING.space_20,
    alignItems: 'center',
    marginTop: SPACING.space_10,
  },
  sendButtonText: {
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
  },
  coffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
});
