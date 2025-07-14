const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { encrypt, decrypt, maskSensitiveData } = require('../utils/encryption');
const { ApiError } = require('../middlewares/errorHandler');
const s3Utils = require('../utils/s3Utils');
const fileStorage = require('../utils/fileStorage');

/**
 * Service class for user operations
 */
class UserService {
  /**
   * Generate a unique customer ID
   * @param {string} userType - CUSTOMER or MERCHANT
   * @returns {string} - Generated customer ID
   */
  async generateCustomerId(userType = 'CUSTOMER') {
    let prefix = userType === 'MERCHANT' ? 'MER' : 'CUS';
    let isUnique = false;
    let customerId;
    
    while (!isUnique) {
      // Generate random 6-10 digit number
      const randomNum = Math.floor(100000 + Math.random() * 9000000);
      customerId = `${prefix}${randomNum}`;
      
      // Check if already exists
      const existingUser = await prisma.user.findUnique({
        where: { customerId }
      });
      
      isUnique = !existingUser;
    }
    
    return customerId;
  }
  
  /**
   * Create a new user
   * @param {Object} userData - User data including personal information
   * @returns {Object} - Created user object
   */
  async createUser(userData) {
    try {
      // Generate customer ID
      const customerId = await this.generateCustomerId(userData.userType);
      
      // Create base user
      const user = await prisma.user.create({
        data: {
          customerId,
          mobile: userData.mobile,
          email: userData.email,
          name: userData.name,
          userType: userData.userType || 'CUSTOMER',
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          gender: userData.gender,
          nationality: userData.nationality,
        }
      });
      
      // Create wallet for user
      await prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
          currency: 'INR'
        }
      });
      
      // Create user preferences
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          preferredLanguage: userData.preferredLanguage || 'en'
        }
      });
      
      // Create KYC record
      await prisma.kycDetails.create({
        data: {
          userId: user.id,
          kycStatus: 'PENDING'
        }
      });
      
      // Process addresses if provided
      if (userData.addresses && userData.addresses.length > 0) {
        const addressPromises = userData.addresses.map(address => {
          return prisma.address.create({
            data: {
              userId: user.id,
              addressType: address.addressType,
              addressLine1: address.addressLine1,
              addressLine2: address.addressLine2,
              city: address.city,
              state: address.state,
              postalCode: address.postalCode,
              country: address.country,
              isDefault: address.isDefault || false,
              latitude: address.latitude,
              longitude: address.longitude,
              locationName: address.locationName
            }
          });
        });
        
        await Promise.all(addressPromises);
      }
      
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Update user information
   * @param {string} userId - User ID
   * @param {Object} userData - User data to update
   * @returns {Object} - Updated user object
   */
  async updateUser(userId, userData) {
    try {
      // Update base user information
      const updateData = {};
      
      // Only update fields that are provided
      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.email !== undefined) updateData.email = userData.email;
      if (userData.dateOfBirth !== undefined) updateData.dateOfBirth = new Date(userData.dateOfBirth);
      if (userData.gender !== undefined) updateData.gender = userData.gender;
      if (userData.nationality !== undefined) updateData.nationality = userData.nationality;
      
      // Only perform update if there are fields to update
      if (Object.keys(updateData).length > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: updateData
        });
      }
      
      // Process addresses if provided
      if (userData.addresses && userData.addresses.length > 0) {
        const addressPromises = userData.addresses.map(address => {
          const addressData = {
            addressType: address.addressType,
            addressLine1: address.addressLine1,
            addressLine2: address.addressLine2,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            isDefault: address.isDefault || false,
            latitude: address.latitude,
            longitude: address.longitude,
            locationName: address.locationName
          };
          
          // Update existing address or create new one
          if (address.id) {
            return prisma.address.update({
              where: { id: address.id },
              data: addressData
            });
          } else {
            return prisma.address.create({
              data: {
                ...addressData,
                userId
              }
            });
          }
        });
        
        await Promise.all(addressPromises);
      }
      
      // Update user preferences if provided
      if (userData.preferences) {
        await prisma.userPreferences.update({
          where: { userId },
          data: {
            preferredLanguage: userData.preferences.preferredLanguage,
            notificationEnabled: userData.preferences.notificationEnabled,
            emailNotifications: userData.preferences.emailNotifications,
            smsNotifications: userData.preferences.smsNotifications,
            pushNotifications: userData.preferences.pushNotifications
          }
        });
      }
      
      // Get updated user
      return this.getUserById(userId);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  
  /**
   * Get user by ID with all related information
   * @param {string} userId - User ID
   * @returns {Object} - User object with related information
   */
  async getUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          addresses: true,
          userPreferences: true,
          kycDetails: true,
          wallet: true,
          vpa: true,
          bankAccounts: {
            select: {
              id: true,
              bankName: true,
              ifscCode: true,
              accountHolderName: true,
              accountNumber: true, // Will be processed later
              isVerified: true,
              isPrimary: true,
              createdAt: true,
              updatedAt: true
            }
          },
          cards: {
            select: {
              id: true,
              cardType: true,
              bankName: true,
              nameOnCard: true,
              cardNumber: true, // Will be processed later
              expiryMonth: true,
              expiryYear: true,
              isVerified: true,
              isPrimary: true,
              createdAt: true,
              updatedAt: true
            }
          },
          documents: {
            select: {
              id: true,
              documentType: true,
              documentNumber: true, // Will be processed later
              documentUrl: true,
              isVerified: true,
              uploadedAt: true,
              verifiedAt: true
            }
          }
        }
      });
      
      if (!user) {
        throw ApiError.notFound('User not found');
      }
      
      // Process encrypted/sensitive fields
      if (user.bankAccounts) {
        user.bankAccounts = user.bankAccounts.map(account => ({
          ...account,
          accountNumber: maskSensitiveData(decrypt(account.accountNumber) || account.accountNumber)
        }));
      }
      
      if (user.cards) {
        user.cards = user.cards.map(card => ({
          ...card,
          cardNumber: maskSensitiveData(decrypt(card.cardNumber) || card.cardNumber)
        }));
      }
      
      if (user.documents) {
        user.documents = user.documents.map(doc => ({
          ...doc,
          documentNumber: doc.documentNumber ? maskSensitiveData(decrypt(doc.documentNumber)) : null
        }));
      }
      
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }
  
  /**
   * Get user by mobile number
   * @param {string} mobile - Mobile number
   * @returns {Object} - User object
   */
  async getUserByMobile(mobile) {
    return this.getUserByField('mobile', mobile);
  }
  
  /**
   * Get user by customer ID
   * @param {string} customerId - Customer ID
   * @returns {Object} - User object
   */
  async getUserByCustomerId(customerId) {
    return this.getUserByField('customerId', customerId);
  }
  
  /**
   * Get user by field
   * @param {string} field - Field to search by
   * @param {string} value - Value to search for
   * @returns {Object} - User object
   */
  async getUserByField(field, value) {
    try {
      const user = await prisma.user.findUnique({
        where: { [field]: value },
        include: {
          addresses: true,
          userPreferences: true,
          kycDetails: true,
          wallet: true,
          vpa: true,
          bankAccounts: {
            select: {
              id: true,
              bankName: true,
              ifscCode: true,
              accountHolderName: true,
              accountNumber: true, // Will be processed later
              isVerified: true,
              isPrimary: true,
              createdAt: true,
              updatedAt: true
            }
          },
          cards: {
            select: {
              id: true,
              cardType: true,
              bankName: true,
              nameOnCard: true,
              cardNumber: true, // Will be processed later
              expiryMonth: true,
              expiryYear: true,
              isVerified: true,
              isPrimary: true,
              createdAt: true,
              updatedAt: true
            }
          },
          documents: {
            select: {
              id: true,
              documentType: true,
              documentNumber: true, // Will be processed later
              documentUrl: true,
              isVerified: true,
              uploadedAt: true,
              verifiedAt: true
            }
          }
        }
      });
      
      if (!user) {
        throw ApiError.notFound('User not found');
      }
      
      // Process encrypted/sensitive fields
      if (user.bankAccounts) {
        user.bankAccounts = user.bankAccounts.map(account => ({
          ...account,
          accountNumber: maskSensitiveData(decrypt(account.accountNumber) || account.accountNumber)
        }));
      }
      
      if (user.cards) {
        user.cards = user.cards.map(card => ({
          ...card,
          cardNumber: maskSensitiveData(decrypt(card.cardNumber) || card.cardNumber)
        }));
      }
      
      if (user.documents) {
        user.documents = user.documents.map(doc => ({
          ...doc,
          documentNumber: doc.documentNumber ? maskSensitiveData(decrypt(doc.documentNumber)) : null
        }));
      }
      
      return user;
    } catch (error) {
      console.error(`Error fetching user by ${field}:`, error);
      throw error;
    }
  }
  
  /**
   * Add bank account for user
   * @param {string} userId - User ID
   * @param {Object} accountData - Bank account data
   * @returns {Object} - Created bank account
   */
  async addBankAccount(userId, accountData) {
    try {
      // Encrypt sensitive data
      const encryptedAccountNumber = encrypt(accountData.accountNumber);
      
      // Check if already exists
      const existingAccount = await prisma.bankAccount.findFirst({
        where: {
          userId,
          accountNumber: encryptedAccountNumber
        }
      });
      
      if (existingAccount) {
        throw ApiError.badRequest('Bank account already exists');
      }
      
      // If this is the first account, make it primary
      const accountCount = await prisma.bankAccount.count({
        where: { userId }
      });
      
      const isPrimary = accountCount === 0 || accountData.isPrimary === true;
      
      // If making this account primary, unset any existing primary accounts
      if (isPrimary) {
        await prisma.bankAccount.updateMany({
          where: {
            userId,
            isPrimary: true
          },
          data: {
            isPrimary: false
          }
        });
      }
      
      // Create bank account
      const bankAccount = await prisma.bankAccount.create({
        data: {
          userId,
          accountNumber: encryptedAccountNumber,
          ifscCode: accountData.ifscCode,
          bankName: accountData.bankName,
          accountHolderName: accountData.accountHolderName,
          isPrimary,
          isVerified: false
        }
      });
      
      // Mask account number for response
      return {
        ...bankAccount,
        accountNumber: maskSensitiveData(accountData.accountNumber)
      };
    } catch (error) {
      console.error('Error adding bank account:', error);
      throw error;
    }
  }
  
  /**
   * Add virtual payment address (VPA) for user
   * @param {string} userId - User ID
   * @param {Object} vpaData - VPA data
   * @returns {Object} - Created VPA
   */
  async addVpa(userId, vpaData) {
    try {
      // Check if already exists
      const existingVpa = await prisma.virtualPaymentAddress.findUnique({
        where: { vpa: vpaData.vpa }
      });
      
      if (existingVpa) {
        throw ApiError.badRequest('VPA already exists');
      }
      
      // If this is the first VPA, make it primary
      const vpaCount = await prisma.virtualPaymentAddress.count({
        where: { userId }
      });
      
      const isPrimary = vpaCount === 0 || vpaData.isPrimary === true;
      
      // If making this VPA primary, unset any existing primary VPAs
      if (isPrimary) {
        await prisma.virtualPaymentAddress.updateMany({
          where: {
            userId,
            isPrimary: true
          },
          data: {
            isPrimary: false
          }
        });
      }
      
      // Create VPA
      return await prisma.virtualPaymentAddress.create({
        data: {
          userId,
          vpa: vpaData.vpa,
          bankAccountId: vpaData.bankAccountId,
          isPrimary,
          isVerified: false
        }
      });
    } catch (error) {
      console.error('Error adding VPA:', error);
      throw error;
    }
  }
  
  /**
   * Add card for user
   * @param {string} userId - User ID
   * @param {Object} cardData - Card data
   * @returns {Object} - Created card
   */
  async addCard(userId, cardData) {
    try {
      // Encrypt sensitive data
      const encryptedCardNumber = encrypt(cardData.cardNumber);
      
      // If this is the first card, make it primary
      const cardCount = await prisma.card.count({
        where: { userId }
      });
      
      const isPrimary = cardCount === 0 || cardData.isPrimary === true;
      
      // If making this card primary, unset any existing primary cards
      if (isPrimary) {
        await prisma.card.updateMany({
          where: {
            userId,
            isPrimary: true
          },
          data: {
            isPrimary: false
          }
        });
      }
      
      // Create card
      const card = await prisma.card.create({
        data: {
          userId,
          cardType: cardData.cardType,
          cardNumber: encryptedCardNumber,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          nameOnCard: cardData.nameOnCard,
          bankName: cardData.bankName,
          isPrimary,
          isVerified: false
        }
      });
      
      // Mask card number for response
      return {
        ...card,
        cardNumber: maskSensitiveData(cardData.cardNumber)
      };
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  }
  
  /**
   * Upload document for user
   * @param {string} userId - User ID
   * @param {Object} documentData - Document data
   * @returns {Object} - Document info
   */
  async uploadDocument(userId, documentData) {
    try {
      // Prepare for file upload
      const fileInfo = await fileStorage.prepareFileUpload(
        userId,
        documentData.documentType,
        documentData.originalFilename
      );
      
      // Encrypt document number if provided
      const encryptedDocumentNumber = documentData.documentNumber 
        ? encrypt(documentData.documentNumber) 
        : null;
      
      // Create or update document record
      const document = await prisma.userDocument.upsert({
        where: {
          userId_documentType: {
            userId,
            documentType: documentData.documentType
          }
        },
        update: {
          documentNumber: encryptedDocumentNumber,
          documentUrl: fileInfo.relativePath,
          isVerified: false,
          uploadedAt: new Date()
        },
        create: {
          userId,
          documentType: documentData.documentType,
          documentNumber: encryptedDocumentNumber,
          documentUrl: fileInfo.relativePath,
          isVerified: false
        }
      });
      
      // Mask document number for response
      return {
        document: {
          ...document,
          documentNumber: documentData.documentNumber 
            ? maskSensitiveData(documentData.documentNumber) 
            : null
        },
        filePath: fileInfo.filePath
      };
    } catch (error) {
      console.error('Error handling document upload:', error);
      throw error;
    }
  }
  
  /**
   * Get users for admin panel with pagination
   * @param {Object} options - Pagination and filter options
   * @returns {Object} - List of users and pagination info
   */
  async getUsers(options = {}) {
    try {
      const { page = 1, limit = 10, search, userType, kycStatus } = options;
      const skip = (page - 1) * limit;
      
      // Build where conditions
      const where = {};
      
      if (search) {
        where.OR = [
          { mobile: { contains: search } },
          { email: { contains: search } },
          { name: { contains: search } },
          { customerId: { contains: search } }
        ];
      }
      
      if (userType) {
        where.userType = userType;
      }
      
      if (kycStatus) {
        where.kycDetails = {
          kycStatus
        };
      }
      
      // Count total users matching criteria
      const totalUsers = await prisma.user.count({ where });
      
      // Get users with related info
      const users = await prisma.user.findMany({
        where,
        include: {
          kycDetails: true,
          wallet: true,
          userPreferences: true,
          addresses: {
            where: { isDefault: true }
          }
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      });
      
      return {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit)
        }
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }
  
  /**
   * Get spending analytics for a user
   * @param {string} userId - User ID
   * @param {Object} options - Filter options
   * @returns {Object} - Spending analytics data
   */
  async getSpendingAnalytics(userId, options = {}) {
    try {
      const { 
        period = 'month', // 'day', 'week', 'month', 'year'
        startDate = new Date(new Date().setDate(new Date().getDate() - 30)), // Default: last 30 days
        endDate = new Date(),
        groupBy = 'category' // 'category', 'day', 'week', 'month'
      } = options;
      
      // Calculate appropriate date ranges based on period
      let dateRange = {};
      
      if (period === 'day') {
        // Today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dateRange = {
          gte: today,
          lte: new Date()
        };
      } else if (period === 'week') {
        // Current week (last 7 days)
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - 7);
        dateRange = {
          gte: weekStart,
          lte: new Date()
        };
      } else if (period === 'month') {
        // Current month (last 30 days)
        const monthStart = new Date();
        monthStart.setDate(monthStart.getDate() - 30);
        dateRange = {
          gte: monthStart,
          lte: new Date()
        };
      } else if (period === 'year') {
        // Current year (last 365 days)
        const yearStart = new Date();
        yearStart.setDate(yearStart.getDate() - 365);
        dateRange = {
          gte: yearStart,
          lte: new Date()
        };
      } else {
        // Custom date range
        dateRange = {
          gte: startDate,
          lte: endDate
        };
      }
      
      // Fetch transactions for the period
      const transactions = await prisma.transaction.findMany({
        where: {
          userId,
          transactionDate: dateRange,
          status: 'SUCCESS',
          transactionType: 'DEBIT' // Only outgoing payments for spending analytics
        },
        orderBy: {
          transactionDate: 'asc'
        }
      });
      
      // Process transactions for analytics
      const totalSpending = transactions.reduce((total, tx) => total + Number(tx.amount), 0);
      
      // Group transactions by category
      const categorySpending = transactions.reduce((acc, tx) => {
        const category = tx.category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = {
            totalAmount: 0,
            count: 0,
            transactions: []
          };
        }
        acc[category].totalAmount += Number(tx.amount);
        acc[category].count += 1;
        acc[category].transactions.push(tx);
        return acc;
      }, {});
      
      // Calculate category percentages
      Object.keys(categorySpending).forEach(category => {
        categorySpending[category].percentage = totalSpending > 0
          ? (categorySpending[category].totalAmount / totalSpending) * 100
          : 0;
      });
      
      // Get time-series data based on groupBy parameter
      let timeSeriesData = [];
      
      if (groupBy === 'day') {
        // Group by day
        const dailySpending = transactions.reduce((acc, tx) => {
          const txDate = new Date(tx.transactionDate);
          const dateString = txDate.toISOString().split('T')[0]; // YYYY-MM-DD
          
          if (!acc[dateString]) {
            acc[dateString] = {
              date: dateString,
              totalAmount: 0,
              count: 0
            };
          }
          
          acc[dateString].totalAmount += Number(tx.amount);
          acc[dateString].count += 1;
          return acc;
        }, {});
        
        timeSeriesData = Object.values(dailySpending);
      } else if (groupBy === 'week') {
        // Group by week
        const weeklySpending = transactions.reduce((acc, tx) => {
          const txDate = new Date(tx.transactionDate);
          const year = txDate.getFullYear();
          const weekNumber = getWeekNumber(txDate);
          const weekKey = `${year}-W${weekNumber}`;
          
          if (!acc[weekKey]) {
            acc[weekKey] = {
              week: weekKey,
              totalAmount: 0,
              count: 0
            };
          }
          
          acc[weekKey].totalAmount += Number(tx.amount);
          acc[weekKey].count += 1;
          return acc;
        }, {});
        
        timeSeriesData = Object.values(weeklySpending);
      } else if (groupBy === 'month') {
        // Group by month
        const monthlySpending = transactions.reduce((acc, tx) => {
          const txDate = new Date(tx.transactionDate);
          const year = txDate.getFullYear();
          const month = txDate.getMonth() + 1;
          const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
          
          if (!acc[monthKey]) {
            acc[monthKey] = {
              month: monthKey,
              totalAmount: 0,
              count: 0
            };
          }
          
          acc[monthKey].totalAmount += Number(tx.amount);
          acc[monthKey].count += 1;
          return acc;
        }, {});
        
        timeSeriesData = Object.values(monthlySpending);
      }
      
      // Calculate comparison metrics
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(lastWeekStart.getDate() - 14);
      lastWeekStart.setHours(0, 0, 0, 0);
      
      const lastWeekEnd = new Date(today);
      lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
      lastWeekEnd.setHours(23, 59, 59, 999);
      
      const lastMonthStart = new Date(today);
      lastMonthStart.setDate(lastMonthStart.getDate() - 60);
      lastMonthStart.setHours(0, 0, 0, 0);
      
      const lastMonthEnd = new Date(today);
      lastMonthEnd.setDate(lastMonthEnd.getDate() - 30);
      lastMonthEnd.setHours(23, 59, 59, 999);
      
      // Today's spending
      const todaySpending = transactions
        .filter(tx => new Date(tx.transactionDate) >= today)
        .reduce((total, tx) => total + Number(tx.amount), 0);
      
      // Yesterday's spending
      const yesterdaySpending = transactions
        .filter(tx => {
          const txDate = new Date(tx.transactionDate);
          return txDate >= yesterday && txDate < today;
        })
        .reduce((total, tx) => total + Number(tx.amount), 0);
      
      // This week's spending (last 7 days)
      const thisWeekSpending = transactions
        .filter(tx => {
          const txDate = new Date(tx.transactionDate);
          return txDate >= lastWeekEnd;
        })
        .reduce((total, tx) => total + Number(tx.amount), 0);
      
      // Last week's spending (7-14 days ago)
      const lastWeekSpending = transactions
        .filter(tx => {
          const txDate = new Date(tx.transactionDate);
          return txDate >= lastWeekStart && txDate < lastWeekEnd;
        })
        .reduce((total, tx) => total + Number(tx.amount), 0);
      
      // This month's spending (last 30 days)
      const thisMonthSpending = transactions
        .filter(tx => {
          const txDate = new Date(tx.transactionDate);
          return txDate >= lastMonthEnd;
        })
        .reduce((total, tx) => total + Number(tx.amount), 0);
      
      // Last month's spending (30-60 days ago)
      const lastMonthSpending = transactions
        .filter(tx => {
          const txDate = new Date(tx.transactionDate);
          return txDate >= lastMonthStart && txDate < lastMonthEnd;
        })
        .reduce((total, tx) => total + Number(tx.amount), 0);
      
      // Calculate differences and percentages
      const dayDifference = todaySpending - yesterdaySpending;
      const dayPercentage = yesterdaySpending !== 0 
        ? (dayDifference / yesterdaySpending) * 100 
        : (todaySpending > 0 ? 100 : 0);
      
      const weekDifference = thisWeekSpending - lastWeekSpending;
      const weekPercentage = lastWeekSpending !== 0 
        ? (weekDifference / lastWeekSpending) * 100 
        : (thisWeekSpending > 0 ? 100 : 0);
      
      const monthDifference = thisMonthSpending - lastMonthSpending;
      const monthPercentage = lastMonthSpending !== 0 
        ? (monthDifference / lastMonthSpending) * 100 
        : (thisMonthSpending > 0 ? 100 : 0);
      
      // Return analytics data
      return {
        overview: {
          totalSpending,
          totalTransactions: transactions.length,
          period,
          startDate: dateRange.gte,
          endDate: dateRange.lte
        },
        comparison: {
          daily: {
            today: todaySpending,
            yesterday: yesterdaySpending,
            difference: dayDifference,
            percentageChange: dayPercentage,
            trend: dayDifference >= 0 ? 'up' : 'down'
          },
          weekly: {
            thisWeek: thisWeekSpending,
            lastWeek: lastWeekSpending,
            difference: weekDifference,
            percentageChange: weekPercentage,
            trend: weekDifference >= 0 ? 'up' : 'down'
          },
          monthly: {
            thisMonth: thisMonthSpending,
            lastMonth: lastMonthSpending,
            difference: monthDifference,
            percentageChange: monthPercentage,
            trend: monthDifference >= 0 ? 'up' : 'down'
          }
        },
        categories: categorySpending,
        timeSeries: timeSeriesData,
        recentTransactions: transactions.slice(0, 10) // Last 10 transactions
      };
    } catch (error) {
      console.error('Error fetching spending analytics:', error);
      throw error;
    }
  }
}

/**
 * Helper function to get week number for a date
 * @param {Date} date - Date to get week number for
 * @returns {number} - Week number
 */
function getWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

module.exports = new UserService(); 