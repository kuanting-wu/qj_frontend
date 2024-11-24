export const convertToSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
};

export const formatSecondsToHMS = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return [hrs, mins, secs]
        .map((val) => String(val).padStart(2, "0"))
        .join(":");
};
