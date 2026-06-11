import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import MazeLogo from "@/components/MazeLogo";
import styles from "./landing.module.css";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const ctaDest = session ? "/dashboard" : "/signup";
  const loginDest = session ? "/dashboard" : "/login";

  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <div className={styles.brandIconWrapper}>
              <MazeLogo size={18} className={styles.brandIcon} />
            </div>
            <span className={styles.brandText}>maze</span>
          </div>
          <div className={styles.navLinks}>
            {!session && (
              <Link href={loginDest} className={styles.loginBtn}>
                Sign In
              </Link>
            )}
            <Link href={ctaDest} className={styles.navCta}>
              {session ? "Go to Dashboard" : "Get started free"}
            </Link>
          </div>
        </div>
      </nav>

      <main className={styles.main}>
        <div className={styles.hero}>
          <h1 className={styles.title}>
            Strip fluff. <br />
            <span className={styles.highlight}>Ship signal.</span>
          </h1>
          <p className={styles.description}>
            AI-generated resumes are full of generic buzzwords that recruiters hate. 
            Instantly clean up your resume, sound like a human, and land more interviews.
          </p>
          <div className={styles.ctaWrapper}>
            <Link href={ctaDest} className={styles.primaryBtn}>
              Audit Your Resume — Free
              <ArrowRight size={18} />
            </Link>
          </div>
          
          <div className={styles.features}>
            <div className={styles.feature}>
              <CheckCircle2 className={styles.featureIcon} size={16} />
              <span>Instantly removes AI buzzwords</span>
            </div>
            <div className={styles.feature}>
              <CheckCircle2 className={styles.featureIcon} size={16} />
              <span>Improves readability & impact</span>
            </div>
            <div className={styles.feature}>
              <CheckCircle2 className={styles.featureIcon} size={16} />
              <span>100% free, no credit card</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

