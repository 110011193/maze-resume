'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { LogOut, ChevronDown } from 'lucide-react';
import MazeLogo from '@/components/MazeLogo';
import styles from './DashboardHeader.module.css';
import Link from 'next/link';

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email?.[0].toUpperCase() ?? '?';

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Brand */}
        <Link href="/" className={styles.brand}>
          <div className={styles.brandIconWrapper}>
            <MazeLogo size={16} />
          </div>
          <span className={styles.brandText}>maze</span>
        </Link>

        {/* Right side */}
        <div className={styles.right} ref={dropdownRef}>
          <div className={styles.userMenuContainer}>
            <button
              className={styles.userMenuBtn}
              onClick={() => setIsOpen(!isOpen)}
              aria-haspopup="true"
              aria-expanded={isOpen}
            >
              <div className={styles.avatar}>
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name ?? 'User'} className={styles.avatarImg} referrerPolicy="no-referrer" />
                ) : (
                  <span className={styles.avatarInitials}>{initials}</span>
                )}
              </div>
              <span className={styles.userNameShort}>
                {user.name?.split(' ')[0] ?? 'Account'}
              </span>
              <ChevronDown size={14} className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
            </button>

            {isOpen && (
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownName}>{user.name ?? 'User'}</p>
                  <p className={styles.dropdownEmail}>{user.email}</p>
                </div>
                <div className={styles.dropdownDivider} />
                <button
                  className={styles.dropdownItem}
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  <LogOut size={14} />
                  <span>Sign out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
