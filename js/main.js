
function gotoPlayerPage(name) {
    if (!name || name === null || name === '' || name === ' ' || name === 'unknown') {
        return;
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.pathname = currentUrl.pathname.substring(0, currentUrl.pathname.lastIndexOf('/')) + "/player.html";
    currentUrl.searchParams.set('name', name);

    window.location.href = currentUrl;
}
