import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import styles from './homepage_style';

const { width } = Dimensions.get('window');

const HomePage = ({ navigation, route }) => {
  const { loginAs, setLoginAs, isLoggedin } = route.params;
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);


  const fetchItems = async () => {
    try {
      const response = await fetch('http://3.149.231.33/items', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

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
              onPress={() => navigation.navigate('ItemDetail', { 
                item: item,
                loginAs: loginAs
              })}
            >
              {item.images && item.images.length > 0 ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${item.images[0]}` }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={[styles.itemImage, styles.noImage]}>
                  <Text>No Image</Text>
                </View>
              )}
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.itemPrice}>${item.price}</Text>
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
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Sell',{
            loginAs: loginAs,
            onListingSuccess: () =>{
              fetchItems();
            }
          })}>
            <Image source={require('./static/images/store 2.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem}>
            <Image source={require('./static/images/chat 2.png')} style={styles.navIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Personal', {
            loginAs: loginAs,
          })}>
            <Image source={require('./static/images/profile 2.png')} style={styles.navIcon} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomePage;