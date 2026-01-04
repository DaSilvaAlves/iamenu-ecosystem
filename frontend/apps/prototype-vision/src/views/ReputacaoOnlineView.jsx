import React, { useState } from 'react';
import Dashboard from './reputacao-online/Dashboard';
import Inbox from './reputacao-online/Inbox';
import AlertSettings from './reputacao-online/AlertSettings';
import ReviewDetail from './reputacao-online/ReviewDetail';
import { ResponseStatus } from './reputacao-online/types';
import { MOCK_REVIEWS } from './reputacao-online/constants';

const ReputacaoOnlineView = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedReview, setSelectedReview] = useState(null);
  const [reviews, setReviews] = useState(MOCK_REVIEWS);

  const handleSelectReview = (review) => {
    setSelectedReview(review);
  };

  const handlePostResponse = (id, response) => {
    setReviews(prev => prev.map(r =>
      r.id === id ? { ...r, response, status: ResponseStatus.REPLIED } : r
    ));
    setSelectedReview(null);
    setActiveTab('inbox');
  };

  const renderContent = () => {
    if (selectedReview) {
      return (
        <ReviewDetail
          review={selectedReview}
          onBack={() => setSelectedReview(null)}
          onPost={handlePostResponse}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <Dashboard onTabChange={setActiveTab} />;
      case 'inbox':
        return <Inbox onSelectReview={handleSelectReview} />;
      case 'settings':
        return <AlertSettings />;
      case 'request':
        return (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center p-8 text-gray-500 gap-4">
            <span className="material-symbols-outlined text-6xl">qr_code_2</span>
            <h2 className="text-xl font-bold text-white uppercase tracking-tighter italic">Pedir Feedback</h2>
            <p className="text-sm px-4">Gere códigos QR para as suas mesas para captar feedback privado antes de este se tornar público.</p>
            <button className="bg-[#F2542D] text-white px-6 py-2.5 rounded-xl font-black uppercase mt-4 shadow-lg shadow-[#F2542D]/20 hover:scale-105 transition-all">
              Gerar Códigos QR
            </button>
          </div>
        );
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default ReputacaoOnlineView;
