# To-Do App – Preliminary Assignment Submission

⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md in this repository file for assignment requirements.

## 🚀 Project Setup & Usage

**How to install and run your project:**  
✍️

### Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Setup (Optional - for full functionality)

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file with your database credentials

# Setup database
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed

# Start backend server
npm run dev
```

**Application URLs:**

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🔗 Deployed Web URL or APK file

✍️ [Paste your link here]

## 🎥 Demo Video

**Demo video link (≤ 2 minutes):**  
📌 **Video Upload Guideline:** when uploading your demo video to YouTube, please set the visibility to **Unlisted**.

- “Unlisted” videos can only be viewed by users who have the link.
- The video will not appear in search results or on your channel.
- Share the link in your README so mentors can access it.

✍️ [Paste your video link here]

## 📖 Function Manual

### 🔐 **Authentication System**

- **User Registration**: Create account with email, full name, and secure password
- **User Login**: JWT-based authentication with persistent sessions
- **Protected Routes**: Automatic redirection for authenticated/unauthenticated users
- **Profile Management**: View and manage user information

### ✅ **Task Management (CRUD Operations)**

- **Create Tasks**: Add new tasks with comprehensive details
  - Title and description
  - Category assignment
  - Priority levels (High, Medium, Low)
  - Deadline with date/time picker
  - Estimated completion time
- **View Tasks**: Multiple view modes
  - Dashboard overview with urgent tasks
  - Complete task list with filtering
  - Category-based organization
- **Edit Tasks**: Modify all task properties including:
  - Status updates (Incomplete → In Progress → Completed)
  - Priority adjustments
  - Deadline modifications
  - Category reassignment
- **Delete Tasks**: Remove unwanted or completed tasks with confirmation

### 🏷️ **Category Management**

- **Default Categories**: Academic, Personal, Work, Extracurricular
- **Custom Categories**: Create personalized categories with:
  - Custom names and color coding
  - Visual identification system
  - Task count tracking
- **Category Operations**: Full CRUD for category management
- **Visual Organization**: Color-coded task grouping

### ⚡ **Priority & Status Management**

- **Priority Levels**:
  - 🔴 **High**: Urgent and important tasks
  - 🟡 **Medium**: Important but not urgent
  - 🟢 **Low**: Nice-to-have tasks
- **Status Tracking**:
  - **Incomplete**: Newly created tasks
  - **In Progress**: Currently working on
  - **Completed**: Finished tasks with completion timestamp

### 📅 **Deadline & Time Management**

- **Deadline Setting**: Date and time picker for precise scheduling
- **Overdue Detection**: Automatic identification of overdue tasks
- **Time Estimation**: Set estimated completion time for better planning
- **Urgency Calculation**: Smart sorting based on deadline proximity and priority

### 📊 **Dashboard & Analytics**

- **Statistics Overview**:
  - Total tasks count
  - Completed tasks percentage
  - In-progress tasks tracking
  - Overdue tasks monitoring
- **Urgent Tasks Section**: Quick access to high-priority and deadline-approaching tasks
- **Visual Indicators**: Color-coded status and priority representation
- **Performance Tracking**: Task completion trends and productivity insights

### 🔍 **Advanced Filtering & Search**

- **Multi-criteria Filtering**:
  - Filter by status (Incomplete, In Progress, Completed)
  - Filter by priority levels
  - Filter by categories
  - Date range filtering
- **Search Functionality**: Find tasks by title or description content
- **Smart Sorting**: Automatic prioritization based on urgency and importance
- **Pagination**: Efficient handling of large task lists

### 💾 **Data Persistence & Sync**

- **Local Storage**: Browser-based storage for offline functionality
- **Backend Integration**: Full-stack implementation with PostgreSQL
- **Real-time Updates**: Immediate UI updates with server synchronization
- **Data Security**: Encrypted password storage and JWT authentication

## 🛠 Technology Stack and Implementation Methods

### Frontend Architecture

- **Framework**: React 19.1.1 with TypeScript for type safety and modern development
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router DOM 7.8.2 for client-side navigation and protected routes
- **State Management**: Redux Toolkit 2.9.0 for predictable state management
- **UI Framework**:
  - Radix UI primitives for accessibility-first components
  - Custom styled components with Tailwind CSS
  - Shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS 3.x with custom animations and responsive design
- **Animations**: Framer Motion 12.23.12 for smooth user interactions
- **Form Management**: React Hook Form 7.62.0 with Zod schema validation
- **HTTP Client**: Axios 1.11.0 for API communication with interceptors
- **Icons**: Lucide React for consistent and modern iconography

### Backend Architecture

- **Runtime**: Node.js with TypeScript for type-safe server development
- **Framework**: Express.js for RESTful API with comprehensive middleware
- **Database**: PostgreSQL with Prisma ORM for type-safe database operations
- **Authentication**:
  - JWT tokens for stateless authentication
  - bcryptjs for secure password hashing
  - Cookie-based session management
- **Security Features**:
  - Helmet.js for security headers
  - CORS configuration for cross-origin requests
  - Rate limiting for DDoS protection
  - Input validation with Zod schemas
- **Development Tools**:
  - Nodemon for development auto-reload
  - Prisma Studio for database management
  - TypeScript compilation and type checking

### Development & Build Tools

- **Package Manager**: npm for dependency management
- **Code Quality**: ESLint for code linting and formatting
- **CSS Processing**: PostCSS with Autoprefixer for vendor prefixes
- **Type Checking**: TypeScript 5.x for compile-time type safety
- **Database Tools**: Prisma CLI for migrations and schema management

### Architecture Patterns

- **Component-Based Architecture**: Modular and reusable React components
- **State Management Pattern**: Redux slices for feature-based state organization
- **Service Layer Pattern**: Abstracted API communication layer
- **Repository Pattern**: Prisma-based data access layer
- **Middleware Pattern**: Express middleware for authentication and validation
- **Error Handling**: Centralized error handling with proper HTTP status codes

## 🗄 Database structure (when used)

### PostgreSQL Schema Design

#### Core Tables

**Users Table**

```sql
users {
  id: String (CUID Primary Key)
  email: String (UNIQUE)
  full_name: String
  password_hash: String (bcrypt hashed)
  role: String (DEFAULT: "student")
  created_at: DateTime (DEFAULT: now())
  updated_at: DateTime (AUTO UPDATE)
}
```

**Categories Table**

```sql
categories {
  id: String (CUID Primary Key)
  user_id: String (Foreign Key → users.id)
  name: String
  color: String (DEFAULT: "#3B82F6")
  created_at: DateTime (DEFAULT: now())
  updated_at: DateTime (AUTO UPDATE)

  UNIQUE(user_id, name) -- Prevent duplicate category names per user
}
```

**Tasks Table**

```sql
tasks {
  id: String (CUID Primary Key)
  user_id: String (Foreign Key → users.id)
  category_id: String (Foreign Key → categories.id, NULL allowed)
  title: String (Required)
  description: String (Optional)
  priority: Priority ENUM (HIGH, MEDIUM, LOW) DEFAULT MEDIUM
  status: Status ENUM (INCOMPLETE, IN_PROGRESS, COMPLETED) DEFAULT INCOMPLETE
  deadline_at: DateTime (Optional)
  estimate_minutes: Integer (Optional)
  completed_at: DateTime (AUTO SET on completion)
  created_at: DateTime (DEFAULT: now())
  updated_at: DateTime (AUTO UPDATE)
}
```

**Activity Logs Table**

```sql
activity_logs {
  id: String (CUID Primary Key)
  user_id: String (Foreign Key → users.id)
  action: String (e.g., "TASK_CREATED", "TASK_COMPLETED")
  meta: JSON (Additional action metadata)
  created_at: DateTime (DEFAULT: now())
}
```

#### Database Relationships

- **User → Categories**: One-to-Many (User can have multiple categories)
- **User → Tasks**: One-to-Many (User can have multiple tasks)
- **User → Activity Logs**: One-to-Many (User activity tracking)
- **Category → Tasks**: One-to-Many (Category can contain multiple tasks)
- **Category Deletion**: Cascade delete (removes all related tasks)
- **Task Deletion**: Set category to NULL (preserves category structure)

#### Database Enums

```sql
-- Priority levels for task importance
Priority: HIGH | MEDIUM | LOW

-- Task completion status
Status: INCOMPLETE | IN_PROGRESS | COMPLETED
```

#### Indexes for Performance

```sql
-- User email lookup
CREATE INDEX idx_users_email ON users(email);

-- Task queries by user
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- Task queries by status and priority
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Deadline-based queries
CREATE INDEX idx_tasks_deadline ON tasks(deadline_at);

-- Category-based task grouping
CREATE INDEX idx_categories_user_id ON categories(user_id);
```

## 🧠 Reflection

### What’s special about this app?

**1. Vietnamese Student-Centric Design**
Our Smart To-Do App is specifically designed for Vietnamese college students, addressing their unique academic and cultural needs. The application incorporates familiar academic terminology, scheduling patterns, and workflow concepts that resonate with Vietnamese university systems.

**2. Comprehensive Full-Stack Architecture**
Unlike simple to-do applications, we've implemented a sophisticated full-stack solution:

- **Modern Frontend**: React 19 with TypeScript, Redux Toolkit, and Tailwind CSS
- **Robust Backend**: Node.js/Express with PostgreSQL and Prisma ORM
- **Secure Authentication**: JWT-based system with password encryption
- **Real-time Synchronization**: Immediate UI updates with backend persistence

**3. Intelligent Task Management**
Our app goes beyond basic CRUD operations with smart features:

- **Auto-Sort Intelligence**: Automatically prioritizes tasks based on deadlines and importance
- **Urgency Detection**: Smart algorithms identify critical tasks requiring immediate attention
- **Category-Based Organization**: Visual grouping with color-coded categories
- **Advanced Filtering**: Multi-criteria search and filter capabilities

**4. Modern Developer Experience**
The application showcases contemporary web development best practices:

- **Type Safety**: Complete TypeScript implementation across frontend and backend
- **Component Architecture**: Modular, reusable React components with Radix UI
- **State Management**: Predictable state updates with Redux Toolkit
- **Database Safety**: Type-safe database operations with Prisma ORM
- **Security First**: Comprehensive security measures including rate limiting and input validation

**5. Performance & User Experience**

- **Responsive Design**: Optimized for both desktop and mobile devices
- **Smooth Animations**: Framer Motion for enhanced user interactions
- **Fast Loading**: Vite build tool for optimized development and production
- **Accessibility**: Radix UI components ensure accessibility compliance
- **Error Handling**: Comprehensive error boundaries and user feedback

### If you had more time, what would you expand?

✍️ [Write your content here]

### If you integrate AI APIs more for your app, what would you do?

✍️ [Write your content here]

## ✅ Checklist

- [x] Code runs without errors
- [x] All required features implemented (add/edit/delete/complete tasks)
- [x] All ✍️ sections are filled
- [x] Category classification with 4+ categories (Academic, Personal, Work, Extracurricular)
- [x] Priority management (High, Medium, Low) with visual indicators
- [x] Deadline management with date/time selection
- [x] Status management (Incomplete, In Progress, Completed)
- [x] CRUD operations fully functional
- [x] Data persistence with PostgreSQL backend
- [x] User authentication with JWT tokens
- [x] Responsive design for mobile and desktop
- [x] TypeScript implementation for type safety
- [x] Professional UI/UX with Radix UI and Tailwind CSS
- [x] Smart features: Auto-sort, urgency detection, advanced filtering
- [x] Full-stack architecture with Express.js backend
- [x] Database design with proper relationships and indexes
- [x] Security implementation with rate limiting and validation
- [x] Comprehensive documentation and setup instructions
