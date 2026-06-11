import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ResumeAuditor from "@/components/ResumeAuditor";
import DashboardHeader from "@/components/DashboardHeader";
import styles from "./dashboard.module.css";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className={styles.shell}>
      <DashboardHeader user={session.user} />
      <main className={styles.main}>
        <div className={styles.welcomeBanner}>
          <p className={styles.greeting}>
            Welcome back, <strong>{session.user.name?.split(' ')[0] ?? 'there'}</strong> 👋
          </p>
          <p className={styles.greetingSub}>
            Paste your resume below to strip out the AI fluff and boost your signal.
          </p>
        </div>
        <ResumeAuditor />
      </main>
    </div>
  );
}
