import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: width * 0.25,
    height: width * 0.25,
    resizeMode: 'contain',
    alignSelf: 'flex-start',
    marginTop: 0,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 0,
  },
  registrationText: {
    fontSize: 20,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: height * 0.04,
  },
  imageUploadButton: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    color: '#666',
    marginBottom: 8,
    marginTop: height * 0.02,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: width * 0.04,
    backgroundColor: '#FFF',
  },
  uploadContainer: {
    width: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ccc',
    borderRadius: 12,
    paddingVertical: height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: height * 0.02,
    minHeight: height * 0.25,
  },
  uploadIcon: {
    width: 24,
    height: 24,
    marginBottom: 8,
    tintColor: '#666',
  },
  uploadText: {
    color: '#666',
    fontSize: 16,
  },
  idPreviewContainer: {
    width: '100%',
    alignItems: 'center',
  },
  idPreview: {
    width: '90%',
    height: height * 0.22,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  changePhotoText: {
    color: '#666',
    fontSize: 14,
    marginTop: 8,
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#4285F4',
    borderRadius: 25,
    paddingVertical: height * 0.02,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.175,
    resizeMode: 'cover',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
  },
  signupLink: {
    color: '#007AFF',
    fontWeight: 'bold',
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#4285F4',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  headerRight: {
    width: 40,
  },
});

export default styles;
