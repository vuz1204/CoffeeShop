import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  LogBox,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

const Carousel = () => {
  const flatlistRef = useRef();
  // Get Dimesnions
  const screenWidth = Dimensions.get('window').width;
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto Scroll

  useEffect(() => {
    let interval = setInterval(() => {
      if (activeIndex === carouselData.length - 1) {
        flatlistRef.current.scrollToIndex({
          index: 0,
          animated: true, // corrected property name
        });
        setActiveIndex(0); // reset active index to 0
      } else {
        flatlistRef.current.scrollToIndex({
          index: activeIndex + 1,
          animated: true, // corrected property name
        });
        setActiveIndex(activeIndex + 1); // increment active index
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeIndex]); // added activeIndex as a dependency

  const getItemLayout = (data, index) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index: index,
  });

  // Data for carousel
  const carouselData = [
    {
      id: '01',
      image: require('../assets/coffee_assets/americano/square/americano_pic_1_square.png'),
    },
    {
      id: '02',
      image: require('../assets/coffee_assets/black_coffee/square/black_coffee_pic_1_square.png'),
    },
    {
      id: '03',
      image: require('../assets/coffee_assets/cappuccino/square/cappuccino_pic_2_square.png'),
    },
  ];

  //  Display Images // UI
  const renderItem = ({item, index}) => {
    return (
      <View>
        <Image source={item.image} style={{height: 300, width: screenWidth}} />
      </View>
    );
  };

  // Handle Scroll
  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.floor(scrollPosition / screenWidth); // corrected index calculation
    setActiveIndex(index);
  };

  // Render Dot Indicators
  const renderDotIndicators = () => {
    return carouselData.map((dot, index) => {
      if (activeIndex === index) {
        return (
          <View
            key={index}
            style={{
              backgroundColor: 'black',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 6,
            }}></View>
        );
      } else {
        return (
          <View
            key={index}
            style={{
              backgroundColor: 'grey',
              height: 10,
              width: 10,
              borderRadius: 5,
              marginHorizontal: 6,
            }}></View>
        );
      }
    });
  };

  return (
    <View style={{marginTop: 20}}>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={carouselData}
        ref={flatlistRef}
        getItemLayout={getItemLayout}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 30,
        }}>
        {renderDotIndicators()}
      </View>
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({});
