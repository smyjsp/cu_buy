import { StyleSheet, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    header: {
      padding: 15,
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
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
    categoriesRow: {
      flexDirection: 'row',
      height: 35,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    categoryButton: {
      height: 35,
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoryText: {
      fontSize: 14,
      color: '#4285F4',
      fontWeight: '400',
    },
    itemsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: '#fff',
    },
    itemCard: {
      width: (width - 30) / 2,
      backgroundColor: '#fff',
      borderRadius: 8,
      marginBottom: 10,
      overflow: 'hidden',
      height: ((width - 30) / 2) + 70,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.25,
      shadowRadius: 5,
      elevation: 6,
      borderWidth: 1.5,
      borderColor: '#e0e0e0',
    },
    itemImage: {
      width: '100%',
      height: (width - 30) / 2,
    },
    itemInfo: {
      padding: 10,
      flex: 1,
      position: 'relative',
      backgroundColor: '#fff',
    },
    itemTitle: {
      fontSize: 14,
      marginBottom: 5,
    },
    itemPrice: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#4285F4',
      position: 'absolute',
      bottom: 10,
      right: 10,
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