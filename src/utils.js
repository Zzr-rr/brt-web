

export function formatDateTime(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() 返回的是0-11，代表1-12月
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // 使用padStart方法确保月份和日期是两位数格式
    const formattedMonth = String(month).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${year}年${formattedMonth}月${formattedDay}日 ${formattedHours}:${formattedMinutes}`;
}