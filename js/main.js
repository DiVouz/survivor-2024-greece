function gotoPlayerPage(newPath, params) {
    const currentUrl = new URL(window.location.href);
    const baseCurrentPath = currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/'));
    currentUrl.pathname = `${baseCurrentPath}/${newPath}`;

    currentUrl.searchParams.forEach((value, key) => {
        currentUrl.searchParams.delete(key);
    });

    if (params !== undefined && params !== null) {
        for (const [key, value] of Object.entries(params)) {
            currentUrl.searchParams.set(key, value);
        }
    }
    
    window.location.href = currentUrl;
}
