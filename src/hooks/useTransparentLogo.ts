import { useState, useEffect } from 'react';
import logo from '@/assets/greenbox-logo.png';

export const useTransparentLogo = () => {
  const [logoSrc, setLogoSrc] = useState(logo);

  useEffect(() => {
    const transparentLogo = localStorage.getItem('greenbox-logo-transparent');
    if (transparentLogo) {
      setLogoSrc(transparentLogo);
    }
  }, []);

  return logoSrc;
};
