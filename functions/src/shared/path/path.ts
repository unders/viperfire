export const profilePath = '/profile/:uid';
export const newProfilePath = function(uid: string): string  {
    return `/profile/${uid}`;
};

export const aboutPath = '/about';

export const articlePath = '/article:id';
export const articleListPath = '/';
