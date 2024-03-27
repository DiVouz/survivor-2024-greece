
function gotoPlayerPage(name) {
    if (!name || name === null || name === '' || name === ' ' || name === 'unknown') {
        return;
    }

    const url = new URL(window.location.href);
    url.pathname = '/player.html';
    url.searchParams.set('name', name);

    window.location.href = url.href;
}
