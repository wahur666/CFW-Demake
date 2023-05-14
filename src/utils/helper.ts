
export function isElectron(): boolean {
    return navigator.userAgent.indexOf("Electron") >= 0;
}
