import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import styles from './homepage_style';

const { width } = Dimensions.get('window');

const HomePage = ({ navigation, loginAs, setLoginAs, isLoggedin }) => {
  const items = [
    {
      id: 1,
      title: 'ECON BC1003 Textbook',
      price: '$50',
      //image: require('./static/images/store 2.png')
    },
    {
      id: 2,
      title: 'Bean Bag',
      price: '$30',
      //image: require('./static/images/store 2.png')
    },
    {
      id: 3,
      title: 'Used PS4 Pro',
      price: '$300',
      //image: require("./static/images/store 2.png")
    },
    {
      id: 4,
      title: 'Food scale',
      price: '$10',
      //image: require("./static/images/store 2.png")
    },
    {
      id: 5,
      title: 'Zelda BOTW',
      price: '$45',
      //image: require('./static/images/store 2.png')
    },
    {
      id: 6,
      title: 'Zelda BOTW',
      price: '$45',
      //image: require('./static/images/store 2.png')
    }
  ];

  const categories = ['For you', 'Categories', 'Nearby', 'Recently viewed'];

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('./static/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#666"
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Image
                source={require('./static/images/camera.png')}
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryButton}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Items Grid */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.itemsContainer}
        >
          {items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemCard}
              onPress={() => console.log(`Clicked ${item.title}`)}
            >
              <Image
                source={item.image}
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./static/images/home(selected) 2.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./static/images/heart 2.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Sell')}>
            <Image source={require('./static/images/store 2.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./static/images/chat 2.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./static/images/profile 2.png')} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomePage;