import { removeBackground, loadImage } from './removeBackground';

export const processLogoImage = async (imagePath: string): Promise<string> => {
  try {
    // Fetch the image
    const response = await fetch(imagePath);
    const blob = await response.blob();
    
    // Load as HTMLImageElement
    const imageElement = await loadImage(blob);
    
    // Remove background
    const processedBlob = await removeBackground(imageElement);
    
    // Convert blob to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(processedBlob);
    });
  } catch (error) {
    console.error('Error processing logo:', error);
    throw error;
  }
};
