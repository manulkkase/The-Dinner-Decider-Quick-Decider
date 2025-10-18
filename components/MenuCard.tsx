import React from 'react';
import { MenuItem, Pairing, LocalTip } from '../shared/types';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { ImageWithFallback } from './ImageWithFallback';


interface MenuCardProps {
  item: MenuItem;
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
  onDislikeClick: () => void;
  isLoading: boolean;
}

const InfoSection: React.FC<{ title: string; icon: string; children: React.ReactNode; }> = ({ title, icon, children }) => (
    <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <span className="mr-2 text-xl">{icon}</span>
            {title}
        </h3>
        {children}
    </div>
);


export const MenuCard: React.FC<MenuCardProps> = ({ item, onPrimaryClick, onSecondaryClick, onDislikeClick, isLoading }) => {
  return (
    <div className={`w-full max-w-sm transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
      
      <div className="rounded-lg overflow-hidden shadow-lg mb-4 bg-gray-200">
        <ImageWithFallback 
          src={item.imageUrl.startsWith('/') ? item.imageUrl : `/${item.imageUrl}`}
          alt={item.name}
          className="w-full h-auto aspect-[16/9] object-cover"
        />
      </div>

      <h2 className="text-3xl font-bold text-center mb-2 truncate" title={item.name}>{item.name}</h2>
      <div className="flex justify-center flex-wrap gap-2 mb-4">
        {item.tags.map(tag => (
            <span key={tag} className="bg-gray-200 text-gray-600 text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize">
                {tag}
            </span>
        ))}
      </div>
      
      <div className="space-y-3 mt-6">
        <PrimaryButton onClick={onPrimaryClick} disabled={isLoading}>
          View details & recipe
        </PrimaryButton>
        <div className="grid grid-cols-4 gap-3">
          <SecondaryButton onClick={onSecondaryClick} disabled={isLoading} className="col-span-3">
            Try another
          </SecondaryButton>
          <button 
              onClick={onDislikeClick}
              disabled={isLoading}
              className="col-span-1 bg-white text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center text-xl"
              aria-label="Dislike this suggestion, don't show it again"
          >
              👎
          </button>
        </div>
      </div>

      <InfoSection title="Fun Fact" icon="💡">
        <p className="text-gray-600 italic bg-gray-100 p-3 rounded-lg">"{item.funFact}"</p>
      </InfoSection>

      <InfoSection title="What to Look For" icon="✅">
        <ul className="list-none space-y-2 text-gray-600">
            {item.checklist.map((check, index) => (
                <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✔</span>
                    <span>{check}</span>
                </li>
            ))}
        </ul>
      </InfoSection>

      {item.pairings && item.pairings.length > 0 && (
        <InfoSection title="Pairings" icon="🤝">
          <div className="space-y-3">
              {item.pairings.map((pairing: Pairing, index: number) => (
                  <div key={index} className="flex items-center bg-gray-100 p-3 rounded-lg">
                      <span className="text-2xl mr-3">{pairing.icon}</span>
                      <div>
                          <p className="font-semibold text-gray-700">{pairing.type}</p>
                          <p className="text-gray-600">{pairing.suggestion}</p>
                      </div>
                  </div>
              ))}
          </div>
        </InfoSection>
      )}
      
      {item.eatLikeLocal && item.eatLikeLocal.length > 0 && (
        <InfoSection title="Local's Tip" icon="💁‍♀️">
          <div className="space-y-3">
              {item.eatLikeLocal.map((tip: LocalTip, index: number) => (
                  <div key={index} className="flex items-start bg-gray-100 p-3 rounded-lg">
                      <span className="text-2xl mr-3 mt-1">{tip.icon}</span>
                      <div>
                          <p className="font-semibold text-gray-700">{tip.title}</p>
                          <p className="text-gray-600">{tip.description}</p>
                      </div>
                  </div>
              ))}
          </div>
        </InfoSection>
      )}

    </div>
  );
};