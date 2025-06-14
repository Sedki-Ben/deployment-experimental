import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLocalizedArticleContent } from '../hooks/useArticles';
import ArticleImage from './ArticleImage';

const ArticleCard = ({ article }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const localizedContent = getLocalizedArticleContent(article, i18n.language);

  // Get theme colors based on category
  const getThemeColors = (category) => {
    switch (category) {
      case 'etoile-du-sahel':
        return {
          primary: 'from-red-500 to-red-600',
          light: 'from-red-50 to-red-100',
          text: 'text-red-700',
          border: 'border-red-200',
          icon: 'text-red-500',
          darkGradient: 'dark:from-red-900/20 dark:to-red-800/20',
          darkBorder: 'dark:border-red-800/30',
          hover: 'hover:border-red-300 dark:hover:border-red-700'
        };
      case 'the-beautiful-game':
        return {
          primary: 'from-green-500 to-emerald-600',
          light: 'from-green-50 to-emerald-100',
          text: 'text-green-700',
          border: 'border-green-200',
          icon: 'text-green-500',
          darkGradient: 'dark:from-green-900/20 dark:to-emerald-800/20',
          darkBorder: 'dark:border-green-800/30',
          hover: 'hover:border-green-300 dark:hover:border-green-700'
        };
      case 'all-sports-hub':
        return {
          primary: 'from-purple-500 to-indigo-600',
          light: 'from-purple-50 to-indigo-100',
          text: 'text-purple-700',
          border: 'border-purple-200',
          icon: 'text-purple-500',
          darkGradient: 'dark:from-purple-900/20 dark:to-indigo-800/20',
          darkBorder: 'dark:border-purple-800/30',
          hover: 'hover:border-purple-300 dark:hover:border-purple-700'
        };
      default:
        return {
          primary: 'from-gray-500 to-gray-600',
          light: 'from-gray-50 to-gray-100',
          text: 'text-gray-700',
          border: 'border-gray-200',
          icon: 'text-gray-500',
          darkGradient: 'dark:from-gray-900/20 dark:to-gray-800/20',
          darkBorder: 'dark:border-gray-800/30',
          hover: 'hover:border-gray-300 dark:hover:border-gray-700'
        };
    }
  };

  const theme = getThemeColors(article.category);

  const getAuthorName = () => {
    return article.author?.name || 'Unknown Author';
  };

  return (
    <Link 
      to={`/article/${article.slug || article.id}`}
      className={`block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:shadow-none transition-all duration-300 overflow-hidden border ${theme.border} ${theme.hover}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ArticleImage
          src={article.image}
          alt={localizedContent?.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {localizedContent?.title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
          {localizedContent?.excerpt}
        </p>

        {/* Publishing Date */}
        <div className="mb-3">
          <span className={`text-xs ${theme.text} font-medium`}>
            {new Date(article.publishedAt || article.date).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : i18n.language === 'fr' ? 'fr-FR' : 'en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Meta information */}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
            <ArticleImage
              src={article.authorImage}
              alt={getAuthorName()}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {getAuthorName()}
            </span>
          </div>
          
          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
            <span className={`text-sm ${theme.text} flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
              <span>{typeof article.likes === 'object' ? (article.likes.count || 0) : (article.likes || 0)}</span>
              <span>❤️</span>
            </span>
            <span className={`text-sm ${theme.text} flex items-center ${isRTL ? 'space-x-reverse space-x-1' : 'space-x-1'}`}>
              <span>{article.comments || 0}</span>
              <span>💬</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard; 