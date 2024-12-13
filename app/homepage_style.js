import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
    header: {
      padding: 15,
      backgroundColor: '#fff',
    },
    logo: {
      width: 100,
      height: 30,
      marginBottom: 10,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      paddingHorizontal: 10,
    },
    searchInput: {
      flex: 1,
      height: 40,
      fontSize: 16,
    },
    cameraButton: {
      padding: 5,
    },
    cameraIcon: {
      width: 20,
      height: 20,
    },
    categoriesContainer: {
      backgroundColor: '#fff',
      paddingVertical: 10,
    },
    categoryButton: {
      paddingHorizontal: 15,
    },
    categoryText: {
      fontSize: 16,
      color: '#4285F4',
    },
    itemsContainer: {
      padding: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    itemCard: {
      width: (width - 30) / 2,
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 10,
      overflow: 'hidden',
    },
    itemImage: {
      width: '100%',
      height: (width - 30) / 2,
    },
    itemInfo: {
      padding: 10,
    },
    itemTitle: {
      fontSize: 14,
      marginBottom: 5,
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4285F4',
    },
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
    },
    navItem: {
      alignItems: 'center',
    },
    navIcon: {
      width: 24,
      height: 24,
    }
  });
  
  export default styles;