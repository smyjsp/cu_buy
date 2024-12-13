import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  listButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  imageUpload: {
    width: (width - 48) / 3,
    height: (width - 48) / 3,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  addPhotos: {
    alignItems: 'center',
  },
  cameraIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  addPhotosText: {
    fontSize: 12,
    color: '#666',
  },
  emptySlot: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  formSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  titleInput: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  descriptionInput: {
    fontSize: 16,
    paddingVertical: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dollarSign: {
    fontSize: 16,
    marginRight: 4,
  },
  priceInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    fontSize: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    marginBottom: 16,
  },
  conditionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  conditionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  conditionButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  conditionButtonText: {
    color: '#666',
  },
  conditionButtonTextSelected: {
    color: '#fff',
  },
  saveDraftButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    alignItems: 'center',
  },
  saveDraftText: {
    color: '#666',
    fontSize: 16,
  },
});

export default styles;