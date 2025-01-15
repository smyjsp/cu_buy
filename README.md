# CUBuy Documentation V0.1
![alt text](CUBuy_img.png)
# Introduction

The mission of CUBuy is to foster a stronger sense of community among students at Columbia University by providing a dedicated platform for secure and seamless buying and selling of goods.

Project by: Audrey Li, Alex Zhu, Judy Shi, Min Yub Song
<br>
Project Video Presentation URL:
https://youtu.be/fGbX0immkGc

### **Key Objectives**:

- **Facilitating Mutual Support**: CUBuy enables students to help one another by exchanging items that support academic and personal growth.
- **Promoting Affordability**: The platform offers students an economical way to access essential items, alleviating the financial burdens of campus life.
- **Ensuring Security**: By creating a trusted and exclusive environment, CUBuy ensures safe and reliable transactions between members of the Columbia University community.

Through these initiatives, CUBuy empowers students to connect, collaborate, and thrive in a secure ecosystem tailored specifically to their needs.

# Project Setup

The following section will briefly describe the setup of the project. There will be 2 main components, [Backend](https://www.notion.so/CUBuy-Documentation-V0-1-15ed2f005564808c9b4afb3ce3c3a062?pvs=21) and [Frontend](https://www.notion.so/CUBuy-Documentation-V0-1-15ed2f005564808c9b4afb3ce3c3a062?pvs=21). Additionally, we have attached an [External Dependencies](https://www.notion.so/CUBuy-Documentation-V0-1-15ed2f005564808c9b4afb3ce3c3a062?pvs=21) section for your reference.

## Backend

In this section, we will go through the server script, database setup, and database models. We have deployed the server on an Amazon EC2 Ubuntu instance, the setup can be found in this [video](https://www.youtube.com/watch?v=ct1GbTvgVNM&t=512s). 

### Server Script

The server script can be found under `./server/app.py` . The server handles all the business executions. In the server, we have implemented all the basic function needed for CUBuy to operate. 

- **`add_item`**: Handles the creation of new items, validates inputs, saves images, and stores item details in the database.
- **`serve_image`**: Serves a specific image file from the user's directory based on the given filename and UNI.
- **`serve_item_image`**: Provides access to item-specific images stored in a user's items directory.
- **`home`**: Returns a basic "Hello, Flask!" message for the root URL.
- **`about`**: Delivers a simple description of the Flask server functionality.
- **`login`**: Authenticates a user by verifying email and password credentials.
- **`register`**: Registers a new user, saves optional profile and ID images, and creates user-specific directories.
- **`mark_item_as_sold`**: Marks an item as sold, removes its associated images, and updates the database.
- **`get_items`**: Retrieves a list of all unsold items, including their details and base64-encoded images.
- **`get_user`**: Fetches a user's details, including their name, email, UNI, and profile image.
- **`get_user_items`**: Returns all unsold items posted by a specific user with their associated details and images.

## Database

We have setup a relational MySQL database in our Amazon EC2 instance. There are 2 essential tables to facilitate CUBuy:

### Users

- Data Definition Language:
    
    ```sql
    CREATE TABLE `Users` (
      `id` int NOT NULL AUTO_INCREMENT,
      `name` varchar(255) NOT NULL,
      `password` varchar(255) DEFAULT NULL,
      `email` varchar(255) NOT NULL,
      `uni` varchar(20) NOT NULL,
      `id_card_image_url` varchar(255) DEFAULT NULL,
      `profile_image_url` varchar(255) DEFAULT NULL,
      PRIMARY KEY (`id`),
      UNIQUE KEY `email` (`email`),
      UNIQUE KEY `uni` (`uni`),
      CONSTRAINT `Users_chk_1` CHECK (((`email` like _utf8mb4'%@barnard.edu') or (`email` like _utf8mb4'%@columbia.edu')))
    )
    ```
    
- Explanation: This DDL creates a table named **`Users`** to store user information. The table includes columns for user ID (auto-incremented primary key), name, password, email, UNI (unique identifier), and optional image URLs for ID cards and profile pictures. The `email` and `uni` fields are enforced as **unique keys** to prevent duplicates. Additionally, a **CHECK constraint** (`Users_chk_1`) ensures that the `email` field only allows addresses ending in `@barnard.edu` or `@columbia.edu`, maintaining domain-specific validation.

### Items

- Data Definition Language:

```sql
CREATE TABLE `Items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `detail` text,
  `price` decimal(10,2) NOT NULL,
  `category_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `transaction_location` varchar(255) DEFAULT NULL,
  `posted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pickup_start_datetime` timestamp NULL DEFAULT NULL,
  `pickup_end_datetime` timestamp NULL DEFAULT NULL,
  `condition` enum('new','like new','good','fair','poor') NOT NULL,
  `sold` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `Categories` (`id`),
  CONSTRAINT `Items_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`)
)
```

- Explanation: This DDL creates a table named **`Items`** to store item listings with details like title, description, price, condition, and image URL. It includes timestamps for posting and pickup schedules, as well as a `sold` flag to track availability. The table enforces foreign key relationships with `Categories` and `Users` tables through `category_id` and `user_id`, ensuring referential integrity. Additionally, an `enum` field validates the item's condition, while indexes on `category_id` and `user_id`optimize query performance.

<aside>
💡
</aside>

---

## Frontend

We used React Native to implement a iOS compatible frontend. In the following section we will go through the components and the setup procedure.

### Frontend Components

- **homepage.js**

Main landing page that displays all listed items in a grid format. Includes a search bar, category filters, and navigation bar with links to other main features.

- **LoginScreen.js**

Handles user authentication with Columbia/Barnard email and password. Provides access to the main app features upon successful login.

- **registration.js**

Manages new user registration with profile photo and CU ID verification. Collects user information including name, email, UNI, and password.

- **SellScreen.js**

Interface for users to create new item listings with photos, price, and details. Includes pickup time and location selection functionality.

- **itemdetail.js**

Displays detailed information about a specific item including multiple photos, description, and pickup details. Provides contact seller functionality for interested buyers.

- **personal.js**

Shows user's profile information and manages their listed items. Includes options to mark items as sold and log out.

- **[style files].js**

(homepage_style.js, etc.) Contains styling information for their respective components using React Native's StyleSheet. Ensures consistent UI/UX across the application.

### Setup

1. Pull from GitHub repository at 

[https://github.com/AlexZhu2/COMS4170CUBuy.git](https://github.com/AlexZhu2/COMS4170CUBuy.git)

by running 

```bash
git clone https://github.com/AlexZhu2/COMS4170CUBuy.git
cd COMS4170CUBuy
```

1. Install all the dependencies by running `npm install` , it will take a few minutes.
2. Start Expo `npx expo start` , make sure there is a QR code showing up in your terminal
3. Download Expo app from App Store, the app is Expo Go.
4. Scan the QR code with your iPhone camera App, it will redirect you to Expo and the app will start running automatically.

<aside>
💡

You do not need to modify server or any config files.

</aside>

---

## External Dependencies

📱 **React Native Core**

`react-native`: Core framework for building mobile apps

`react-navigation/native & react-navigation/native-stack`: Navigation system

`react-native-safe-area-context`: Handles safe area insets🎨

**UI Components & Animation**

`react-native-maps`: For displaying location maps

`react-native-animatable`: Adds animations to components

`expo-image-picker`: Handles image selection from camera/gallery

`expo-image-manipulator`: For image processing and rotation🔧

**Utilities**

`expo-location`: Manages location services

`react-native-community/datetimepicker`: Date and time picker component

`react-native-modal-datetime-picker`: Modal wrapper for datetime picker🌐

**Network & Data**

`fetch`: Built-in API for network requests

`FormData`: For handling multipart form data (image uploads)🔐