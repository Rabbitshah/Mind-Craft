import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ComponentLibraryPage } from "./pages/ComponentLibrary";
import { CourseCatalog } from "./pages/CourseCatalog";
import { CourseDetail } from "./pages/CourseDetail";
import { ForgotPasswordPage, SignInPage, SignUpPage } from "./pages/AuthPages";
import { InstructorDashboard } from "./pages/InstructorDashboard";
import { LandingPage } from "./pages/LandingPage";
import { LearningPlayerPage } from "./pages/LearningPlayer";
import { LearnerDashboard } from "./pages/LearnerDashboard";
import {
  CheckoutCartPage,
  CheckoutConfirmationPage,
  CheckoutPaymentPage,
} from "./pages/CheckoutPages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/learn"
          element={
            <ProtectedRoute roles={["learner"]}>
              <LearnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:courseId"
          element={
            <ProtectedRoute roles={["learner"]}>
              <LearningPlayerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teach"
          element={
            <ProtectedRoute roles={["instructor"]}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute roles={["learner"]}>
              <CheckoutCartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/payment"
          element={
            <ProtectedRoute roles={["learner"]}>
              <CheckoutPaymentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/confirmation"
          element={
            <ProtectedRoute roles={["learner"]}>
              <CheckoutConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route path="/components" element={<ComponentLibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
