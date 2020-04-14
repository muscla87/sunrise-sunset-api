export function toHHMMSS(seconds: number) {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);

    return (hours < 10 ? "0" + hours : hours) + ':'
        + (minutes < 10 ? "0" + minutes : minutes) + ':'
        + (seconds < 10 ? "0" + seconds : seconds);
}