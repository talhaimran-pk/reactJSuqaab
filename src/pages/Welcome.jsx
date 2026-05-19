// src/pages/Welcome.jsx
import { useNavigate } from 'react-router-dom';
import { Home, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCurrentUser } from '../hooks/useAuth';
import { theme } from '../theme';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className={theme.page.centered}>
        <div className={theme.ui.spinner} />
      </div>
    );
  }

  return (
    <div className={theme.page.centered}>
      <div className="w-full max-w-sm px-6">

        {/* Empty state card */}
        <div className={`${theme.card.lg} flex flex-col items-center text-center gap-6`}>

          {/* Gold line */}
          <div className={theme.divider.gold} />

          {/* Icon box */}
          <div className={theme.ui.iconBox}>
            <Home className="w-6 h-6 text-[#c5a880]" />
          </div>

          {/* Greeting */}
          <div className="space-y-2">
            <h1 className={theme.type.h2}>
              Welcome, {user?.full_name || user?.name || 'User'}
            </h1>
            <p className={theme.type.body}>
              You don't have any properties set up yet.
              Add your first one to get started.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => navigate('/add-property')}
            className={`${theme.button.primary} ${theme.button.full}`}
          >
            Add Your First Property
          </button>

          {/* Gold line */}
          <div className={theme.divider.gold} />

        </div>
      </div>
    </div>
  );
};

export default Welcome;