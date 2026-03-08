# DevLog - Developer Learning Journal & Project Tracker

DevLog is a high-end, professional productivity application designed for developers to document their learning journey, track project progress, and archive valuable resources. Built with a focus on **precision, speed, and sophisticated minimalist aesthetics**, DevLog provides a "Linear-level" experience for the modern engineer.

![Dashboard Preview](https://github.com/vicky-dev/DevLog/raw/main/public/preview.png)

## Core Features

-   **Learning Journals**: Document daily insights with a fast, markdown-ready interface.
-   **Project Pipeline**: Track your initiatives from 'Planning' to 'Completed' with linked activity logs.
-   **Resource Vault**: Archive and categorize technical articles, documentation, and tools.
-   **Operational Dashboard**: Visualize your development cycle with 7-day density charts, tag statistics, and activity streaks.
-   **High-End UI**: A custom-engineered design system featuring "Vercel-grade" glassmorphism and the premium **Plus Jakarta Sans** typography.

## Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Database**: [Prisma ORM](https://www.prisma.io/) with SQLite
-   **Charts**: [Recharts](https://recharts.org/)
-   **Icons**: [Lucide React](https://lucide-dev.github.io/lucide-react/)
-   **Animation**: Custom CSS Keyframes & Tailwind Transitions

## Getting Started

### Prerequisites

-   Node.js 18.x or later
-   npm or yarn

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/swarajladke/devlog.git
    cd DevLog
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Database**:
    Initialize your SQLite database and run the migrations:
    ```bash
    npx prisma generate
    npx prisma db push
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technical Architecture

DevLog is built with a **Client-Side First** philosophy for the UI, backed by robust RESTful API routes.

### API Architecture Example: `PUT /api/logs`
The logs API handles high-frequency writes with strict validation. Relationships between logs and projects are managed via Prisma's `connect` and `set` operators, ensuring atomic updates:

```typescript
// app/api/logs/route.ts
export async function PUT(request: Request) {
    const body = await request.json();
    const { id, title, description, tags, projectIds } = body;

    return await prisma.log.update({
        where: { id },
        data: {
            title,
            description,
            tags,
            projects: {
                set: projectIds?.map((id: string) => ({ id })) || []
            }
        }
    });
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with precision by **Alex** (DevLog Registry)
