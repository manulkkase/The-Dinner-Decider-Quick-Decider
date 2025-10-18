import React, { useState, useEffect, useCallback } from 'react';
import { MenuItem } from './shared/types';
import { getNextSuggestion } from './shared/recEngine';
import { buildPrimaryUrl } from './shared/urlMapper';
import { MenuCard } from './components/MenuCard';
import { addRecentMenu, addDislikedMenu } from './shared/storage';

// Fix for "Cannot find name 'chrome'" error by declaring the global chrome object.
declare const chrome: any;

const App: React.FC = () => {
  const [suggestion, setSuggestion] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [sessionId] = useState(() => crypto.randomUUID());

  const fetchSuggestion = useCallback(async () => {
    setIsLoading(true);
    const newSuggestion = await getNextSuggestion();
    if (newSuggestion) {
      setSuggestion(newSuggestion);
      await addRecentMenu(newSuggestion.id.toString());
    }
    // Artificial delay to show loading state and prevent rapid flashing
    setTimeout(() => {
        setIsLoading(false);
        if (isFirstLoad) setIsFirstLoad(false);
    }, 300);
  }, [isFirstLoad]);

  useEffect(() => {
    fetchSuggestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTryAnother = () => {
    fetchSuggestion();
  };

  const handleDislike = useCallback(async () => {
    if (!suggestion) return;
    
    await addDislikedMenu(suggestion.id.toString());
    // After disliking, immediately fetch a new suggestion
    fetchSuggestion();
  }, [suggestion, fetchSuggestion]);

  const handleViewDetails = () => {
    if (!suggestion) return; // 음식이 없으면 중단

    // 1. URL은 항상 똑같이 만듭니다.
    const url = buildPrimaryUrl(suggestion, sessionId);

    // 2. 실행 환경을 확인합니다.
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      // 3. (A) 익스텐션 환경일 경우: 특별한 API로 새 탭 열기
      chrome.tabs.create({ url });
    } else {
      // 3. (B) localhost 개발 환경일 경우: 일반적인 방식으로 새 탭 열기
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const SkeletonLoader: React.FC = () => (
    <div className="w-full animate-pulse p-4 flex flex-col items-center">
      <div className="h-8 bg-gray-300 rounded-md w-3/4 mb-4"></div>
      <div className="w-full aspect-[16/9] bg-gray-300 rounded-lg mb-6"></div>
      <div className="h-12 bg-gray-300 rounded-lg w-full mb-3"></div>
      <div className="h-12 bg-gray-200 rounded-lg w-full"></div>
    </div>
  );

  return (
    <div className="bg-gray-50 text-gray-800 h-full flex flex-col overflow-hidden">
       <header className="p-4 text-center border-b border-gray-200 flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-700">The Dinner Decider</h1>
      </header>
      <main className="flex-grow p-4 overflow-y-auto">
        <div className="w-full h-full flex justify-center">
            {isLoading && isFirstLoad ? (
              <SkeletonLoader />
            ) : suggestion ? (
              <MenuCard
                item={suggestion}
                onPrimaryClick={handleViewDetails}
                onSecondaryClick={handleTryAnother}
                onDislikeClick={handleDislike}
                isLoading={isLoading}
              />
            ) : (
              <div className="text-center text-gray-500 self-center">
                <p>No suggestions available right now.</p>
                <p>Please try again later.</p>
              </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;