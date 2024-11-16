import React from 'react';
import { Calendar, Clock, Tag, Users, ExternalLink, Check, Video, Coins, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  tags: string[];
  skills: string[];
  description: string;
  imageUrl: string;
  onRegister: () => void;
  requiresAuth?: boolean;
  externalLink?: string;
  isAuthenticated?: boolean;
  isRegistered?: boolean;
  price?: number;
  meetingLink?: string;
  xp?: number;
}

export default function EventCard({
  id,
  title,
  date,
  time,
  tags,
  skills,
  description,
  imageUrl,
  onRegister,
  requiresAuth,
  externalLink,
  isAuthenticated,
  isRegistered,
  price,
  meetingLink,
  xp
}: EventCardProps) {
  const navigate = useNavigate();

  const getButtonConfig = () => {
    if (isRegistered && meetingLink) {
      return {
        text: 'Join Meeting',
        icon: Video,
        className: 'bg-green-600 hover:bg-green-700 text-white',
        disabled: false
      };
    }

    if (isRegistered) {
      return {
        text: 'Registered',
        icon: Check,
        className: 'bg-purple-100 text-purple-600 cursor-default',
        disabled: true
      };
    }

    if (externalLink) {
      return {
        text: 'Register on Lu.ma',
        icon: ExternalLink,
        className: 'bg-purple-600 hover:bg-purple-700 text-white',
        disabled: false
      };
    }

    if (requiresAuth && !isAuthenticated) {
      return {
        text: 'Connect to Register',
        icon: Users,
        className: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        disabled: false
      };
    }

    return {
      text: 'Register Now',
      icon: Calendar,
      className: 'bg-indigo-600 hover:bg-indigo-700 text-white',
      disabled: false
    };
  };

  const buttonConfig = getButtonConfig();

  const handleCardClick = (e: React.MouseEvent) => {
    if (externalLink) {
      e.preventDefault();
      window.open(externalLink, '_blank', 'noopener,noreferrer');
      return;
    }
    navigate(`/events/${id}`);
  };

  return (
    <div className="relative h-full">
      <div className="bg-white rounded-xl shadow-lg transition-all duration-300 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 cursor-pointer" onClick={handleCardClick}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden group rounded-t-xl">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content Container */}
        <div className="p-6 flex-grow flex flex-col">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm flex items-center gap-1 hover:bg-indigo-100 transition-colors cursor-default group"
              >
                <Tag className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 text-gray-800 hover:text-indigo-600 transition-colors">
            {title}
          </h3>
          
          {/* Event Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-sm">{date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span className="text-sm">{time}</span>
              </div>
            </div>
            {(price || xp) && (
              <div className="flex items-center gap-4">
                {price && (
                  <div className="flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">{price} EX3</span>
                  </div>
                )}
                {xp && (
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium">{xp} XP</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Skills */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>Skills you'll gain:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-purple-50 text-purple-600 rounded-lg text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            {/* Button Container */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (externalLink) {
                    window.open(externalLink, '_blank', 'noopener,noreferrer');
                    return;
                  }
                  onRegister();
                }}
                disabled={buttonConfig.disabled}
                className={`px-4 py-2 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2 min-w-[140px] justify-center ${buttonConfig.className}`}
              >
                <buttonConfig.icon className={`w-4 h-4 ${isRegistered ? '' : 'group-hover:rotate-12 transition-transform'}`} />
                {buttonConfig.text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}