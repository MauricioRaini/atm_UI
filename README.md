---

# **ATM_UI** 

An **interactive ATM web application** that supports **multi-user** flows, deposits, withdrawals, PIN entry, and more. Built in **React** (TypeScript) with **Zustand** for state management and a **mock Node service** for data. This codebase was approached with **TDD** (Given/When/Then) for logic and **Storybook** for visual iteration. It can be run via **Docker** or locally (Vite). The system is **100% responsive** and can scale toward a production scenario with minimal changes.

**PLEASE READ THE USER CREDENTIAL SECTION FOR KNOWING WHAT CREDENTIALS (PIN) TO USE!!!**

---

## **Table of Contents**

1. [Product Concept & Perspective](#product-concept--perspective)
2. [System Design & Architecture](#system-design--architecture)
3. [Installation & Running the Project](#installation--running-the-project)
   - [Docker Approach](#docker-approach)
   - [Local Development (npm & Vite)](#local-development-npm--vite)
   - [Running Storybook](#running-storybook)
   - [Project Requirements](#project-requirements)
   - [User Credentials & Multi-User Flow](#user-credentials--multi-user-flow)
4. [Public Deployment on Vercel](#public-deployment-on-vercel)
5. [Main Overview of Components & Design Patterns](#main-overview-of-components--design-patterns)
   - [Test-Driven Development (Given/When/Then)](#test-driven-development-givenwhenthen)
6. [How to Collaborate & Best Practices](#how-to-collaborate--best-practices)
7. [Responsive Design](#responsive-design)
8. [What’s Next? Roadmap & Future Plans](#whats-next-roadmap--future-plans)

---

## **Product Concept & Perspective**

This **ATM** project simulates a real-world machine flow:

- **Multi-User PIN Auth**: Users input their **cardNumber** and **PIN** (mock multi-user DB).  
- **Balance Check**: Displays the user’s account balance in real-time.  
- **Withdrawal**: Subtracts requested amount, updates daily usage, and simulates the ATM’s own “machineBalance.”  
- **Deposit**: Can deposit **into other users’ accounts** by specifying their 6-digit cardNumber.  
- **Retro UI**: Styled with Tailwind + custom components (on-screen numeric keypad, brand logos, dynamic labels).  

**Key Emphasis**:

- **Production-Ready Mindset**: Although we use a mock DB, it’s structured for easy extension (a real Node/Express server, DB, etc.).  
- **Multi-User**: Each user has unique daily limits, balances, usage. We highlight deposit from one user to another.  
- **TDD & Storybook**: We built logic tests (Jest) with “Given/When/Then” scenarios, plus visual iteration in Storybook.  
- **Potential AI/Voice** expansions for an enterprise environment (see future plans).

---

## **System Design & Architecture**

Here’s an **overview** of how we might structure a production-level system:

![ATM drawio](https://github.com/user-attachments/assets/87c54f9e-50d1-4591-8631-c9b9cca59438)


**YOU CAN DOWNLOAD THE PDF OF THE SYSTEM DESIGN IN THE LINK BELOW**

[ATM.drawio.pdf](https://github.com/user-attachments/files/18885948/ATM.drawio.pdf)


**Key Points**:  
- **Frontend**: React, TypeScript, Zustand for stores, Tailwind for styling, Vite for dev server.  
- **Stores**:  
  1. **`BlueScreenStore`** – UI navigation, authentication status, ATM button bindings.  
  2. **`FinancialStore`** – Manages user’s balance, dailyUsed, deposit/withdraw logic, hooking into mock services.  
- **Mock Services** (`financialServices.ts`):  
  - In-memory array with 3 users (unique cardNumber, PIN, dailyUsed, userCardType).  
  - Perform deposit/withdraw, validate PIN, etc.  
- **CI/CD** (Placeholder): Potential GitHub Actions pipeline for auto-tests + Docker builds.  
- **Architecture Approach**: A “modular monolith” concept in the backend if extended, plus a “modular” FE approach with separate views and shared components.

---

## **Installation & Running the Project**

### **Docker Approach**

1. **Clone** the repository:
   ```bash
   git clone https://github.com/MauricioRaini/atm_UI.git
   cd atm_UI
   ```
2. **Build** the Docker image:
   ```bash
   docker build -t atm_ui .
   ```
   This uses a multi-stage build (Node + NGINX) to compile the React app.
3. **Run** the container:
   ```bash
   docker run --rm -d -p 8080:80 --name atm-frontend atm_ui
   ```
   Access at [http://localhost:8080](http://localhost:8080).

### **Local Development (npm & Vite)**

1. **Install** dependencies:
   ```bash
   npm install
   ```
   or `yarn install`.

2. **Start** the dev server (Vite):
   ```bash
   npm run dev
   ```
   The console prints a local URL, typically [http://localhost:5173](http://localhost:5173).

3. **Run Tests**:
   ```bash
   npm test
   ```
   or
   ```bash
   npm run test:watch
   ```

### **Running Storybook**
We created the **visual components** in **Storybook**:  
```bash
npm run storybook
```
Open [http://localhost:6006](http://localhost:6006). You’ll see each component (ATMButton, NumericKeyboard, etc.) in isolation for rapid UI iteration.

### **Project Requirements**

- **Node.js** (v18 or higher recommended)  
- **npm** or **yarn**  
- **Docker** (optional, if you want container-based distribution)  
- No extra environment variables required by default.

### **User Credentials & Multi-User Flow**

We have a **mock DB** with 3 sample accounts:

```ts
const mockDB: MockUser[] = [
  {
    id: "userA",
    pin: "000000",
    cardNumber: "000000",
    name: "Ethan Blake",
    balance: 5000,
    dailyLimit: 2000,
    dailyUsed: 0,
  },
  {
    id: "userB",
    pin: "111111",
    cardNumber: "111111",
    name: "Canelo Alvarez",
    balance: 1000,
    dailyLimit: 300,
    dailyUsed: 100,
  },
  {
    id: "userC",
    pin: "222222",
    cardNumber: "222222",
    name: "Peter Parker",
    balance: 3000,
    dailyLimit: 700,
    dailyUsed: 200,
  },
];
```

- **CardNumber** & **PIN** **ARE THE KEY ACCESS AND THE WAY TO AUTHENTICATE YOURSELF IN THE PIN ENTRY SCREEN**. For instance, `cardNumber=000000` OR `pin=000000` => Ethan.  
- Once logged in, you can do deposit/withdraw, etc.  
- Try depositing to someone else’s card number for a multi-user example.

---

## **4) Public Deployment on Vercel**

We have deployed the app publicly at:

- **[https://atm-ui-five.vercel.app/](https://atm-ui-five.vercel.app/)**

This is a **static build** served through Vercel.

1. **Vercel** is a good option for me in this case because it connects through Github to you account and allows CI/CD to automatically update the public page.
2. **No** separate backend needed—since we use a mock DB in the front-end.
3. You can log in with e.g. **cardNumber=000000**, **pin=000000** (Ethan), or the other combos above.

---

## **Main Overview of Components & Design Patterns**

**1. Components**  
- **`ATMButton`**: Reusable button with tailwind.  
- **`DynamicLabel`**: For animated text transitions.  
- **`NumericKeyboard`**: On-screen keypad capturing digit entry.  
- **`InputField`**: With optional numeric masking, validations.

**2. Views**  
- **`WelcomeScreen`**: Basic landing page.  
- **`PINEntryScreen`**: Takes user’s cardNumber + PIN, calls `validatePIN`.  
- **`WithdrawScreen`**: Choose a common amount or “other,” check daily limit, update mock DB.  
- **`DepositScreen`**: Enter account #, deposit, daily usage, cross-user.  
- **`BalanceScreen`**: Simple display of user’s current balance.  
- **`MainMenu`**: The main ATM menu with selections.

**3. Zustand Stores**  
- **`BlueScreenStore`**: Navigational context, auth, button bindings for the physical-like side buttons.  
- **`FinancialStore`**: The domain logic around user’s finances, referencing the services for deposit/withdraw, balances, etc.

### **Test-Driven Development (Given/When/Then)**
All major logic was built with TDD:
- **Given** some initial scenario (user’s dailyUsed=100, dailyLimit=300),  
- **When** a deposit or withdraw is performed,  
- **Then** we expect the new balance or limitUsed to reflect accordingly.  

We used **Jest** + **React Testing Library** for unit tests and coverage.

---

## **How to Collaborate & Best Practices**

1. **Branching Model**  
   - Use feature branches: `feature/deposit-improvements`, etc.  
   - Merge to `dev` or `main` via Pull Requests.  

2. **Commit Messages**  
   - Keep them short + descriptive: `feat: multi-user deposit logic`.

3. **Coding Style**  
   - ESLint + Prettier are configured.  
   - `camelCase` for functions, `PascalCase` for components, etc.

4. **Pull Requests**  
   - Summarize changes, include relevant screenshots if UI changes.  
   - Ensure local tests (`npm test`) pass.

5. **Documentation**  
   - Keep README updated.  
   - If you add new store logic or services, add test coverage.

---

## **Responsive Design**

This front-end is **100% responsive**—it adapts seamlessly to various screen sizes (desktop, tablet, mobile). We encourage you to open dev tools in different responsive modes to see the retro ATM UI scale accordingly.

---

## **What’s Next? Roadmap & Future Plans**

Based on your system diagram and the “**what if**” enterprise scenario:

1. **Full Real Backend**  
   - Migrate from mock to a Node/Express server with a real DB (PostgreSQL or MySQL).  
   - Potential Docker orchestration for microservices or “modular monolith.”

2. **Voice / AI Assistant**  
   - Potential integration with LLMs or speech recognition to handle user commands (deposit/withdraw by voice).  
   - RAG (Retrieval-Augmented Generation) for advanced AI logic.

3. **Production Security**  
   - Actual PIN hashing, encryption, rate limiting.  
   - Enhanced error handling, concurrency checks.

4. **Extended UI/UX**  
   - Additional features: transaction history, multi-language.  
   - Full-screen immersive experience or more intuitive transitions.

5. **CI/CD**  
   - Expand placeholders for GitHub Actions to do lint, test, build, push Docker images to a registry, auto-deploy to staging/production.

---

**Thank you for exploring the ATM project!**  

Feel free to submit PRs, open issues, or propose new features.  
We hope this demonstrates our **TDD** approach, **Storybook** integration, **responsive** design, and the **multi-user** mock backend. Happy coding!
