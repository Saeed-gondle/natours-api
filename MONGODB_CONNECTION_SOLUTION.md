# 🔧 MongoDB Atlas Connection Error - Complete Solution Guide

## 📋 **Problem Summary**

- **Error**: `querySrv ETIMEOUT _mongodb._tcp.todoappcluster.og5nj0c.mongodb.net`
- **Symptom**: MongoDB Compass connects successfully, but Node.js application fails
- **Root Cause**: Node.js DNS resolution issue with MongoDB Atlas SRV records

---

## 🚨 **Initial Error Messages**

```
Error: querySrv ETIMEOUT _mongodb._tcp.todoappcluster.og5nj0c.mongodb.net
UNHANDLED REJECTION! 💥 Shutting down...
TypeError: Cannot read properties of undefined (reading 'close')
```

---

## ✅ **Complete Solution Steps**

### **Step 1: Diagnose the Real Problem**

**Commands Used:**

```bash
# Check if cluster exists
nslookup todoappcluster.og5nj0c.mongodb.net

# Test with Google DNS
nslookup todoappcluster.og5nj0c.mongodb.net 8.8.8.8
```

**Findings:**

- ✅ Cluster exists and is accessible
- ✅ MongoDB Compass connects successfully
- ❌ Node.js specific DNS resolution issue

---

### **Step 2: Fix DNS Resolution in Node.js**

**Problem:** Node.js couldn't resolve MongoDB Atlas SRV records using system DNS

**Solution:** Force Node.js to use Google's public DNS servers

**Code Added to `server.js`:**

```javascript
import dns from 'dns';

// Set DNS to use Google's public DNS to resolve MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);
```

**Why This Works:**

- Bypasses local DNS configuration issues
- Uses reliable Google DNS servers
- Specifically resolves SRV record resolution problems

---

### **Step 3: Fix Incomplete Connection String**

**Problem:** Connection string in `config.env` was incomplete

**Before (Broken):**

```env
CONNECTION_STR=mongodb+srv://Saeedjt:Saeedjt56@todoappcluster.og5nj0c.mongodb.net/
```

**After (Fixed):**

```env
CONNECTION_STR=mongodb+srv://Saeedjt:Saeedjt56@todoappcluster.og5nj0c.mongodb.net/natours-api-v1?retryWrites=true&w=majority&appName=TodoAppCluster
```

**Key Components Added:**

- Database name: `natours-api-v1`
- Retry writes: `retryWrites=true`
- Write concern: `w=majority`
- App name: `appName=TodoAppCluster`

---

### **Step 4: Update Mongoose Connection Options**

**Problem:** Basic connection options weren't optimized for Atlas

**Solution:** Enhanced connection configuration

**Code:**

```javascript
const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15000, // Increased from default
  socketTimeoutMS: 45000,
};
```

**Removed Deprecated Options:**

```javascript
// These are no longer needed in Mongoose 6+
// bufferMaxEntries: 0,
// useNewUrlParser: true,
// useUnifiedTopology: true,
```

---

### **Step 5: Fix Server Startup Logic**

**Problem:** Server was trying to start before database connection was established

**Before (Broken Structure):**

```javascript
mongoose.connect(DB).then(() => console.log('Connected'));
const server = app.listen(port, () => console.log('Server started'));
```

**After (Fixed Structure):**

```javascript
const connectDB = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.CONNECTION_STR, clientOptions);

    // Test the connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas!');

    // Start server ONLY after successful DB connection
    server = app.listen(port, () => {
      console.log(`🚀 App running on port ${port}...`);
    });
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    process.exit(1);
  }
};

// Start the application
connectDB();
```

---

### **Step 6: Improve Error Handling**

**Problem:** Server crash when connection failed before server was defined

**Solution:** Enhanced error handling with null checks

**Code:**

```javascript
process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
```

---

### **Step 7: Port Configuration**

**Problem:** Port conflicts when testing

**Solution:**

```env
PORT=3000  # Set to desired port
```

**Commands to kill conflicting processes:**

```bash
taskkill /f /im node.exe  # Windows
# or
pkill node  # Linux/Mac
```

---

## 📄 **Complete Fixed Files**

### **server.js (Final Version):**

```javascript
import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';

// Set DNS to use Google's public DNS to resolve MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

let server;

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 3000;

// MongoDB connection configuration for Atlas
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log(
      '🌐 Using connection string:',
      process.env.CONNECTION_STR.replace(/:[^:@]*@/, ':****@')
    );

    const clientOptions = {
      serverApi: { version: '1', strict: true, deprecationErrors: true },
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };

    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.CONNECTION_STR, clientOptions);

    // Test the connection
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('🏓 Database ping successful!');
    console.log('📊 Connected to database:', mongoose.connection.name);

    // Start the server after successful DB connection
    server = app.listen(port, () => {
      console.log(`🚀 App running on port ${port}...`);
      console.log(`📖 API Documentation: http://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:');
    console.error(`   ${error.message}`);
    console.error('\n🚨 Connection Details:');
    console.error(`   Error Type: ${error.name}`);
    console.error(`   Error Code: ${error.code || 'N/A'}`);

    process.exit(1);
  }
};

// Start the application
connectDB();

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
```

### **config.env (Fixed):**

```env
NODE_ENV=development
PORT=3000
CONNECTION_STR=mongodb+srv://Saeedjt:Saeedjt56@todoappcluster.og5nj0c.mongodb.net/natours-api-v1?retryWrites=true&w=majority&appName=TodoAppCluster
PASSWORD=Saeedjt56
JWT_SECRET=my-ultra-secure-secret-key-jwt
JWT_EXPIRES_IN=90d
EMAIL_HOST=mail.huntingflex.com
EMAIL_PORT=465
EMAIL_USER=no-reply@huntingflex.com
EMAIL_PASSWORD='T#%HGB+JZYEW'
EMAIL_FROM='GearByte Security <no-reply@huntingflex.com>'
```

---

## 🧪 **Testing the Solution**

### **Verification Commands:**

```bash
# 1. Start the server
node server.js

# 2. Test the API
curl http://localhost:3000/

# 3. Check specific endpoints
curl http://localhost:3000/api/v1/tours
```

### **Expected Output:**

```
🔄 Connecting to MongoDB Atlas...
🌐 Using connection string: mongodb+srv://Saeedjt:****@todoappcluster...
✅ Successfully connected to MongoDB Atlas!
🏓 Database ping successful!
📊 Connected to database: natours-api-v1
🚀 App running on port 3000...
📖 API Documentation: http://localhost:3000
```

---

## 🔍 **Troubleshooting Guide**

### **If DNS Fix Doesn't Work:**

1. **Check firewall settings**
2. **Try different DNS servers:**
   ```javascript
   dns.setServers(['1.1.1.1', '1.0.0.1']); // Cloudflare DNS
   ```
3. **Use mobile hotspot** to test network isolation

### **If Connection String Issues Persist:**

1. **Regenerate connection string** from MongoDB Atlas
2. **Check cluster status** in Atlas dashboard
3. **Verify IP whitelist** includes `0.0.0.0/0`

### **If Port Conflicts:**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /f /PID [PID_NUMBER]

# Linux/Mac
lsof -ti:3000 | xargs kill
```

---

## 🎯 **Key Learnings**

1. **MongoDB Compass vs Node.js**: Different applications can have different DNS resolution behaviors
2. **SRV Records**: MongoDB Atlas uses SRV records which can be problematic with some DNS configurations
3. **Connection Timing**: Always connect to database before starting the server
4. **Error Handling**: Proper async/await error handling is crucial for debugging

---

## ✅ **Success Indicators**

- ✅ No `querySrv ETIMEOUT` errors
- ✅ Server starts successfully
- ✅ Database connection established
- ✅ API endpoints respond correctly
- ✅ MongoDB Atlas dashboard shows active connections

---

## 📞 **Support Resources**

- **MongoDB Atlas Documentation**: https://docs.atlas.mongodb.com/
- **Mongoose Documentation**: https://mongoosejs.com/docs/
- **Node.js DNS Module**: https://nodejs.org/api/dns.html

---

**Solution Created:** January 21, 2025  
**Status:** ✅ **RESOLVED**  
**Tested:** ✅ **VERIFIED WORKING**
