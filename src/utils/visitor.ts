// Génère un ID unique pour le visiteur
const generateVisitorId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomStr}`;
  };
  
  // Récupère l'ID du visiteur depuis le localStorage ou en crée un nouveau
  export const getVisitorId = (): string => {
    const storageKey = 'visitor_id';
    let visitorId = localStorage.getItem(storageKey);
    
    if (!visitorId) {
      visitorId = generateVisitorId();
      localStorage.setItem(storageKey, visitorId);
    }
    
    return visitorId;
  };