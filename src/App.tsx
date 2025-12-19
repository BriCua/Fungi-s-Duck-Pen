import { useState, useEffect } from "react";
import "./App.css";
import { Layout } from "./components/Layout";
import { AuthPage } from "./pages/AuthPage";
import { CoupleLinkingPage } from "./pages/CoupleLinkingPage";
import { useAuthContext } from "./context/AuthContext";
import { Spinner } from "./components/ui";
import DuckClicker from "./components/DuckClicker";
import { UserInfoModal, type ProfileData } from "./components/UserInfoModal";
import { authService } from "./firebase/authService";
import { coupleService } from "./firebase/coupleService";
import type { User } from "./types/user";
import { ProfilePage } from "./pages/ProfilePage";
import { Routes, Route, Navigate } from "react-router-dom"; // Import Routes, Route, Navigate
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import NotificationsPage from "./pages/NotificationsPage"; // Import NotificationsPage
import GoalsPage from "./pages/GoalsPage"; // Import GoalsPage

function AppContent() {
  const { user, loading, setUser, couple } = useAuthContext();
  const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
  const [hasSkippedProfile, setHasSkippedProfile] = useState(false);

  useEffect(() => {
    // Only check to show the modal if the user is past the couple linking stage.
    const shouldOpen = (user && user.coupleId && !user.birthdate && !hasSkippedProfile);
    if (shouldOpen && !isUserInfoModalOpen) {
      setIsUserInfoModalOpen(true);
    } else if (!shouldOpen && isUserInfoModalOpen) {
      setIsUserInfoModalOpen(false);
    }
  }, [user, hasSkippedProfile, isUserInfoModalOpen]);

  const handleProfileUpdate = async (data: ProfileData) => {
    if (!user) return;
    try {
      // 1. Update user-specific info
      // Only update if birthdate was provided, as displayName is always present.
      if (data.birthdate) {
        await authService.updateUserProfile(user.uid, data.displayName, data.birthdate);
      }

      // 2. Update couple-specific info
      const { relationshipStatus, anniversary, meetStory } = data;
      if (user.coupleId && user.uid === couple?.createdBy && (relationshipStatus || anniversary || meetStory)) {
        await coupleService.updateCoupleDetails(user.coupleId, {
          relationshipStatus,
          anniversary: anniversary === null ? undefined : anniversary, // Convert null to undefined
          meetStory,
        });
      }

      // 3. Update local state to reflect changes and close modal
      const updatedUser = {
        ...user,
        displayName: data.displayName || user.displayName,
        birthdate: data.birthdate ? data.birthdate.getTime() : user.birthdate,
      };
      setUser(updatedUser as User);
      setIsUserInfoModalOpen(false);

    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleSkipProfile = () => {
    setIsUserInfoModalOpen(false);
    setHasSkippedProfile(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // --- Routing Logic ---
  return (
    <>
      <UserInfoModal
        isOpen={isUserInfoModalOpen}
        onClose={handleSkipProfile}
        onSubmit={handleProfileUpdate}
        initialDisplayName={user?.displayName || ''}
        skipText="Skip for now"
        isPartner={user?.uid !== couple?.createdBy}
      />
      <Routes>
        {/* Auth Page - accessible only if not authenticated */}
        <Route path="/auth" element={<ProtectedRoute isAuthPage><AuthPage /></ProtectedRoute>} />
        
        {/* Couple Linking Page - accessible if authenticated but no couple */}
        <Route path="/link-couple" element={<ProtectedRoute requiresCoupleLinking><CoupleLinkingPage /></ProtectedRoute>} />

        {/* Protected Routes - require authentication and coupleId */}
        <Route path="/" element={<ProtectedRoute requiresAuthAndCouple><Layout><DuckClicker /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute requiresAuthAndCouple><Layout><ProfilePage /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute requiresAuthAndCouple><Layout><NotificationsPage /></Layout></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute requiresAuthAndCouple><Layout><GoalsPage /></Layout></ProtectedRoute>} />


        {/* Redirects or Fallback */}
        <Route
          path="*"
          element={
            !user ? (
              <Navigate to="/auth" replace />
            ) : !user.coupleId ? (
              <Navigate to="/link-couple" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
