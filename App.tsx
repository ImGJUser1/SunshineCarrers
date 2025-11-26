import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { 
  Dashboard, 
  StudyAbroad, 
  JobPortal, 
  CountryExplorer, 
  AiMarketplace, 
  Learning, 
  AboutUs,
  FreelanceMarketplace,
  ConsultantConnect,
  SuccessStoriesPage,
  ContactPage,
  PrivacyPolicy,
  HelpCenter,
  TermsOfService,
  PartnerWithUs
} from './components/Modules';
import { AdminCMS} from './components/AdminCMS';
import { DynamicPage } from './components/DynamicPage';
import { ContentManager } from './components/ContentManager';
import { AppRoute } from './types';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Main Routes */}
          <Route path={AppRoute.DASHBOARD} element={<Dashboard />} />
          <Route path={AppRoute.STUDY_ABROAD} element={<StudyAbroad />} />
          <Route path={AppRoute.JOBS} element={<JobPortal />} />
          <Route path={AppRoute.INTERNSHIPS} element={<JobPortal isInternship={true} />} />
          <Route path={AppRoute.FREELANCE} element={<FreelanceMarketplace />} />
          <Route path={AppRoute.COUNTRIES} element={<CountryExplorer />} />
          <Route path={AppRoute.AI_MARKETPLACE} element={<AiMarketplace />} />
          <Route path={AppRoute.LEARNING} element={<Learning />} />
          <Route path={AppRoute.CONSULTANTS} element={<ConsultantConnect />} />
          <Route path={AppRoute.ABOUT} element={<AboutUs />} />
          
          {/* New Footer Pages */}
          <Route path={AppRoute.SUCCESS_STORIES} element={<SuccessStoriesPage />} />
          <Route path={AppRoute.CONTACT} element={<ContactPage />} />
          <Route path={AppRoute.PRIVACY} element={<PrivacyPolicy />} />
          <Route path={AppRoute.HELP} element={<HelpCenter />} />
          <Route path={AppRoute.TERMS} element={<TermsOfService />} />
          <Route path="/partner-with-us" element={<PartnerWithUs />} />

          {/* CMS Routes */}
          <Route path={AppRoute.ADMIN} element={<AdminCMS />} />
          <Route path="/p/:slug" element={<DynamicPage />} />

          {/* Admin Content Management Routes */}
          <Route path="/admin/content/jobs" element={<ContentManager contentType="jobs" />} />
          <Route path="/admin/content/learning" element={<ContentManager contentType="learning" />} />
          <Route path="/admin/content/freelance" element={<ContentManager contentType="freelance" />} />
          <Route path="/admin/content/study-abroad" element={<ContentManager contentType="study-abroad" />} />
          <Route path="/admin/content/ai-marketplace" element={<ContentManager contentType="ai-tools" />} />
          <Route path="/admin/content/consultants" element={<ContentManager contentType="consultants" />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to={AppRoute.DASHBOARD} replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
