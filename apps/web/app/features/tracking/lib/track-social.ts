export const trackSocial = (social: string) => {
    const gtag = (globalThis as unknown as Window).gtag;
    if (!gtag) return;

    gtag("event", "view_social", {
        provider: social,
    });
};
