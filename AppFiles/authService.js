// authService.js - Authentication Service
class AuthService {
  constructor() {
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  // Load users from memory (in real app, this would be API calls)
  loadUsers() {
    const defaultUsers = [
      {
        id: '1',
        phone: '9876543210',
        name: 'John Doe',
        email: 'john@example.com',
        addresses: [
          {
            id: '1',
            type: 'Home',
            address: '123 MG Road, Bangalore',
            landmark: 'Near Coffee Day',
            isDefault: true,
            pincode: '560001'
          },
          {
            id: '2',
            type: 'Office',
            address: '456 Brigade Road, Bangalore',
            landmark: 'Opposite Metro Station',
            isDefault: false,
            pincode: '560002'
          }
        ],
        orderHistory: [
          {
            id: 'QM123456',
            date: '2024-01-15',
            total: 285,
            status: 'delivered',
            items: [
              { name: 'Fresh Bananas', quantity: 2, price: 40 },
              { name: 'Milk 1L', quantity: 1, price: 65 },
              { name: 'Bread Loaf', quantity: 1, price: 35 }
            ]
          }
        ],
        favorites: [1, 4, 7], // product IDs
        createdAt: '2024-01-01'
      }
    ];
    return defaultUsers;
  }

  // Load current user from memory
  loadCurrentUser() {
    return null; // No user logged in initially
  }

  // Generate OTP (demo implementation)
  generateOTP() {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const otp = this.generateOTP();
        console.log(`OTP sent to ${phoneNumber}: ${otp}`); // In real app, this would be SMS
        resolve({ success: true, otp, message: 'OTP sent successfully' });
      }, 1000);
    });
  }

  // Verify OTP and login/register user
  async verifyOTP(phoneNumber, enteredOTP, actualOTP) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (enteredOTP === actualOTP) {
          let user = this.users.find(u => u.phone === phoneNumber);
          
          if (!user) {
            // Create new user if doesn't exist
            user = {
              id: Date.now().toString(),
              phone: phoneNumber,
              name: '',
              email: '',
              addresses: [],
              orderHistory: [],
              favorites: [],
              createdAt: new Date().toISOString()
            };
            this.users.push(user);
          }
          
          this.currentUser = user;
          resolve({ success: true, user, isNewUser: !user.name });
        } else {
          resolve({ success: false, message: 'Invalid OTP' });
        }
      }, 500);
    });
  }

  // Update user profile
  async updateProfile(profileData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          this.currentUser = { ...this.currentUser, ...profileData };
          // Update in users array
          const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
          if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
          }
          resolve({ success: true, user: this.currentUser });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  }

  // Add new address
  async addAddress(addressData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          const newAddress = {
            id: Date.now().toString(),
            ...addressData,
            isDefault: this.currentUser.addresses.length === 0
          };
          this.currentUser.addresses.push(newAddress);
          
          // Update in users array
          const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
          if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
          }
          
          resolve({ success: true, address: newAddress });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  }

  // Update address
  async updateAddress(addressId, addressData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          const addressIndex = this.currentUser.addresses.findIndex(a => a.id === addressId);
          if (addressIndex !== -1) {
            this.currentUser.addresses[addressIndex] = { 
              ...this.currentUser.addresses[addressIndex], 
              ...addressData 
            };
            
            // Update in users array
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
              this.users[userIndex] = this.currentUser;
            }
            
            resolve({ success: true, address: this.currentUser.addresses[addressIndex] });
          } else {
            resolve({ success: false, message: 'Address not found' });
          }
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  }

  // Delete address
  async deleteAddress(addressId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          const addressIndex = this.currentUser.addresses.findIndex(a => a.id === addressId);
          if (addressIndex !== -1) {
            this.currentUser.addresses.splice(addressIndex, 1);
            
            // Update in users array
            const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
            if (userIndex !== -1) {
              this.users[userIndex] = this.currentUser;
            }
            
            resolve({ success: true });
          } else {
            resolve({ success: false, message: 'Address not found' });
          }
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 500);
    });
  }

  // Add to favorites
  async toggleFavorite(productId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          const favoriteIndex = this.currentUser.favorites.indexOf(productId);
          if (favoriteIndex === -1) {
            this.currentUser.favorites.push(productId);
          } else {
            this.currentUser.favorites.splice(favoriteIndex, 1);
          }
          
          // Update in users array
          const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
          if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
          }
          
          resolve({ 
            success: true, 
            isFavorite: favoriteIndex === -1,
            favorites: this.currentUser.favorites 
          });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 200);
    });
  }

  // Add order to history
  async addOrderToHistory(orderData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.currentUser) {
          const order = {
            id: orderData.orderId,
            date: new Date().toISOString(),
            total: orderData.total,
            status: 'preparing',
            items: orderData.items,
            address: orderData.address
          };
          
          this.currentUser.orderHistory.unshift(order); // Add to beginning
          
          // Update in users array
          const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
          if (userIndex !== -1) {
            this.users[userIndex] = this.currentUser;
          }
          
          resolve({ success: true, order });
        } else {
          resolve({ success: false, message: 'No user logged in' });
        }
      }, 300);
    });
  }

  // Logout user
  logout() {
    this.currentUser = null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
