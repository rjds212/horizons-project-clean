
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

// A simple component for social icons since we don't have a full library
const SocialIcon = ({ type }) => {
  const icons = {
    whatsapp: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
        <title>WhatsApp</title>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.816-.916-.983c-.246-.168-.496-.18-.693-.18h-.59c-.225 0-.59.075-.882.372-.29.297-1.09.966-1.09 2.372 0 1.406 1.113 2.758 1.262 2.956.149.198 2.203 3.469 5.338 4.726.775.306 1.389.487 1.853.625.729.218 1.396.188 1.915.112.591-.08 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.204-1.634a11.86 11.86 0 005.785 1.47h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    ),
    instagram: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
        <title>Instagram</title>
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.784.297-1.459.717-2.126 1.384S.926 3.356.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.297.784.717 1.459 1.384 2.126.667.666 1.342 1.086 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.784-.297 1.459-.718 2.126-1.384.666-.667 1.086-1.342 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.277.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.148-.558-2.913-.297-.784-.718-1.459-1.384-2.126C21.314 1.64 20.64 1.22 19.856.928c-.765-.296-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.488.96-.91 1.381-.419.42-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.488-1.379-.91-.42-.419-.69-.824-.91-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.859 0-3.211.016-3.586.061-4.859.061-1.171.255-1.816.42-2.236.224-.569.488-.96.91-1.379.419-.42.819-.69 1.379-.91.42-.165 1.065-.359 2.236-.42.99-.04.99-.06 4.859-.06l.001.001zm0 5.48c-1.811 0-3.27 1.46-3.27 3.27s1.459 3.27 3.27 3.27 3.27-1.46 3.27-3.27-1.459-3.27-3.27-3.27zm0 5.4c-1.179 0-2.131-.952-2.131-2.131s.952-2.131 2.131-2.131 2.131.952 2.131 2.131-.952 2.131-2.131 2.131zm6.045-6.45c0 .795-.645 1.44-1.44 1.44s-1.44-.645-1.44-1.44.645-1.44 1.44-1.44 1.44.645 1.44 1.44z"/>
      </svg>
    ),
    facebook: (
      <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 fill-current">
        <title>Facebook</title>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  };
  return icons[type] || null;
};

const ShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shareOptions = [
    { name: 'WhatsApp', icon: 'whatsapp', color: 'bg-green-500', hover: 'hover:bg-green-600' },
    { name: 'Instagram', icon: 'instagram', color: 'bg-pink-500', hover: 'hover:bg-pink-600' },
    { name: 'Facebook', icon: 'facebook', color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
    { name: 'Email', icon: 'mail', color: 'bg-gray-500', hover: 'hover:bg-gray-600' },
  ];

  const handleShare = (option) => {
    const url = window.location.href;
    const text = "¡Mira esta increíble app de rifas!";
    let shareUrl = '';

    switch (option.name) {
      case 'WhatsApp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'Facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'Email':
        shareUrl = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
      case 'Instagram':
        // Instagram doesn't have a direct web share link, so we notify the user.
        alert("Para compartir en Instagram, copia el enlace y pégalo en tu historia o biografía.");
        navigator.clipboard.writeText(url);
        return;
      default:
        return;
    }
    window.open(shareUrl, '_blank');
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? <X /> : <Share2 />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {shareOptions.map((option, index) => (
              <motion.div
                key={option.name}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <span className="bg-black/30 text-white text-sm px-3 py-1 rounded-md">{option.name}</span>
                <Button
                  size="icon"
                  className={`${option.color} ${option.hover} rounded-full w-12 h-12`}
                  onClick={() => handleShare(option)}
                >
                  {option.icon === 'mail' ? <Mail /> : <SocialIcon type={option.icon} />}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButton;
