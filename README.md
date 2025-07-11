 ## Real-Time Collaborative Document Editor 

*COMPANY*: CODTECH IT SOLUTIONS

*NAME*: B HASINI

*INTERN ID*: CT06DH1201

*DOMAIN*: Full Stack Web Development

*DURATION*: 6 WEEEKS

*MENTOR*:NEELA SANTOSH

# Real-Time Collaborative Document Editor

A feature-rich, real-time collaborative document editor built with Next.js (React), designed for seamless multi-user editing with modern UI and smooth animations.

## ✨ Features

*   **Real-time Collaborative Editing**: Multiple users can edit the same document simultaneously, with changes instantly synchronized across all active users.
*   **User Presence & Cursors**: See who else is currently viewing or editing the document, with live cursor positions and selections of other collaborators.
*   **Typing Indicators**: Visual feedback showing when other users are actively typing.
*   **Rich Text Formatting (Planned)**: A toolbar for common text formatting options (bold, italic, underline, alignment).
*   **Commenting System**: Add and manage comments on specific sections of the document, fostering collaboration and discussions.
*   **Document Management**: Create, save, and manage multiple documents.
*   **Responsive Design**: A modern, clean, and responsive user interface built with Tailwind CSS.
*   **Smooth Animations**: Utilizes Framer Motion for delightful UI transitions and interactions.
*   **Backend & Database Integration**: API routes for document management and sample scripts for PostgreSQL and MongoDB setup.
*   **WebSocket Integration**: A standalone Node.js WebSocket server to handle real-time communication.

## 🚀 Technologies Used

**Frontend:**
*   [Next.js](https://nextjs.org/) (React Framework)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS](https://tailwindcss.com/)
*   [Framer Motion](https://www.framer.com/motion/) (Animations)
*   [shadcn/ui](https://ui.shadcn.com/) (Component Library)
*   [Lucide React](https://lucide.dev/icons/) (Icons)

**Backend:**
*   [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) (for RESTful API)
*   [Node.js](https://nodejs.org/) (for WebSocket server)
*   [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) (for real-time communication, typically via `ws` or `socket.io` in a full setup)

**Database (Examples):**
*   [PostgreSQL](https://www.postgresql.org/) (via `psycopg2-binary` for setup script)
*   [MongoDB](https://www.mongodb.com/) (via `pymongo` for setup script)

## 📦 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js** (v18.x or higher recommended): [Download Node.js](https://nodejs.org/en/download/)
*   **npm** (comes with Node.js)
*   **Python 3.x** (if you plan to use the database setup scripts): [Download Python](https://www.python.org/downloads/)
*   **PostgreSQL** (if using the PostgreSQL script): [Download PostgreSQL](https://www.postgresql.org/download/)
*   **MongoDB** (if using the MongoDB script): [Download MongoDB Community Edition](https://www.mongodb.com/try/download/community)

### Installation

1.  **Clone the repository or download the project files:**
    If you downloaded a ZIP, extract it to a directory of your choice.

2.  **Navigate to the project directory:**
    Open your terminal or command prompt and change to the project folder:
    ```bash
    cd collaborative-editor ```

## Project Structure
```
simple-task-manager/
├── public/                 # Static assets
├── src/
│   ├── App.tsx             # Main application component
│   ├── index.css           # Global styles
│   ├── main.tsx            # Entry point
│   ├── components/
│   │   ├── TaskItem.tsx    # Component for individual tasks
│   │   └── TaskList.tsx    # Component for displaying the list of tasks
│   └── hooks/
│       └── useTasks.ts     # Custom hook for task logic and local storage
├── package.json            # Project dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
├── vite.config.ts          # Vite build configuration
└── README.md               # This file
```


3. **Install dependencies:**

```shellscript
npm install
# or
yarn install
```




### Running the Application

To start the development server:

```shellscript
npm run dev
# or
yarn dev
```

The application will typically open in your browser at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

1. **Add a Task**: Type your task into the input field at the top and press `Enter` or click the "Add Task" button.
2. **Complete a Task**: Click on a task's text to toggle its completion status. Completed tasks will have a strikethrough.
3. **Delete a Task**: Click the "X" button next to a task to remove it from the list.
4. **Filter Tasks**: Use the "All", "Active", and "Completed" buttons at the bottom to filter your task list.



## Contributing

Contributions are welcome! If you have suggestions for improvements or find any bugs, please feel free to:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'feat: Add new feature'`).
5. Push to the branch (`git push origin feature/your-feature-name`).
6. Open a Pull Request.

## 🙋‍♂️ Developed By

**Hasini**
📧 Email: [hasinibiyyala833@gmail.com](mailto:hasinibiyyala833@gmail.com)


## License

This project is open-source and available under the [MIT License](LICENSE).

## OUTPUT:
<img width="1855" height="986" alt="Image" src="https://github.com/user-attachments/assets/c8580295-6958-4157-8175-08c4ab1cd923" />
