# 🌐 Daily Brief Portal - Quick Start

## ⚡ Quick Run

```bash
npm start
```

Access at: **http://localhost:3000**

## 📋 First-Time Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Build for Production
```bash
npm run build
```

## 🎯 Features

### **File Upload System**
- Drag-and-drop file uploads
- Support for CSV, Excel, JSON
- Real-time progress tracking
- File validation

### **Manual Input Forms**
- Call Center escalations
- Logistics issues
- Brewery discussion points
- Payment exceptions
- General notes
- Auto-save functionality

### **Report Generation**
- One-click report generation
- Real-time progress indicators
- Download generated reports
- Email distribution (when configured)

### **Dashboard**
- Live metrics visualization
- Recent activity tracking
- Quick actions
- Status monitoring

## 🛠️ Tech Stack

- React 19
- TypeScript
- Material-UI v7
- Create-React-App
- Axios (API calls)
- React Dropzone (File uploads)
- React Router (Navigation)

## 🔗 API Integration

**Backend API:** http://localhost:3001

Update API URL in `src/services/api.ts` if needed:
```typescript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 📝 Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from CRA (not recommended)

## 📊 Pages

1. **Dashboard** - `/` - Overview and quick actions
2. **File Upload** - `/upload` - Upload data files
3. **Manual Inputs** - `/inputs` - Enter stakeholder inputs
4. **Report Generation** - `/generate` - Generate and download reports
5. **Settings** - `/settings` - Configuration

## ✅ Success Check

After setup, verify:
- [ ] Portal loads on port 3000
- [ ] File upload works
- [ ] Manual input forms save data
- [ ] Can generate reports
- [ ] Dashboard shows metrics
- [ ] Navigation between pages works

---

**Built with:** React + Material-UI + TypeScript
